import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { getImageUrl } from "../../services/api";
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
const getOrderTotal = (order) => Number(order?.totalAmount ?? order?.totals?.total ?? order?.total ?? 0);
const getShippingLine = (shippingAddress = {}) =>
  shippingAddress.addressLine || shippingAddress.address || "";

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
  const items = order?.items || [];

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

            <article className="tracking-card">
              <div className="tracking-section-heading">
                <div>
                  <p className="eyebrow">Items</p>
                  <h2>Shipment contents</h2>
                </div>
                <span className="tracking-count">{items.length} items</span>
              </div>

              <div className="tracking-items">
                {items.map((item) => {
                  const product = item.product || {};
                  const title = product.title || item.title || "Singing Card";
                  const quantity = Number(item.quantity || 1);
                  const price = Number(product.price ?? item.price ?? item.unitPrice ?? 0);

                  return (
                    <div className="tracking-item" key={item._id || title}>
                      <img src={getImageUrl(product.image || item.image)} alt={title} />
                      <div>
                        <strong>{title}</strong>
                        <span>{product.category || product.occasion || "Greeting card"}</span>
                      </div>
                      <div className="tracking-item-total">
                        <span>Qty {quantity}</span>
                        <strong>Rs. {price * quantity}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <aside className="tracking-side">
            <article className="tracking-card">
              <p className="eyebrow">Delivery address</p>
              <h2>Ship to</h2>
              <div className="tracking-address">
                <strong>{shippingAddress.fullName || shippingAddress.fullname || "Recipient"}</strong>
                <span>{shippingAddress.phone || "Phone not added"}</span>
                <span>{shippingAddress.email || "Email not added"}</span>
                {getShippingLine(shippingAddress) && <p>{getShippingLine(shippingAddress)}</p>}
                <p>
                  {[shippingAddress.city, shippingAddress.state, shippingAddress.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>{shippingAddress.country || "India"}</p>
              </div>
            </article>

            <article className="tracking-card">
              <p className="eyebrow">Payment</p>
              <h2>Order total</h2>
              <div className="tracking-summary">
                <p><span>Payment</span><strong>{order.paymentMethod || "COD"}</strong></p>
                <p><span>Status</span><strong>{order.paymentStatus || "pending"}</strong></p>
                <p className="tracking-summary-total"><span>Total</span><strong>Rs. {getOrderTotal(order)}</strong></p>
              </div>
            </article>

            <div className="tracking-actions">
              <Link to="/orders" className="btn-primary link-button">View order history</Link>
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
