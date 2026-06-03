import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import "../ecommerce.css";

export default function CheckoutPage() {
  const { items, totals, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const submitOrder = () => {
    if (!user) {
      toast.error("Please login to place your order");
      navigate("/login", {
        state: {
          backgroundLocation: location,
          returnTo: "/checkout",
        },
      });
      return;
    }

    const required = ["name", "phone", "email", "address", "city", "pincode"];
    const missing = required.some((field) => !customer[field].trim());

    if (missing) {
      toast.error("Please fill all delivery details");
      return;
    }

    const order = placeOrder(customer);
    toast.success("Order placed");
    navigate(`/track?order=${order.id}`);
  };

  if (!items.length) {
    return (
      <section className="commerce-page empty-state">
        <h1>No items to checkout</h1>
        <Link to="/shop" className="btn-primary link-button">Continue shopping</Link>
      </section>
    );
  }

  return (
    <section className="commerce-page checkout-layout">
      <div className="checkout-form">
        <p className="eyebrow">Checkout</p>
        <h1>Delivery details</h1>
        {!user && (
          <div className="login-required">
            <strong>Login required</strong>
            <span>You can fill details now, but you must login before placing the order.</span>
          </div>
        )}
        <div className="form-grid">
          <label>Name<input name="name" value={customer.name} onChange={handleChange} /></label>
          <label>Phone<input name="phone" value={customer.phone} onChange={handleChange} /></label>
          <label>Email<input name="email" type="email" value={customer.email} onChange={handleChange} /></label>
          <label>City<input name="city" value={customer.city} onChange={handleChange} /></label>
        </div>
        <label>Address<textarea name="address" rows="4" value={customer.address} onChange={handleChange} /></label>
        <label>Pincode<input name="pincode" value={customer.pincode} onChange={handleChange} /></label>
        <button className="btn-primary" onClick={submitOrder}>
          {user ? "Place order" : "Login to place order"}
        </button>
      </div>

      <aside className="summary-box">
        <h2>Payment summary</h2>
        {items.map((item) => (
          <p key={item.lineId}><span>{item.title} x {item.quantity}</span><strong>₹{item.price * item.quantity}</strong></p>
        ))}
        <hr />
        <p className="summary-total"><span>Total</span><strong>₹{totals.total}</strong></p>
        <small>Demo checkout stores your order locally for tracking.</small>
      </aside>
    </section>
  );
}
