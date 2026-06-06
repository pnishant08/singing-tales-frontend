import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "../ecommerce.css";

const steps = ["Placed", "Crafting", "Packed", "Shipped", "Delivered"];

export default function TrackOrderPage() {
  const [params] = useSearchParams();
  const { orders } = useCart();
  const [orderId, setOrderId] = useState(params.get("order") || "");

  const order = useMemo(
    () => orders.find((item) => item.id.toLowerCase() === orderId.trim().toLowerCase()),
    [orderId, orders]
  );
  const activeStep = order ? Math.max(1, steps.indexOf(order.status)) : -1;

  return (
    <section className="commerce-page track-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Track order</p>
          <h1>Find your singing card delivery</h1>
        </div>
      </div>

      <div className="tracking-search">
        <input
          placeholder="Enter order ID, for example ST12345678"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>

      {order ? (
        <div className="tracking-card">
          <div>
            <h2>Order {order.id}</h2>
            <p className="muted">Estimated delivery: {order.eta}</p>
          </div>
          <div className="tracking-steps">
            {steps.map((step, index) => (
              <span key={step} className={index <= activeStep ? "done" : ""}>
                {step}
              </span>
            ))}
          </div>
          <div className="order-items">
            {order.items.map((item) => (
              <p key={item.lineId}>{item.title} x {item.quantity}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state small">
          <h2>No order selected</h2>
          <p>Place an order or open your orders page to track one.</p>
          <Link to="/orders" className="btn-secondary link-button">View orders</Link>
        </div>
      )}
    </section>
  );
}
