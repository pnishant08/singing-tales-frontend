import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "../ecommerce.css";
import api from "../../services/api";

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <section className="commerce-page empty-state">
        <h1>Your cart is empty</h1>
        <p>Browse the shop and add a singing card to begin.</p>
        <Link to="/shop" className="btn-primary link-button">Shop cards</Link>
      </section>
    );
  }

  return (
    <section className="commerce-page cart-layout">
      <div>
        <div className="page-heading">
          <div>
            <p className="eyebrow">Cart</p>
            <h1>Your selected cards</h1>
          </div>
        </div>

        <div className="cart-list">
          {items.map((item) => (
            <article className="cart-row" key={item._id}>
              <img
                src={
                  item.product?.image?.startsWith("/uploads")
                    ? `${api}${item.product.image}`
                    : item.product?.image || "/images/card-preview.svg"
                }
                alt={item.product?.title}
              />

              <div>
                <h3>{item.product?.title}</h3>

                <strong>₹{item.product?.price}</strong>
              </div>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item._id, Number(e.target.value))
                }
              />

              <button
                className="text-button"
                onClick={() => removeItem(item._id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </div>

      <aside className="summary-box">
        <h2>Order summary</h2>
        <p><span>Subtotal</span><strong>₹{totals.subtotal}</strong></p>
        <p><span>Delivery</span><strong>₹{totals.delivery}</strong></p>
        <p><span>Discount</span><strong>-₹{totals.discount}</strong></p>
        <hr />
        <p className="summary-total"><span>Total</span><strong>₹{totals.total}</strong></p>
        <button className="btn-primary" onClick={() => navigate("/checkout")}>
          Checkout
        </button>
      </aside>
    </section>
  );
}
