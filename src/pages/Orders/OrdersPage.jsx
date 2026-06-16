import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { getImageUrl } from "../../services/api";
import "../ecommerce.css";
import "./OrderPage.css";

const orderSteps = ["placed", "processing", "shipped", "delivered"];

const getOrderStatus = (order) =>
  (order.orderStatus || order.status || "placed").toLowerCase();

const getStepIndex = (status) => {
  if (status === "cancelled") return -1;
  return orderSteps.indexOf(status);
};

export default function OrdersPage() {
  const { orders, fetchOrders } = useCart();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <section className="commerce-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My Orders</h1>
        </div>
      </div>

      {orders.length ? (
        <div className="orders-grid">
          {orders.map((order) => {
            const status = getOrderStatus(order);
            const activeStep = getStepIndex(status);
            const firstItem = order.items?.[0];
            const product = firstItem?.product || {};
            const title = product.title || firstItem?.title || "Singing Card";

            return (
              <article className="order-card-modern" key={order._id}>
                <div className="order-image">
                  <img
                    src={getImageUrl(product.image || firstItem?.image)}
                    alt={title}
                  />
                </div>

                <div className="order-content">
                  <div className="order-header">
                    <div>
                      <h3>{title}</h3>
                      <p className="muted">
                        Order ID: #{order._id.slice(-8)}
                      </p>
                      <p className="muted">
                        Ordered on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className={`order-status ${status}`}>
                      {status}
                    </span>
                  </div>

                  <div
                    className={
                      status === "cancelled"
                        ? "order-progress cancelled"
                        : "order-progress"
                    }
                  >
                    {orderSteps.map((step, index) => (
                      <div
                        className={`progress-step ${
                          index <= activeStep ? "done" : ""
                        }`}
                        key={step}
                      >
                        <div className="progress-dot">
                          {index <= activeStep ? "✓" : ""}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-meta">
                    <span>
                      <strong>Rs. {order.totalAmount || order.total || 0}</strong>
                      Total
                    </span>

                    <span>
                      <strong>{order.items?.length || 1}</strong>
                      Items
                    </span>

                    <span>
                      <strong>
                        {order.paymentStatus || "pending"}
                      </strong>
                      Payment
                    </span>
                  </div>

                  {order.shippingAddress && (
                    <div className="order-address-preview">
                      <strong>Deliver to:</strong>{" "}
                      {[
                        order.shippingAddress.fullName,
                        order.shippingAddress.city,
                        order.shippingAddress.state,
                        order.shippingAddress.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}

                  <div className="order-actions">
                    <Link
                      to={`/track?order=${order._id}`}
                      className="btn-primary link-button"
                    >
                      Track Order
                    </Link>

                    <Link
                      to={`/orders/${order._id}`}
                      className="btn-secondary link-button"
                    >
                      Order Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>

          <Link to="/shop" className="btn-primary link-button">
            Start shopping
          </Link>
        </div>
      )}
    </section>
  );
}
