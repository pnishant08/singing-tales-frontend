import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "../ecommerce.css";

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
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div>
                <h2>#{order._id}</h2>

                <p className="muted">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <strong>
                Rs. {order.totalAmount || order.total || 0}
              </strong>

              <span className="status-pill">
                {order.status || "Placed"}
              </span>

              <Link
                to={`/track?order=${order._id}`}
                className="btn-secondary link-button"
              >
                Track
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>

          <Link
            to="/shop"
            className="btn-primary link-button"
          >
            Start shopping
          </Link>
        </div>
      )}
    </section>
  );
}