import React, { useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./EmailPage.css";

export default function EmailPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      await api.post("/auth/send-otp", { email });
      toast.success("OTP sent");
      navigate("/otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="email-wrapper">
      <div className="email-card">
        
        <h1 className="brand">The Singing Tales</h1>

        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">
          Enter your email to continue your journey
        </p>

        <div className="input-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleSendOtp}>
          Send OTP
        </button>

      </div>
    </div>
  );
}