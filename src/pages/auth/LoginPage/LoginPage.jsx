import { useState } from "react";
import { useAuth } from "../../../context/useAuth";

export default function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    await login(form.email, form.password);
  };

  return (
    <div>
      <input onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input type="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}