import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  return user ? children : (
    <Navigate
      to="/login"
      replace
      state={{ returnTo: `${location.pathname}${location.search}` }}
    />
  );
}
