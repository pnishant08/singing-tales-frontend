import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <h2>The Singing Tales</h2>
        <p>Custom singing cards for birthdays, anniversaries, festivals, and everyday love.</p>
      </div>
      <nav>
        <Link to="/shop">Shop</Link>
        <Link to="/customize">Customize</Link>
        <Link to="/track">Track order</Link>
      </nav>
    </footer>
  );
};

export default Footer;
