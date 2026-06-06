import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/useAuth";
import "./SignUpPage.css";

export default function SignupPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { signupWithEmail } = useAuth();
  const email = state?.email;
  const backgroundLocation = state?.backgroundLocation;
  const returnTo = state?.returnTo || "/profile";

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Start again.");
      navigate("/email", {
        state: {
          backgroundLocation,
          returnTo,
        },
      });
    }
  }, [backgroundLocation, email, navigate, returnTo]);

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
      await signupWithEmail(email, form);
      toast.success("Account created");
      navigate(returnTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper auth-screen">
      <div className="signup-card auth-card">
        <h1 className="brand">The Singing Tales</h1>
        <h2 className="title">Create Your Account</h2>
        <p className="subtitle">Complete your details to start customizing singing cards.</p>

        <div className="input-group">
          <input name="name" placeholder="Full name" onChange={handleChange} />
        </div>

        <div className="input-group">
          <input name="username" placeholder="Username" onChange={handleChange} />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button className="btn-primary" onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </div>
    </div>
  );
}
