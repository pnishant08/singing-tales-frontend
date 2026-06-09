import React from "react";
import { Link } from "react-router-dom";
import "./Occasions.css";

const occasions = [
  {
    name: "Birthday",
    image:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800",
  },
  {
    name: "Anniversary",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
  },
  {
    name: "Wedding",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
  },
  {
    name: "Festival",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
  },
  {
    name: "Custom",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  },
];

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
            key={occasion.name}
            to={`/shop?occasion=${occasion.name}`}
            className="occasion-card"
          >
            <img src={occasion.image} alt={occasion.name} />

            <div className="occasion-card-content">
              <h3>{occasion.name}</h3>
              <p>Explore cards</p>
            </div>

            <span className="occasion-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}