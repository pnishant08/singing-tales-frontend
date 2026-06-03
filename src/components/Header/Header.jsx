import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const authState = {
    backgroundLocation: location,
    returnTo: `${location.pathname}${location.search}`,
  };

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
            <div className="profile">
              <button
                className="profile-trigger"
                onClick={() => setIsOpen((current) => !current)}
                type="button"
              >
                {user.name || user.email || "Account"} v
              </button>

              {isOpen && (
                <div className="dropdown">
                  <Link to="/orders" onClick={() => setIsOpen(false)}>My Orders</Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                  <Link to="/addresses" onClick={() => setIsOpen(false)}>Addresses</Link>
                  <hr />
                  <button className="logout" onClick={handleLogout} type="button">
                    Logout
                  </button>
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
