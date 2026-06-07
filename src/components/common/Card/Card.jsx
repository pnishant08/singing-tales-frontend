import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../../context/useCart";
import { getImageUrl } from "../../../services/api";
import "./Card.css";

export default function Card({ data }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  console.log(data)
  const productId = data._id || data.id;
  const imageUrl = getImageUrl(data.image);

  const handleAdd = async () => {
    try {
      await addItem(data);
      toast.success("Added to cart");
    } catch (err) {
      console.log(err);
      toast.error("Could not add to cart");
    }
  };

  return (
    <article className="card product-card">
      {data.badge && <span className="product-badge">{data.badge}</span>}

      <Link to={`/customize?product=${productId}`} className="product-media">
        <img src={imageUrl} alt={data.title} />
      </Link>

      <div className="product-copy">
        <p className="product-category">{data.category}</p>
        <h3>{data.title}</h3>
        <p className="product-description">{data.description}</p>
      </div>

      <div className="product-meta">
        <strong>₹{data.price}</strong>
        {data.rating && <span>{data.rating} rating</span>}
      </div>

      <div className="product-actions">
        <button
          className="btn-secondary compact"
          onClick={() => navigate(`/customize?product=${productId}`)}
          type="button"
        >
          Customize
        </button>

        <button className="btn-primary compact" onClick={handleAdd} type="button">
          Add
        </button>
      </div>
    </article>
  );
}