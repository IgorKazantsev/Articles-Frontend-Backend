import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={user ? <Articles /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
    </Routes>
  );
};

export default App;
