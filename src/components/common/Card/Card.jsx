import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../../context/useCart";
import "./Card.css";

export default function Card({ data }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addItem(data);
    toast.success("Added to cart");
  };

  return (
    <article className="card product-card">
      {data.badge && <span className="product-badge">{data.badge}</span>}
      <Link to={`/customize?product=${data.id}`} className="product-media">
        <img src={data.image} alt={data.title} />
      </Link>

      <div className="product-copy">
        <p className="product-category">{data.category}</p>
        <h3>{data.title}</h3>
        <p className="product-description">{data.description}</p>
      </div>

      <div className="product-meta">
        <strong>₹{data.price}</strong>
        <span>{data.rating} rating</span>
      </div>

      <div className="product-actions">
        <button className="btn-secondary compact" onClick={() => navigate(`/customize?product=${data.id}`)}>
          Customize
        </button>
        <button className="btn-primary compact" onClick={handleAdd}>
          Add
        </button>
      </div>
    </article>
  );
}
