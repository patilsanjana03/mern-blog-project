const express = require('express');
const router = express.Router();
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);    // This is Line 9 where it was crashing
router.delete('/:id', protect, deletePost);

module.exports = router;