import React, { useState,useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import "./Header.css";
import { getImageUrl } from "../../services/api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const authState = {
    backgroundLocation: location,
    returnTo: `${location.pathname}${location.search}`,
  };
const avatarUrl = getImageUrl(user?.avatar || "/images/default-avatar.png");
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          The Singing Tales
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/occasions">Occasions</Link>
          <Link to="/track">Track Order</Link>
        </nav>

        <div className="actions">
          <Link to="/customize" className="cta">
            Create Your Card
          </Link>

          <Link to="/cart" className="cart" aria-label="Cart">
            <span>Cart</span>
            {totals.count > 0 && <strong>{totals.count}</strong>}
          </Link>

          {user ? (
            <div className="profile" ref={dropdownRef}>
              <button
                className="profile-trigger"
                onClick={() => setIsOpen((current) => !current)}
                type="button"
              >
                <img
                 src={avatarUrl}
                  alt="Profile"
                  className="header-avatar"
                />
              </button>

              {isOpen && (
                <div className="dropdown">

                  <div className="dropdown-user">
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="dropdown-avatar"
                    />

                    <div>
                      <strong>{user?.name}</strong>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                  )}
                  <Link to="/orders" onClick={() => setIsOpen(false)}>My Orders</Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                  <Link to="/addresses" onClick={() => setIsOpen(false)}>Addresses</Link>
                  <hr />

                  
                  <button className="logout" onClick={handleLogout} type="button">
                    Logout
                  </button>
                  <hr />
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login" state={authState}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
