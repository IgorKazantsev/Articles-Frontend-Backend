import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  fetchArticleById,
  addComment,
  updateComment,
  deleteComment,
} from "../api";
import { AuthContext } from "../context/AuthContext";
import "./ArticleDetail.css"; // ✅ Подключаем CSS

const ArticleDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const loadArticle = async () => {
    try {
      const res = await fetchArticleById(id);
      setArticle(res.data);
    } catch (err) {
      console.error("Ошибка загрузки статьи");
    }
  };

  useEffect(() => {
    loadArticle();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await addComment(id, { content: commentText });
      setCommentText("");
      loadArticle();
    } catch (err) {
      alert("Ошибка при добавлении комментария");
    }
  };

  const handleEdit = (commentId, currentText) => {
    setEditingId(commentId);
    setEditingText(currentText);
  };

  const handleUpdate = async () => {
    try {
      await updateComment(editingId, { content: editingText });
      setEditingId(null);
      setEditingText("");
      loadArticle();
    } catch (err) {
      alert("Ошибка при редактировании");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Удалить комментарий?")) return;
    try {
      await deleteComment(commentId);
      loadArticle();
    } catch (err) {
      alert("Ошибка при удалении");
    }
  };

  if (!article) return <div className="loading">Загрузка...</div>;

  return (
    <div className="article-detail">
      <h2 className="article-title">{article.title}</h2>
      <p className="article-content">{article.content}</p>
      <p className="article-author">
        <i>Автор: {article.authorEmail}</i>
      </p>

      <div className="comments-section">
        <h3>Комментарии</h3>
        {article.comments?.length > 0 ? (
          article.comments.map((c) => (
            <div key={c.id} className="comment-item">
              <strong>{c.authorEmail}</strong>
              {editingId === c.id ? (
                <div className="edit-block">
                  <textarea
                    className="edit-textarea"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <div className="comment-actions">
                    <button onClick={handleUpdate}>Сохранить</button>
                    <button onClick={() => setEditingId(null)}>Отмена</button>
                  </div>
                </div>
              ) : (
                <div className="comment-content">
                  <span>{c.content}</span>
                  {user?.email === c.authorEmail && (
                    <div className="comment-actions">
                      <button onClick={() => handleEdit(c.id, c.content)}>
                        Редактировать
                      </button>
                      <button onClick={() => handleDelete(c.id)}>
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-comments">Комментариев пока нет</p>
        )}

        {user && (
          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Добавить комментарий"
              required
            />
            <button type="submit">Отправить</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
