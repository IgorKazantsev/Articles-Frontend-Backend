// articles-backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, pool, poolConnect } = require('../db');

exports.register = async (req, res) => {
  await poolConnect;
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO Users (email, password) VALUES (@email, @password)');

    res.status(201).send('Пользователь зарегистрирован');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};

exports.login = async (req, res) => {
  await poolConnect;
  const { email, password } = req.body;

  try {
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(404).send('Пользователь не найден');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Неверный пароль');

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
};
