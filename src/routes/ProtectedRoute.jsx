import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../pages/ecommerce.css";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
    <Navigate
      to="/login"
      replace
      state={{ returnTo: `${location.pathname}${location.search}` }}
    />
    );
  }

  if (user.isBlocked || user.blocked) {
    return (
      <section className="commerce-page empty-state">
        <h1>Account blocked</h1>
        <p>Please contact support to restore access.</p>
      </section>
    );
  }

  if (roles.length && !roles.includes(user.role)) {
    return (
      <section className="commerce-page empty-state">
        <h1>Admin access only</h1>
        <p>This area is available to admin accounts.</p>
        <Link to="/profile" className="btn-secondary link-button">Back to profile</Link>
      </section>
    );
  }

  return children;
}
