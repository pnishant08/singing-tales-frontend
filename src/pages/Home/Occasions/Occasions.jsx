import React from "react";
import { Link } from "react-router-dom";
import { occasions } from "../../../data/products";
import "./Occasions.css";

export default function Occasions() {
  return (
    <section className="occasions">
      <div className="section-heading">
        <p className="eyebrow">Shop by occasion</p>
        <h2>Find the right tone for the moment</h2>
      </div>

      <div className="occasion-grid">
        {occasions.map((item) => (
          <Link to="/occasions" key={item.name} className="occasion-card">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
