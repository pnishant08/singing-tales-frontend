import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import "./OtpPage.css";

export default function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Please start again.");
      navigate("/email");
    }
  }, [email, navigate]);

  
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      await api.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      toast.success("OTP verified");
      navigate("/signup", { state: { email } });

    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-card">

        <h1 className="brand">The Singing Tales</h1>

        <h2 className="title">Verify OTP</h2>
        <p className="subtitle">
          Enter the 6-digit code sent to your email
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className="btn-primary" onClick={handleVerify}>
          Verify OTP
        </button>

      </div>
    </div>
  );
}