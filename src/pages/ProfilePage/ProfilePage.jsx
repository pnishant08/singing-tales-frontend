import React from "react";
import { useAuth } from "../../context/useAuth";
import "../ecommerce.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <section className="commerce-page profile-page">
      <div className="profile-card">
        <p className="eyebrow">Account</p>
        <h1>{user?.name || "Your profile"}</h1>
        <p>{user?.email}</p>
        {user?.username && <p className="muted">@{user.username}</p>}
        <button className="btn-secondary" onClick={logout}>Logout</button>
      </div>
    </section>
  );
}
