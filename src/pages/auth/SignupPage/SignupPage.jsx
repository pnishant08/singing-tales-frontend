import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function SignupPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleSignup = async () => {
    const res = await api.post("/auth/complete-signup", {
      email: state.email,
      ...form,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/profile");
  };

  return (
    <div>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Username" onChange={(e)=>setForm({...form,username:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}