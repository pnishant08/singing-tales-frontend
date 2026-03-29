import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import "./SignupPage.css";

export default function SignupPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Start again.");
      navigate("/email");
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { name, username, password } = form;

    
    if (!name || !username || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/complete-signup", {
        email,
        ...form,
      });

      localStorage.setItem("token", res.data.token);

      toast.success("Account created 🎉");
      navigate("/profile");

    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">

        <h1 className="brand">The Singing Tales</h1>

        <h2 className="title">Create Your Account</h2>
        <p className="subtitle">Complete your journey</p>

        <div className="input-group">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating..." : "Signup"}
        </button>

      </div>
    </div>
  );
}