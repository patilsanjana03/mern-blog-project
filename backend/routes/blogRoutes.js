const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { createBlog, getBlogs, getMyStories, getBlogById, updateBlog } = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/my-stories', protect, getMyStories);
router.get('/:id', getBlogById);

router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }]), createBlog);
router.put('/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }]), updateBlog);

module.exports = router;