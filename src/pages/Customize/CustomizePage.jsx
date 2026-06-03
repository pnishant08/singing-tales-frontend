import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById, products } from "../../data/products";
import { useCart } from "../../context/useCart";
import "../ecommerce.css";

export default function CustomizePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const selectedProduct = useMemo(
    () => getProductById(params.get("product")) || products[0],
    [params]
  );

  const [productId, setProductId] = useState(selectedProduct.id);
  const product = getProductById(productId) || products[0];
  const [customization, setCustomization] = useState({
    recipient: "",
    sender: "",
    message: "",
    song: product.songs[0],
    color: "Rose",
  });

  const handleChange = (e) => {
    setCustomization({ ...customization, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    const nextProduct = getProductById(e.target.value);
    setProductId(e.target.value);
    setCustomization((current) => ({
      ...current,
      song: nextProduct?.songs[0] || current.song,
    }));
  };

  const addCustomizedCard = () => {
    if (!customization.recipient.trim() || !customization.message.trim()) {
      toast.error("Recipient and message are required");
      return;
    }

    addItem(product, 1, customization);
    toast.success("Custom card added to cart");
    navigate("/cart");
  };

  return (
    <section className="commerce-page customize-layout">
      <div className="customizer-panel">
        <p className="eyebrow">Card studio</p>
        <h1>Customize your singing card</h1>
        <p className="muted">Choose a card, tune, cover color, and personal message.</p>

        <label>
          Card design
          <select value={productId} onChange={handleProductChange}>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>

        <div className="form-grid">
          <label>
            Recipient
            <input name="recipient" value={customization.recipient} onChange={handleChange} />
          </label>
          <label>
            From
            <input name="sender" value={customization.sender} onChange={handleChange} />
          </label>
        </div>

        <label>
          Singing tune
          <select name="song" value={customization.song} onChange={handleChange}>
            {product.songs.map((song) => (
              <option key={song} value={song}>
                {song}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cover color
          <select name="color" value={customization.color} onChange={handleChange}>
            <option>Rose</option>
            <option>Amber</option>
            <option>Mint</option>
            <option>Indigo</option>
          </select>
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows="5"
            maxLength="180"
            value={customization.message}
            onChange={handleChange}
            placeholder="Write the note that will be printed inside the card"
          />
        </label>

        <button className="btn-primary" onClick={addCustomizedCard}>
          Add customized card - ₹{product.price}
        </button>
      </div>

      <aside className="card-preview-panel">
        <img src={product.image} alt={product.title} />
        <div className={`preview-card ${customization.color.toLowerCase()}`}>
          <span>To {customization.recipient || "Someone special"}</span>
          <p>{customization.message || "Your personal message will appear here."}</p>
          <small>{customization.song}</small>
        </div>
      </aside>
    </section>
  );
}
