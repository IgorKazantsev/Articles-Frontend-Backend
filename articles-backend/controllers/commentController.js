const { sql, pool, poolConnect } = require('../db');

// Создание комментария
exports.createComment = async (req, res) => {
  await poolConnect;
  const { content } = req.body;
  const { articleId } = req.params;
  const userId = req.user.id;

  try {
    await pool.request()
      .input('content', sql.NVarChar(sql.MAX), content)
      .input('articleId', sql.Int, articleId)
      .input('authorId', sql.Int, userId)
      .query(`
        INSERT INTO Comments (content, articleId, authorId)
        VALUES (@content, @articleId, @authorId)
      `);

    res.status(201).send('Комментарий добавлен');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при создании комментария');
  }
};

// Обновление комментария
exports.updateComment = async (req, res) => {
  await poolConnect;
  const { commentId } = req.params; // ✅ Явно commentId, как в маршруте
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.request()
      .input('id', sql.Int, commentId)
      .query('SELECT authorId FROM Comments WHERE id = @id');

    const comment = result.recordset[0];
    if (!comment) return res.status(404).send('Комментарий не найден');
    if (comment.authorId !== userId) return res.status(403).send('Нет прав');

    await pool.request()
      .input('id', sql.Int, commentId)
      .input('content', sql.NVarChar(sql.MAX), content)
      .query('UPDATE Comments SET content = @content WHERE id = @id');

    res.send('Комментарий обновлён');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при обновлении');
  }
};

// Удаление комментария
exports.deleteComment = async (req, res) => {
  await poolConnect;
  const { commentId } = req.params; // ✅ Тоже commentId
  const userId = req.user.id;

  try {
    const result = await pool.request()
      .input('id', sql.Int, commentId)
      .query('SELECT authorId FROM Comments WHERE id = @id');

    const comment = result.recordset[0];
    if (!comment) return res.status(404).send('Комментарий не найден');
    if (comment.authorId !== userId) return res.status(403).send('Нет прав');

    await pool.request()
      .input('id', sql.Int, commentId)
      .query('DELETE FROM Comments WHERE id = @id');

    res.send('Комментарий удалён');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при удалении');
  }
};
