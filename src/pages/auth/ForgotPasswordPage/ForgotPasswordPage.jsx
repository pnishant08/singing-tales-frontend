import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";
import "../LoginPage/LoginPage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const requestReset = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset OTP sent");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not send reset OTP");
      return;
    } finally {
      setLoading(false);
    }

    navigate("/reset-password", {
      state: {
        email,
        backgroundLocation: state?.backgroundLocation,
      },
    });
  };

  return (
    <div className="forgot-wrapper auth-screen">
      <div className="forgot-card auth-card">
        <h1 className="brand">The Singing Tales</h1>
        <h2 className="title">Reset password</h2>
        <p className="subtitle">Enter your email to receive a reset OTP.</p>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={requestReset} disabled={loading}>
          {loading ? "Sending..." : "Send reset OTP"}
        </button>

        <p className="switch-auth">
          Remembered it? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
