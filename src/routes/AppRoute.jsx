import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/HomePage";
import Login from "../pages/auth/LoginPage/LoginPage";
import Signup from "../pages/auth/SignupPage/SignupPage";
import EmailPage from "../pages/auth/EmailPage/EmailPage";
import OtpPage from "../pages/auth/OtpPage/OtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage/ResetPasswordPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ShopPage from "../pages/Shop/ShopPage";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import TrackOrderPage from "../pages/TrackOrder/TrackOrderPage";
import CustomizePage from "../pages/Customize/CustomizePage";
import OrdersPage from "../pages/Orders/OrdersPage";
import OrderDetailsPage from "../pages/Orders/OrderDetailsPage";
import OrderSuccessPage from "../pages/OrderSuccess/OrderSuccessPage";
import AddressesPage from "../pages/Addresses/AddressesPage";
import AdminPage from "../pages/Admin/AdminPage";
import ProtectedRoute from "./ProtectedRoute";
import OccasionsPage from "../pages/ecommerce/OccasionsPage";

const authRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/email" element={<EmailPage />} />
    <Route path="/otp" element={<OtpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
  </>
);

const AuthModal = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.backgroundLocation;

  const closeModal = () => {
    if (backgroundLocation) {
      navigate(
        `${backgroundLocation.pathname}${backgroundLocation.search}${backgroundLocation.hash}`,
        { replace: true }
      );
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true">
      <div className="auth-modal-dialog">
        <button className="auth-modal-close" onClick={closeModal} type="button">
          X
        </button>
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <div className={backgroundLocation ? "app-shell is-auth-modal-open" : "app-shell"}>
        <Routes location={backgroundLocation || location}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/customize" element={<CustomizePage />} />
            <Route path="/create" element={<CustomizePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/occasions" element={<OccasionsPage />} />

            {/* Protected */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <ProtectedRoute>
                  <AddressesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {authRoutes}
        </Routes>
      </div>

      {backgroundLocation && (
        <Routes>
          <Route path="/login" element={<AuthModal><Login /></AuthModal>} />
          <Route path="/signup" element={<AuthModal><Signup /></AuthModal>} />
          <Route path="/email" element={<AuthModal><EmailPage /></AuthModal>} />
          <Route path="/otp" element={<AuthModal><OtpPage /></AuthModal>} />
          <Route path="/forgot-password" element={<AuthModal><ForgotPasswordPage /></AuthModal>} />
          <Route path="/reset-password" element={<AuthModal><ResetPasswordPage /></AuthModal>} />
        </Routes>
      )}
    </>
  );
};

export default AppRoutes;
