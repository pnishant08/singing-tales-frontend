import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/HomePage";
import Login from "../pages/auth/LoginPage/LoginPage";
import Signup from "../pages/auth/SignupPage/SignupPage";


import EmailPage from "../pages/auth/EmailPage/EmailPage";
import OtpPage from "../pages/auth/OtpPage/OtpPage";


import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
    
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/email" element={<EmailPage />} />
      <Route path="/otp" element={<OtpPage />} />
    </Routes>
  );
};

export default AppRoutes;