import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerAPI } from "../api";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAPI(form);
      alert("Регистрация прошла успешно. Войдите.");
      navigate("/login");
    } catch (err) {
      alert("Ошибка регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Регистрация</h2>
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
      <button type="submit" className="auth-button">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
