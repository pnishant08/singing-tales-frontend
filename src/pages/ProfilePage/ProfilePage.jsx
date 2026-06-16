import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import "../ecommerce.css";
import { getImageUrl } from "../../services/api";

const getAddressId = (address) => address.id || address._id;
const getAddressLine = (address) => address.addressLine || address.address || "";

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "Not available");

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    avatar: "",
    avatarFile: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      username: user?.username || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
      avatarFile: null,
    });
  }, [user]);

  useEffect(() => {
    if (!isEditing) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((current) => ({
      ...current,
      avatar: previewUrl,
      avatarFile: file,
    }));
  };

  const cancelEdit = () => {
    setForm({
      name: user?.name || "",
      username: user?.username || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    });
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("phone", form.phone);

      if (form.avatarFile) {
        formData.append("avatar", form.avatarFile);
      }

      await updateProfile(formData);

      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const addresses = Array.isArray(user?.addresses) ? user.addresses : [];
  const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
  const isVerified = Boolean(user?.isVerified || user?.verified);
  const isBlocked = Boolean(user?.isBlocked || user?.blocked);
  const profileFields = [user?.name, user?.email, user?.username, user?.phone, user?.avatar];
  const profileCompletion = Math.round(
    (profileFields.filter((field) => String(field || "").trim()).length / profileFields.length) * 100
  );

  return (
    <section className="commerce-page profile-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My Profile</h1>
        </div>
        <div className="button-row">
          <Link to="/orders" className="btn-secondary link-button">Orders</Link>
          <Link to="/addresses" className="btn-secondary link-button">Addresses</Link>
          <button className="btn-primary" onClick={() => setIsEditing(true)} type="button">Edit profile</button>
          {user?.role === "admin" && (
            <Link to="/admin" className="btn-secondary link-button">Admin</Link>
          )}
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-card profile-overview">
          <div className="profile-summary">
            <img
              src={getImageUrl(user?.avatar)}
              alt="Profile"
            />
            <div>
              <div className="profile-title-row">
                <h2>{user?.name || "Your profile"}</h2>
                <span className={isVerified ? "status-pill" : "status-pill warning"}>
                  {isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
              <p>{user?.email}</p>
              {user?.username && <p className="muted">@{user.username}</p>}
            </div>
          </div>

          <div className="profile-completion">
            <div>
              <strong>Profile completion</strong>
              <span>{profileCompletion}%</span>
            </div>
            <div className="profile-progress" aria-hidden="true">
              <span style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>

          <div className="profile-meta">
            <span><strong>Role</strong>{user?.role || "user"}</span>
            <span><strong>Phone</strong>{user?.phone || "Not added"}</span>
            <span><strong>Status</strong>{isBlocked ? "Blocked" : "Active"}</span>
            <span><strong>Last login</strong>{formatDate(user?.lastLogin)}</span>
            <span><strong>Member since</strong>{formatDate(user?.createdAt)}</span>
            <span><strong>Saved addresses</strong>{addresses.length}</span>
          </div>
        </div>

        <div className="account-dashboard">
          <article className="account-panel">
            <div className="account-panel-heading">
              <div>
                <p className="eyebrow">Delivery</p>
                <h2>Default shipping address</h2>
              </div>
              <Link to="/addresses" className="text-button">Manage</Link>
            </div>

            {defaultAddress ? (
              <div className="profile-address-card" key={getAddressId(defaultAddress)}>
                <div className="address-title-row">
                  <strong>{defaultAddress.fullName || user?.name || "Recipient"}</strong>
                  {defaultAddress.isDefault && <span className="status-pill">Default</span>}
                </div>
                <p>{defaultAddress.phone || user?.phone || "Phone not added"}</p>
                <p>{getAddressLine(defaultAddress)}</p>
                <p>
                  {[defaultAddress.city, defaultAddress.state, defaultAddress.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>{defaultAddress.country || "India"}</p>
              </div>
            ) : (
              <div className="empty-state small profile-empty">
                <h2>No address saved</h2>
                <p>Add a delivery address for faster checkout.</p>
                <Link to="/addresses" className="btn-primary link-button">Add address</Link>
              </div>
            )}
          </article>

          <article className="account-panel">
            <div className="account-panel-heading">
              <div>
                <p className="eyebrow">Activity</p>
                <h2>Shopping shortcuts</h2>
              </div>
            </div>

            <div className="account-actions">
              <Link to="/orders" className="account-action">
                <strong>My orders</strong>
                <span>Track, review, and reorder purchases</span>
              </Link>
              <Link to="/cart" className="account-action">
                <strong>Cart</strong>
                <span>Continue checkout from saved items</span>
              </Link>
              <Link to="/shop" className="account-action">
                <strong>Shop cards</strong>
                <span>Browse singing cards and occasions</span>
              </Link>
            </div>
          </article>

          <article className="account-panel">
            <p className="eyebrow">Security</p>
            <h2>Account status</h2>
            <div className="profile-status-list">
              <span><strong>Email verification</strong>{isVerified ? "Verified" : "Pending"}</span>
              <span><strong>Account status</strong>{isBlocked ? "Blocked" : "Active"}</span>
              <span><strong>Access level</strong>{user?.role || "user"}</span>
            </div>
            <div className="button-row account-footer-actions">
              <button className="btn-secondary" onClick={logout} type="button">Logout</button>
            </div>
          </article>
        </div>
      </div>

      {isEditing && (
        <div
          className="profile-edit-backdrop"
          role="presentation"
          onClick={() => {
            if (!saving) cancelEdit();
          }}
        >
          <article
            className="checkout-form profile-edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-edit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="account-panel-heading">
              <div>
                <p className="eyebrow">Personal Info</p>
                <h2 id="profile-edit-title">Edit account details</h2>
              </div>
              <button className="profile-dialog-close" onClick={cancelEdit} disabled={saving} type="button">
                X
              </button>
            </div>

            <div className="profile-upload-row">
              <img
              src={getImageUrl(user?.avatar)}
              alt="Profile"
            />
              <div>
                <label className="upload-button">
                  Upload profile photo
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                </label>
                <label>
                  Avatar URL
                  <input name="avatar" value={form.avatar} onChange={handleChange} />
                </label>
              </div>
            </div>

            <div className="form-grid">
              <label>Name<input name="name" value={form.name} onChange={handleChange} /></label>
              <label>Username<input name="username" value={form.username} onChange={handleChange} /></label>
              <label>Phone<input name="phone" value={form.phone} onChange={handleChange} /></label>
            </div>
            <div className="readonly-field">
              <strong>Email</strong>
              <span>{user?.email}</span>
            </div>
            <div className="button-row">
              <button className="btn-primary" onClick={saveProfile} disabled={saving} type="button">
                {saving ? "Saving..." : "Save profile"}
              </button>
              <button className="btn-secondary" onClick={cancelEdit} disabled={saving} type="button">Cancel</button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
