import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../api";
import { AuthContext } from "../context/AuthContext";
import "./Login.css"; 

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAPI(form);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert("Неверные данные для входа");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Вход</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="auth-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
        required
        className="auth-input"
      />
      <button type="submit" className="auth-button">Войти</button>
    </form>
  );
};

export default Login;
