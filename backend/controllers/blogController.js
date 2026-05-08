const Blog = require('../models/Blog');
const redisClient = require('../config/redis');

// ================= CREATE BLOG =================
const createBlog = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, content, category, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let image = 'https://via.placeholder.com/800x400?text=No+Image';

    if (req.files?.image?.length > 0) {
      image = `/uploads/${req.files.image[0].filename}`;
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      status: status || "published",
      image,
      author: req.user._id,
    });

    res.status(201).json(blog);

  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BLOGS =================
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isDeleted: false })
      .populate('author', 'name');

    res.status(200).json({
      success: true,
      data: blogs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BLOG BY ID =================
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE BLOG (🔥 FIXED) =================
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;

    if (req.files?.image?.length > 0) {
      blog.image = `/uploads/${req.files.image[0].filename}`;
    }

    const updatedBlog = await blog.save();

    res.status(200).json(updatedBlog);

  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE BLOG =================
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LIKE / UNLIKE =================
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const userId = req.user._id.toString();

    // CHECK IF USER ALREADY LIKED
    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // UNLIKE
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // LIKE
      blog.likes.push(req.user._id);
    }

    // UPDATE LIKE COUNT
    blog.likesCount = blog.likes.length;

    await blog.save();

    res.status(200).json({
      success: true,
      likesCount: blog.likesCount,
      likes: blog.likes,
      message: alreadyLiked
        ? "Blog unliked"
        : "Blog liked",
    });

  } catch (error) {
    console.error("LIKE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= COMMENT =================
const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    blog.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await blog.save();

    res.status(201).json(blog.comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= EXPORTS =================
module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,   // 🔥 IMPORTANT FIX
  deleteBlog,
  toggleLike,
  addComment,
};