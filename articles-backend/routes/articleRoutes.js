// articles-backend/routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const {
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getArticleById 
} = require('../controllers/articleController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createArticle);
router.get('/', getAllArticles);
router.put('/:id', authMiddleware, updateArticle);
router.delete('/:id', authMiddleware, deleteArticle);
router.get('/:id', getArticleById); 

module.exports = router;
