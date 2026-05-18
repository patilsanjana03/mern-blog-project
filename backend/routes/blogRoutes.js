const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Import all exported functions from controllers package
const { 
  createBlog, 
  getBlogs, 
  getMyStories, 
  getBlogById, 
  updateBlog, 
  handleLike, 
  deleteBlog 
} = require('../controllers/blogController');

// Standard Read Endpoints
router.get('/', getBlogs);
router.get('/my-stories', protect, getMyStories);
router.get('/:id', getBlogById);

// Write / Mutate Endpoints
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }]), createBlog);
router.put('/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }]), updateBlog);

// Interaction & Destruction Endpoints
router.post('/:id/like', protect, handleLike);
router.delete('/:id', protect, deleteBlog);

module.exports = router;