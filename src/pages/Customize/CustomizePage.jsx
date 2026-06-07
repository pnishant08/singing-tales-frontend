import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/useCart";
import api, { getImageUrl } from "../../services/api";
import "../ecommerce.css";

const songs = [
  "Happy Birthday Melody",
  "Romantic Piano Tune",
  "Friendship Acoustic",
  "Wedding Bells",
  "Festival Celebration",
];

export default function CustomizePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(params.get("product") || "");
  const [customization, setCustomization] = useState({
    recipient: "",
    sender: "",
    message: "",
    song: songs[0],
    color: "Rose",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product");
        const activeProducts = res.data.filter(
          (item) => item.isAvailable !== false
        );

        setProducts(activeProducts);

        if (!productId && activeProducts.length > 0) {
          setProductId(activeProducts[0]._id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load products");
      }
    };

    fetchProducts();
  }, []);

  const product = useMemo(() => {
    return (
      products.find((item) => item._id === productId) ||
      products[0]
    );
  }, [products, productId]);

  const handleChange = (e) => {
    setCustomization({
      ...customization,
      [e.target.name]: e.target.value,
    });
  };

  const addCustomizedCard = async () => {
    if (!product) {
      toast.error("Please select a card");
      return;
    }

    if (!customization.recipient.trim() || !customization.message.trim()) {
      toast.error("Recipient and message are required");
      return;
    }

    try {
      await addItem(product, 1);
      toast.success("Custom card added to cart");
      navigate("/cart");
    } catch (err) {
      console.log(err);
      toast.error("Could not add customized card");
    }
  };

  if (!product) {
    return (
      <section className="commerce-page empty-state">
        <h1>Loading card studio...</h1>
      </section>
    );
  }

  return (
    <section className="commerce-page customize-layout">
      <div className="customizer-panel">
        <p className="eyebrow">Card studio</p>
        <h1>Customize your singing card</h1>
        <p className="muted">
          Choose a card, tune, cover color, and personal message.
        </p>

        <label>
          Card design
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>

        <div className="form-grid">
          <label>
            Recipient
            <input
              name="recipient"
              value={customization.recipient}
              onChange={handleChange}
            />
          </label>

          <label>
            From
            <input
              name="sender"
              value={customization.sender}
              onChange={handleChange}
            />
          </label>
        </div>

        
        <label>
          Cover color
          <select
            name="color"
            value={customization.color}
            onChange={handleChange}
          >
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
        <img src={getImageUrl(product.image)} alt={product.title} />

        <div className={`preview-card ${customization.color.toLowerCase()}`}>
          <span>
            To {customization.recipient || "Someone special"}
          </span>

          <p>
            {customization.message ||
              "Your personal message will appear here."}
          </p>

          <small>{customization.song}</small>
        </div>
      </aside>
    </section>
  );
}