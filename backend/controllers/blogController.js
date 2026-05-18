const Blog = require('../models/Blog');

// 1. CREATE A NEW BLOG
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

// 2. UPDATE AN EXISTING BLOG
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });

    // Authorization check
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this story" });
    }

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

// 3. GET ALL BLOGS (Fixed response for Explore/Home Tab)
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    // Sent as a pure array matching individual fetches so frontend loop breaks down images accurately
    res.status(200).json(blogs); 
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// 4. GET LOGGED IN USER STORIES
exports.getMyStories = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// 5. GET SINGLE STORY BY ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// 6. TOGGLE LIKE / UNLIKE SYSTEM
exports.handleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.likes) blog.likes = [];

    const userId = req.user._id.toString();
    const index = blog.likes.indexOf(userId);

    if (index === -1) {
      blog.likes.push(userId); // Add like
    } else {
      blog.likes.splice(index, 1); // Remove like
    }

    blog.likesCount = blog.likes.length;
    await blog.save();

    res.status(200).json({ likes: blog.likes, likesCount: blog.likesCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// 7. REMOVE BLOG PERMANENTLY
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Validate if caller matches database creator ID
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this story" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog removed successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};