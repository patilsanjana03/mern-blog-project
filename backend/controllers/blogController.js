const Blog = require('../models/Blog');

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

    let image = '/uploads/default-blog.png'; 
    if (req.files?.image?.length > 0) {
      image = `/uploads/${req.files.image[0].filename}`;
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      status: status || "published",
      image,
      author: req.user._id, // Links story to the logged-in user
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= NEW: GET ONLY LOGGED-IN USER'S STORIES =================
const getMyStories = async (req, res) => {
  try {
    // 🛡️ Find blogs where author matches the logged-in user ID
    const stories = await Blog.find({ 
      author: req.user._id,
      isDeleted: false 
    }).sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.error("GET MY STORIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your personal stories" });
  }
};

// ================= GET ALL BLOGS (EXPLORE) =================
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isDeleted: false })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

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
      .populate('author', 'name email')
      .populate({
        path: 'comments.user',
        select: 'name' 
      });

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE BLOG =================
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this blog" });
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
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE BLOG =================
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LIKE / UNLIKE =================
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = blog.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(req.user._id);
    }

    blog.likesCount = blog.likes.length;
    await blog.save();

    res.status(200).json({
      success: true,
      likesCount: blog.likesCount,
      message: alreadyLiked ? "Blog unliked" : "Blog liked",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADD COMMENT =================
const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await blog.save();
    const updatedBlog = await Blog.findById(req.params.id).populate('comments.user', 'name');
    res.status(201).json(updatedBlog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getMyStories, // 👈 Exporting the new function
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
};