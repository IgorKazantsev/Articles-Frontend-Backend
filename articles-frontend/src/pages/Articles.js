import React, { useEffect, useState, useContext } from "react";
import { fetchArticles, createArticle, deleteArticle } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Articles.css"; // Подключаем стили

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const loadArticles = async () => {
    try {
      const res = await fetchArticles();
      setArticles(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке статей");
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createArticle(newArticle);
      setNewArticle({ title: "", content: "" });
      loadArticles();
    } catch (err) {
      alert("Ошибка при создании статьи");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить статью?")) return;
    try {
      await deleteArticle(id);
      loadArticles();
    } catch (err) {
      alert("Ошибка при удалении");
    }
  };

  return (
    <div className="articles-page">
      <div className="header">
        <h2>Статьи</h2>
        <button className="logout-button" onClick={logout}>Выйти</button>
      </div>

      <form className="create-form" onSubmit={handleCreate}>
        <h3>Создать статью</h3>
        <input
          type="text"
          placeholder="Заголовок"
          value={newArticle.title}
          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Контент"
          value={newArticle.content}
          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
          required
        />
        <button type="submit">Создать</button>
      </form>

      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.id} className="article-item">
            <div className="article-header">
              <strong>{article.title}</strong>
              <span className="author"> — {article.authorEmail}</span>
            </div>
            <div className="article-buttons">
              <button onClick={() => navigate(`/articles/${article.id}`)}>Читать</button>
              {user?.email === article.authorEmail && (
                <button className="delete-button" onClick={() => handleDelete(article.id)}>
                  Удалить
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;
