import { useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmailPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      console.log("Sending:", email); 

      await api.post("/auth/send-otp", { email });

      toast.success("OTP sent");
      navigate("/otp", { state: { email } });

    } catch (err) {
      console.log(err.response?.data); 
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Email</h2>

      <input
        value={email}  
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />

      <button onClick={handleSendOtp}>
        Send OTP
      </button>
    </div>
  );
}