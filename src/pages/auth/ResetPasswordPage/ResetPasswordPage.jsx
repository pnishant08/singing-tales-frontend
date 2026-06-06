import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";
import "../LoginPage/LoginPage.css";

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const email = state?.email;
  const backgroundLocation = state?.backgroundLocation;

  useEffect(() => {
    if (!email) {
      toast.error("Please request a reset OTP first");
      navigate("/forgot-password", { state: { backgroundLocation } });
    }
  }, [backgroundLocation, email, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetPassword = async () => {
    if (!form.otp || !form.password || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-reset-otp", { email, otp: form.otp });
      await api.post("/auth/reset-password", {
        email,
        otp: form.otp,
        password: form.password,
      });
      toast.success("Password reset complete");
    } catch (err) {
      toast.error(err.response?.data?.error || "Password reset failed");
      return;
    } finally {
      setLoading(false);
    }

    navigate("/login", { state: { backgroundLocation } });
  };

  return (
    <div className="reset-wrapper auth-screen">
      <div className="reset-card auth-card">
        <h1 className="brand">The Singing Tales</h1>
        <h2 className="title">Set new password</h2>
        <p className="subtitle">Enter the OTP sent to {email || "your email"}.</p>

        <div className="input-group">
          <input
            name="otp"
            inputMode="numeric"
            maxLength="6"
            placeholder="Reset OTP"
            value={form.otp}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="New password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button className="btn-primary" onClick={resetPassword} disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </div>
    </div>
  );
}
