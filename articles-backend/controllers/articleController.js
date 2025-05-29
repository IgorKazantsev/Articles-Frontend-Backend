// articles-backend/controllers/articleController.js
const { sql, pool, poolConnect } = require('../db');

exports.createArticle = async (req, res) => {
  await poolConnect;
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    await pool.request()
      .input('title', sql.NVarChar, title)
      .input('content', sql.Text, content)
      .input('authorId', sql.Int, userId)
      .query('INSERT INTO Articles (title, content, authorId) VALUES (@title, @content, @authorId)');
    
    res.status(201).send('Статья создана');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

exports.getAllArticles = async (req, res) => {
  await poolConnect;

  try {
    // Получаем статьи с авторами
    const articlesResult = await pool.request()
      .query(`SELECT A.id, A.title, A.content, A.createdAt, U.email AS authorEmail
              FROM Articles A
              JOIN Users U ON A.authorId = U.id`);

    const articles = articlesResult.recordset;

    // Получаем комментарии сразу для всех статей
    const commentsResult = await pool.request()
      .query(`SELECT C.id, C.content, C.createdAt, C.articleId, U.email AS authorEmail
              FROM Comments C
              JOIN Users U ON C.authorId = U.id`);

    const comments = commentsResult.recordset;

    // Привязка комментариев к статьям
    const commentsMap = {};
    for (const comment of comments) {
      if (!commentsMap[comment.articleId]) {
        commentsMap[comment.articleId] = [];
      }
      commentsMap[comment.articleId].push(comment);
    }

    const articlesWithComments = articles.map(article => ({
      ...article,
      comments: commentsMap[article.id] || []
    }));

    res.json(articlesWithComments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};



exports.updateArticle = async (req, res) => {
  await poolConnect;
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT authorId FROM Articles WHERE id = @id');

    const article = result.recordset[0];
    if (!article) return res.status(404).send('Статья не найдена');
    if (article.authorId !== userId) return res.status(403).send('Нет доступа');

    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar(sql.MAX), title)
      .input('content', sql.NVarChar(sql.MAX), content)
      .query('UPDATE Articles SET title = @title, content = @content WHERE id = @id');

    res.send('Статья обновлена');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

exports.deleteArticle = async (req, res) => {
  await poolConnect;
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT authorId FROM Articles WHERE id = @id');

    const article = result.recordset[0];
    if (!article) return res.status(404).send('Статья не найдена');
    if (article.authorId !== userId) return res.status(403).send('Нет доступа');

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Articles WHERE id = @id');

    res.send('Статья удалена');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};


exports.getArticleById = async (req, res) => {
  await poolConnect;
  const { id } = req.params;

  try {
    const articleResult = await pool.request()
      .input('id', sql.Int, parseInt(id)) // 👈 гарантируем число
      .query(`
        SELECT A.id, A.title, A.content, A.createdAt, U.email AS authorEmail
        FROM Articles A
        JOIN Users U ON A.authorId = U.id
        WHERE A.id = @id
      `);

    const article = articleResult.recordset[0];
    if (!article) return res.status(404).send('Статья не найдена');

    const commentsResult = await pool.request()
      .input('articleId', sql.Int, parseInt(id)) // 👈 тоже
      .query(`
        SELECT C.id, C.content, C.createdAt, U.email AS authorEmail
        FROM Comments C
        JOIN Users U ON C.authorId = U.id
        WHERE C.articleId = @articleId
        ORDER BY C.createdAt ASC
      `);

    article.comments = commentsResult.recordset;

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

