const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // <-- New Import
const {
  createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, toggleLike, addComment,
} = require('../controllers/blogController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Protected routes with File Uploads
// Expects form-data with an 'image' field and a 'documents' field
router.post(
  '/', 
  protect, 
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'documents', maxCount: 5 }]), 
  createBlog
);

router.put(
  '/:id', 
  protect, 
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'documents', maxCount: 5 }]), 
  updateBlog
);

router.delete('/:id', protect, deleteBlog);

// Interaction routes
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;