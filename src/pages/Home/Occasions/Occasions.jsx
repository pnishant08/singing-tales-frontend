import React from "react";
import { Link } from "react-router-dom";
import "./Occasions.css";

const occasions = ["Birthday", "Anniversary", "Wedding", "Festival", "Custom"];

export default function Occasions() {
  return (
    <section className="occasions">
      <div className="section-heading">
        <p className="eyebrow">Shop by occasion</p>
        <h2>Find the right tone for the moment</h2>
      </div>

      <div className="occasion-slider occasion-grid">
        {occasions.map((occasion) => (
          <Link
            key={occasion}
            to={`/shop?occasion=${occasion}`}
            className="occasion-card"
          >
            <span>{occasion}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}