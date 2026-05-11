const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';

    if (req.files && req.files.image) {
      imageUrl = req.files.image[0].path; // Cloudinary URL
    }

    const blog = await Blog.create({
      title, content, category,
      image: imageUrl,
      author: req.user._id
    });
    res.status(201).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;

    if (req.files && req.files.image) {
      blog.image = req.files.image[0].path; // Updates to Cloudinary URL
    }

    await blog.save();
    res.status(200).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyStories = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    res.status(200).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};