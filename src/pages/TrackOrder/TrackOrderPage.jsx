import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "../ecommerce.css";


const steps = [
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];

export default function TrackOrderPage() {
  const [params] = useSearchParams();
  const { orders, fetchOrders } = useCart();
  const [orderId, setOrderId] = useState(params.get("order") || "");

  useEffect(() => {
    fetchOrders();
  }, []);

  const order = useMemo(() => {
    return orders.find(
      (item) =>
        String(item._id).toLowerCase() ===
        orderId.trim().toLowerCase()
    );
  }, [orderId, orders]);

  const activeStep = order
    ? Math.max(0, steps.indexOf(order.orderStatus || "Placed"))
    : -1;

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
          placeholder="Enter order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>

      {order ? (
        <div className="tracking-card">
          <div>
            <h2>Order {order._id}</h2>
            <p className="muted">
              Estimated delivery: {order.eta || "3-5 business days"}
            </p>
            
          </div>

          <div className="tracking-steps">
            {steps.map((step, index) => (
              <span key={step} className={index <= activeStep ? "done" : ""}>
                {step}
              </span>
            ))}
          </div>

          <div className="order-items">
            {order.items?.map((item) => (
              <p key={item._id}>
                {item.product?.title || "Product"} x {item.quantity}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state small">
          <h2>No order selected</h2>
          <p>Place an order or open your orders page to track one.</p>
          <Link to="/orders" className="btn-secondary link-button">
            View orders
          </Link>
        </div>
      )}
    </section>
  );
}