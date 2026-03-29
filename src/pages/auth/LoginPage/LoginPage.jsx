import React, { useState } from "react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Welcome back ✨");
      navigate("/profile");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h1 className="brand">The Singing Tales</h1>

        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Login to continue your journey</p>

        <div className="input-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}