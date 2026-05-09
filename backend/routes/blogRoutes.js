const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const {
  createBlog,
  getBlogs,
  getMyStories, // 🟢 Import the new controller function
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
} = require('../controllers/blogController');

// ================= PUBLIC ROUTES =================
router.get('/', getBlogs);

// 🟢 MY STORIES (Must be ABOVE /:id)
// This is the specific route for the logged-in user's personal collection
router.get('/my-stories', protect, getMyStories);

router.get('/:id', getBlogById);

// ================= PROTECTED ROUTES =================

// 🔥 CREATE BLOG
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },         // blog image
    { name: 'documents', maxCount: 5 }      // optional attachments
  ]),
  createBlog
);

// 🔥 UPDATE BLOG
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  updateBlog
);

// 🔥 DELETE BLOG
router.delete('/:id', protect, deleteBlog);

// ================= INTERACTIONS =================

// 👍 LIKE
router.post('/:id/like', protect, toggleLike);

// 💬 COMMENT
router.post('/:id/comment', protect, addComment);

module.exports = router;