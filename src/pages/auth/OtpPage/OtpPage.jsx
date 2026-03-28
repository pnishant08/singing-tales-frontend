import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email; 

  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Please start again.");
      navigate("/email");
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }

    try {
      console.log("Verifying:", email, otp);

      await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success("OTP verified");

      navigate("/signup", { state: { email } });

    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div>
      <h2>OTP</h2>

      <input
        value={otp}  
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      <button onClick={handleVerify}>
        Verify
      </button>
    </div>
  );
}