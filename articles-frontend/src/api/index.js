import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Аутентификация
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// Статьи
export const fetchArticles = () => API.get("/articles");
export const createArticle = (data) => API.post("/articles", data);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);

// Комментарии
export const fetchArticleById = (id) => API.get(`/articles/${id}`);
export const addComment = (articleId, data) =>
  API.post(`/comments/${articleId}`, data);


export const updateComment = (commentId, data) =>
  API.put(`/comments/${commentId}`, data);

export const deleteComment = (commentId) =>
  API.delete(`/comments/${commentId}`);
