import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import "../ecommerce.css";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      username: user?.username || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);
      await updateProfile(form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="commerce-page profile-page">
      <div className="profile-layout">
        <div className="profile-card">
          <p className="eyebrow">Account</p>
          <div className="profile-summary">
            <img
              src={user?.avatar || "/images/card-preview.svg"}
              alt=""
              className="profile-avatar"
            />
            <div>
              <h1>{user?.name || "Your profile"}</h1>
              <p>{user?.email}</p>
              {user?.username && <p className="muted">@{user.username}</p>}
            </div>
          </div>

          <div className="profile-meta">
            <span><strong>Role</strong>{user?.role || "user"}</span>
            <span><strong>Phone</strong>{user?.phone || "Not added"}</span>
            <span><strong>Verified</strong>{user?.isVerified || user?.verified ? "Yes" : "No"}</span>
            <span><strong>Status</strong>{user?.isBlocked || user?.blocked ? "Blocked" : "Active"}</span>
            <span><strong>Last login</strong>{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Unknown"}</span>
          </div>

          <div className="button-row">
            {user?.role === "admin" && (
              <Link to="/admin" className="btn-primary link-button">Open admin</Link>
            )}
            <button className="btn-secondary" onClick={logout} type="button">Logout</button>
          </div>
        </div>

        <div className="checkout-form">
          <p className="eyebrow">Edit</p>
          <h2>Profile details</h2>
          <div className="form-grid">
            <label>Name<input name="name" value={form.name} onChange={handleChange} /></label>
            <label>Username<input name="username" value={form.username} onChange={handleChange} /></label>
            <label>Phone<input name="phone" value={form.phone} onChange={handleChange} /></label>
            <label>Avatar URL<input name="avatar" value={form.avatar} onChange={handleChange} /></label>
          </div>
          <button className="btn-primary" onClick={saveProfile} disabled={saving} type="button">
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </div>
    </section>
  );
}
