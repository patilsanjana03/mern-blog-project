const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
} = require('../controllers/blogController');

// ================= PUBLIC ROUTES =================
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// ================= PROTECTED ROUTES =================

// 🔥 CREATE BLOG
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },        // blog image
    { name: 'documents', maxCount: 5 }     // optional attachments
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