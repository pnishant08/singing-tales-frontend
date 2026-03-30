import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || null; 

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

          <Link to="/cart" className="cart">
            🛒
          </Link>

          {user ? (
            <div className="profile">
              <div 
                className="profile-trigger"
                onClick={() => setIsOpen(!isOpen)}
              >
                👤 Account ▾
              </div>

              {isOpen && (
                <div className="dropdown">
                  <Link to="/orders">My Orders</Link>
                  <Link to="/profile">Profile</Link>
                  <Link to="/addresses">Addresses</Link>
                  <hr />
                  <button className="logout">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;