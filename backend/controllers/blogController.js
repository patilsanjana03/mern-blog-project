const Blog = require('../models/Blog');
const redisClient = require('../config/redis'); // <-- Import Redis


// @desc    Create a new blog
// @route   POST /api/blogs
const createBlog = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    
    // Parse tags if they are sent as a comma-separated string from a form
    let tags = [];
    if (req.body.tags) {
      tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(tag => tag.trim());
    }

    // Handle File Uploads (from Multer)
    let image = 'https://via.placeholder.com/800x400?text=No+Image';
    let attachments = [];

    if (req.files) {
      // Handle the main cover image
      if (req.files.image) {
        image = `/uploads/${req.files.image[0].filename}`; // In production, this would be your AWS S3 URL
      }
      // Handle the document attachments
      if (req.files.documents) {
        attachments = req.files.documents.map(file => ({
          filename: file.originalname,
          url: `/uploads/${file.filename}`,
          fileType: file.mimetype
        }));
      }
    }

    const blog = await Blog.create({
      title, content, category, tags, status, image, attachments,
      author: req.user.id,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all published blogs (with Advanced Search, Filter, Sort)
// @route   GET /api/blogs
const getBlogs = async (req, res) => {
  try {
    // 1. Extract queries from the URL (e.g., ?search=react&sort=views&limit=5)
    const { search, category, tag, sort, page = 1, limit = 10 } = req.query;

    // 2. Build the initial query object (Only show published, non-deleted blogs)
    const query = { status: 'published', isDeleted: false };

    // --- FILTERING ---
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] }; // Matches if the array contains the tag

    // --- SEARCHING ---
    // Uses MongoDB's highly optimized $text search via the index we created
    if (search) {
      query.$text = { $search: search };
    }

    // --- SORTING ---
    let sortOption = { createdAt: -1 }; // Default: Newest first
    
    if (sort === 'views') sortOption = { views: -1 };
    if (sort === 'likes') sortOption = { likesCount: -1 }; // Fast integer sort
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    
    // If searching, sort by text relevance score automatically
    if (search && !sort) {
      sortOption = { score: { $meta: 'textScore' } };
    }

    // --- EXECUTION ---
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // If searching, we must select the meta score to sort by it
    const projection = search ? { score: { $meta: 'textScore' } } : {};

    const blogs = await Blog.find(query, projection)
      .populate('author', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for frontend pagination UI
    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: blogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const cacheKey = `blog:${blogId}`;

    // 1. CHECK CACHE FIRST
    const cachedBlog = await redisClient.get(cacheKey);
    if (cachedBlog) {
        console.log('Serving from Redis Cache!');
        return res.status(200).json(JSON.parse(cachedBlog));
    }

    // 2. CACHE MISS: Query MongoDB
    console.log('Serving from MongoDB...');
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { views: 1 } },
      { new: true }
    )
    .populate('author', 'name email')
    .populate('comments.user', 'name');

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // 3. SAVE TO CACHE (Expire after 1 hour / 3600 seconds)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(blog));

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const fs = require('fs'); // Built-in Node.js module for file system operations
const path = require('path');

// @desc    Update a blog
// @route   PUT /api/blogs/:id
const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this blog' });
    }

    // Process new tags if provided
    let tags = blog.tags;
    if (req.body.tags) {
      tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(tag => tag.trim());
    }

    // Prepare updated data
    const updateData = {
      title: req.body.title || blog.title,
      content: req.body.content || blog.content,
      category: req.body.category || blog.category,
      status: req.body.status || blog.status,
      tags: tags,
    };

    // If a new image was uploaded, update the path
    if (req.files && req.files.image) {
      updateData.image = `/uploads/${req.files.image[0].filename}`;
      // Optional Pro-Move: Delete the old image from the server here using fs.unlink
    }

    // If new documents were uploaded, add them to the existing attachments
    if (req.files && req.files.documents) {
      const newDocs = req.files.documents.map(file => ({
        filename: file.originalname,
        url: `/uploads/${file.filename}`,
        fileType: file.mimetype
      }));
      updateData.attachments = [...blog.attachments, ...newDocs];
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // 🔥 CRITICAL: CACHE INVALIDATION
    // Since the blog was just updated, the cached version is now wrong. Delete it.
    await redisClient.del(`blog:${req.params.id}`);

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this blog' });
    }

    // 1. Delete the main image from the server (if it's not the default placeholder)
    if (blog.image && !blog.image.includes('placeholder')) {
      const imagePath = path.join(__dirname, '..', blog.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // 2. Delete all attached documents from the server
    if (blog.attachments && blog.attachments.length > 0) {
      blog.attachments.forEach(doc => {
        const docPath = path.join(__dirname, '..', doc.url);
        if (fs.existsSync(docPath)) fs.unlinkSync(docPath);
      });
    }

    // 3. Delete from database
    await blog.deleteOne();
    res.status(200).json({ message: 'Blog and associated files removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Toggle Like on a blog
// @route   POST /api/blogs/:id/like
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const isLiked = blog.likes.includes(req.user.id);

    if (isLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      blog.likes.push(req.user.id);
    }

    await blog.save();
    res.status(200).json(blog.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/blogs/:id/comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const newComment = {
      user: req.user.id,
      text,
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
};
/*
module.exports = {
  createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, toggleLike, addComment,
};*/