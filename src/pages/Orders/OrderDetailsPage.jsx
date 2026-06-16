import React, { useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { getImageUrl } from "../../services/api";
import "../ecommerce.css";
import "./OrderPage.css";

const getOrderId = (order) => order?._id || order?.id || "";
const getOrderStatus = (order) => (order?.orderStatus || order?.status || "placed").toLowerCase();
const getOrderTotal = (order) => Number(order?.totalAmount ?? order?.totals?.total ?? order?.total ?? 0);
const getShippingLine = (shippingAddress = {}) =>
  shippingAddress.addressLine || shippingAddress.address || "";

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "Not available");

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { orders, fetchOrders } = useCart();
  const fetchOrdersRef = useRef(fetchOrders);

  useEffect(() => {
    fetchOrdersRef.current = fetchOrders;
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrdersRef.current();
  }, []);

  const order = useMemo(() => {
    const normalizedId = String(orderId || "").toLowerCase();
    return orders.find((item) => String(getOrderId(item)).toLowerCase() === normalizedId);
  }, [orderId, orders]);

  if (!order) {
    return (
      <section className="commerce-page empty-state">
        <h1>Order not found</h1>
        <p>Open your order history and choose an order to view details.</p>
        <Link to="/orders" className="btn-primary link-button">Back to orders</Link>
      </section>
    );
  }

  const status = getOrderStatus(order);
  const shippingAddress = order.shippingAddress || {};
  const items = order.items || [];
  const subtotal = items.reduce((sum, item) => {
    const product = item.product || {};
    const quantity = Number(item.quantity || 1);
    const price = Number(product.price ?? item.price ?? item.unitPrice ?? 0);
    return sum + price * quantity;
  }, 0);
  const total = getOrderTotal(order);
  const delivery = Number(order.totals?.delivery ?? Math.max(0, total - subtotal));
  const discount = Number(order.totals?.discount ?? 0);

  return (
    <section className="commerce-page order-details-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Order details</p>
          <h1>Order #{getOrderId(order).slice(-8)}</h1>
        </div>
        <div className="button-row">
          <Link to={`/track?order=${getOrderId(order)}`} className="btn-primary link-button">Track order</Link>
          <Link to="/orders" className="btn-secondary link-button">Back to orders</Link>
        </div>
      </div>

      <div className="order-details-layout">
        <div className="order-details-main">
          <article className="order-details-card">
            <div className="order-details-heading">
              <div>
                <p className="eyebrow">Status</p>
                <h2>{status === "cancelled" ? "Order cancelled" : "Order in progress"}</h2>
              </div>
              <span className={`order-status ${status}`}>{status}</span>
            </div>

            <div className="order-details-grid">
              <span><strong>{formatDate(order.createdAt)}</strong>Ordered on</span>
              <span><strong>{order.paymentMethod || "COD"}</strong>Payment method</span>
              <span><strong>{order.paymentStatus || "pending"}</strong>Payment status</span>
              <span><strong>{items.length}</strong>Total items</span>
            </div>
          </article>

          <article className="order-details-card">
            <div className="order-details-heading">
              <div>
                <p className="eyebrow">Items</p>
                <h2>Products in this order</h2>
              </div>
            </div>

            <div className="order-detail-items">
              {items.map((item) => {
                const product = item.product || {};
                const title = product.title || item.title || "Singing Card";
                const quantity = Number(item.quantity || 1);
                const price = Number(product.price ?? item.price ?? item.unitPrice ?? 0);

                return (
                  <div className="order-detail-item" key={item._id || title}>
                    <img src={getImageUrl(product.image || item.image)} alt={title} />
                    <div>
                      <strong>{title}</strong>
                      <span>{product.category || product.occasion || "Greeting card"}</span>
                      {product.description && <p>{product.description}</p>}
                    </div>
                    <div className="order-detail-item-total">
                      <span>Qty {quantity}</span>
                      <strong>Rs. {price * quantity}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="order-details-side">
          <article className="order-details-card">
            <p className="eyebrow">Shipping</p>
            <h2>Delivery details</h2>
            <div className="order-detail-address">
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

          <article className="order-details-card">
            <p className="eyebrow">Receipt</p>
            <h2>Price summary</h2>
            <div className="order-detail-receipt">
              <p><span>Subtotal</span><strong>Rs. {subtotal}</strong></p>
              <p><span>Delivery</span><strong>Rs. {delivery}</strong></p>
              <p><span>Discount</span><strong>- Rs. {discount}</strong></p>
              <hr />
              <p className="order-detail-total"><span>Total</span><strong>Rs. {total}</strong></p>
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
