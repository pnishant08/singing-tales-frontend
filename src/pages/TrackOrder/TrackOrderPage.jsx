import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "../ecommerce.css";
import "./TrackOrderPage.css";

const orderSteps = [
  { key: "placed", label: "Order placed", detail: "We received your order." },
  { key: "processing", label: "Processing", detail: "Your card is being prepared." },
  { key: "shipped", label: "Shipped", detail: "Your package is on the way." },
  { key: "delivered", label: "Delivered", detail: "Order completed." },
];

const getOrderId = (order) => order?._id || order?.id || "";
const getOrderStatus = (order) => (order?.orderStatus || order?.status || "placed").toLowerCase();

const getEtaText = (order) => {
  if (order?.eta) return order.eta;

  const estimate = new Date();
  estimate.setDate(estimate.getDate() + 5);
  return estimate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function TrackOrderPage() {
  const [params] = useSearchParams();
  const { orders, fetchOrders } = useCart();
  const fetchOrdersRef = useRef(fetchOrders);
  const [orderId, setOrderId] = useState(params.get("order") || "");
  const [query, setQuery] = useState(params.get("order") || "");

  useEffect(() => {
    fetchOrdersRef.current = fetchOrders;
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrdersRef.current();
  }, []);

  const order = useMemo(() => {
    const normalizedId = orderId.trim().toLowerCase();

    if (!normalizedId) return null;

    return orders.find((item) => {
      const id = String(getOrderId(item)).toLowerCase();
      return id === normalizedId || id.endsWith(normalizedId.replace("#", ""));
    });
  }, [orderId, orders]);

  const status = getOrderStatus(order);
  const activeStep = status === "cancelled"
    ? -1
    : Math.max(0, orderSteps.findIndex((step) => step.key === status));
  const shippingAddress = order?.shippingAddress || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderId(query.trim());
  };

  return (
    <section className="commerce-page track-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Track order</p>
          <h1>Track your delivery</h1>
        </div>
        <Link to="/orders" className="btn-secondary link-button">
          My orders
        </Link>
      </div>

      <form className="tracking-search tracking-search-card" onSubmit={handleSubmit}>
        <label>
          Order ID
          <input
            placeholder="Enter full order ID or last 8 characters"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button className="btn-primary" type="submit">Track</button>
      </form>

      {order ? (
        <div className="tracking-layout">
          <div className="tracking-main">
            <article className="tracking-card tracking-overview">
              <div className="tracking-order-header">
                <div>
                  <p className="eyebrow">Order #{getOrderId(order).slice(-8)}</p>
                  <h2>{status === "cancelled" ? "Order cancelled" : "Arriving soon"}</h2>
                  <p className="muted">
                    Estimated delivery: {status === "delivered" ? "Delivered" : getEtaText(order)}
                  </p>
                </div>
                <span className={`tracking-status ${status}`}>{status}</span>
              </div>

              <div className={status === "cancelled" ? "tracking-timeline cancelled" : "tracking-timeline"}>
                {orderSteps.map((step, index) => (
                  <div
                    className={index <= activeStep ? "tracking-step done" : "tracking-step"}
                    key={step.key}
                  >
                    <span className="tracking-dot">{index + 1}</span>
                    <div>
                      <strong>{step.label}</strong>
                      <p>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="tracking-side">
            <article className="tracking-card">
              <p className="eyebrow">Delivery snapshot</p>
              <h2>Ship to</h2>
              <div className="tracking-address compact">
                <strong>{shippingAddress.fullName || shippingAddress.fullname || "Recipient"}</strong>
                <span>{shippingAddress.phone || "Phone not added"}</span>
                <p>
                  {[shippingAddress.city, shippingAddress.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </article>

            <article className="tracking-card">
              <p className="eyebrow">Details</p>
              <h2>Need the receipt?</h2>
              <p className="muted">Open order details for items, full address, payment status, and invoice-style totals.</p>
            </article>

            <div className="tracking-actions">
              <Link to={`/orders/${getOrderId(order)}`} className="btn-primary link-button">Order details</Link>
              <Link to="/orders" className="btn-secondary link-button">View order history</Link>
              <Link to="/shop" className="btn-secondary link-button">Continue shopping</Link>
            </div>
          </aside>
        </div>
      ) : (
        <div className="empty-state small tracking-empty">
          <h2>{orderId ? "Order not found" : "No order selected"}</h2>
          <p>Enter an order ID or open one from your order history.</p>
          <Link to="/orders" className="btn-secondary link-button">
            View orders
          </Link>
        </div>
      )}
    </section>
  );
}
