const express = require('express');
const router = express.Router();

const {
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/:articleId', authMiddleware, createComment);
router.put('/:commentId', authMiddleware, updateComment);
router.delete('/:commentId', authMiddleware, deleteComment);

module.exports = router; // ← ОБЯЗАТЕЛЬНО!
