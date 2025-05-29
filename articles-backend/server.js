// articles-backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');



dotenv.config();
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes); // <- добавили
app.use('/api/comments', commentRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
