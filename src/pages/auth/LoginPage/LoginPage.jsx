import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/useAuth";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
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
      toast.success("Welcome back");
      navigate(state?.returnTo || "/profile", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper auth-screen">
      <div className="login-card auth-card">
        <h1 className="brand">The Singing Tales</h1>
        <h2 className="title">Welcome back</h2>
        <p className="subtitle">Login to manage orders and saved addresses.</p>

        <div className="input-group">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        </div>

        <div className="input-group">
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        </div>

        <button
          className="auth-link-button"
          type="button"
          onClick={() =>
            navigate("/forgot-password", {
              state: {
                backgroundLocation: state?.backgroundLocation,
              },
            })
          }
        >
          Forgot password?
        </button>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch-auth">
          Do not have an account?{" "}
          <span
            onClick={() =>
              navigate("/email", {
                state: {
                  backgroundLocation: state?.backgroundLocation,
                  returnTo: state?.returnTo || "/profile",
                },
              })
            }
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
