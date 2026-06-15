import React, { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "../ecommerce.css";
import "./OrderSuccessPage.css";

const getOrderId = (order) => order?._id || order?.id || "";
const getOrderTotal = (order) => Number(order?.totalAmount ?? order?.totals?.total ?? order?.total ?? 0);
const getOrderStatus = (order) => order?.orderStatus || order?.status || "placed";

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

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order") || "";
  const { orders, fetchOrders } = useCart();
  const fetchOrdersRef = useRef(fetchOrders);

  useEffect(() => {
    fetchOrdersRef.current = fetchOrders;
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrdersRef.current();
  }, []);

  const order = useMemo(() => {
    return orders.find((item) => String(getOrderId(item)) === orderId);
  }, [orderId, orders]);

  const total = getOrderTotal(order);
  const status = getOrderStatus(order);

  return (
    <section className="commerce-page order-success-page">
      <div className="success-hero">
        <div className="success-check" aria-hidden="true">✓</div>
        <p className="eyebrow">Order confirmed</p>
        <h1>Thank you for your order</h1>
        <p>
          Your singing card order has been placed successfully. We will keep your order
          status updated as it moves through processing, packing, and shipping.
        </p>

        <div className="success-actions">
          <Link to={`/track?order=${orderId}`} className="btn-primary link-button">
            Track order
          </Link>
          <Link to="/orders" className="btn-secondary link-button">
            View all orders
          </Link>
          {orderId && (
            <Link to={`/orders/${orderId}`} className="btn-secondary link-button">
              Order details
            </Link>
          )}
        </div>
      </div>

      <div className="success-layout">
        <div className="success-main">
          <article className="success-card">
            <div className="success-card-heading">
              <div>
                <p className="eyebrow">Receipt</p>
                <h2>Order summary</h2>
              </div>
              <span className={`order-success-status ${status}`}>{status}</span>
            </div>

            <div className="success-summary-grid">
              <span>
                <strong>#{orderId ? orderId.slice(-8) : "Pending"}</strong>
                Order number
              </span>
              <span>
                <strong>Rs. {total}</strong>
                Total paid
              </span>
              <span>
                <strong>{order?.paymentMethod || "COD"}</strong>
                Payment method
              </span>
              <span>
                <strong>{getEtaText(order)}</strong>
                Estimated delivery
              </span>
            </div>

            {orderId && (
              <div className="success-details-note">
                <strong>Need the full receipt?</strong>
                <span>Item list, shipping address, payment status, and price breakdown are saved in order details.</span>
                <Link to={`/orders/${orderId}`} className="text-button">Open order details</Link>
              </div>
            )}
          </article>
        </div>

        <aside className="success-side">
          <article className="success-card next-steps-card">
            <p className="eyebrow">Next steps</p>
            <h2>What happens now</h2>
            <ol className="success-steps">
              <li>We confirm your card details and payment method.</li>
              <li>Your order is packed and prepared for delivery.</li>
              <li>You can track the order from your account anytime.</li>
            </ol>
          </article>

          <Link to="/shop" className="continue-shopping-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
