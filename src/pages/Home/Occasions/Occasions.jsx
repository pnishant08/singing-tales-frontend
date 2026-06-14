import React from "react";
import { Link } from "react-router-dom";
import "./Occasions.css";

const occasions = [
  {
    name: "Birthday",
    image: "/images/birthday.jfif",
  },
  {
    name: "Anniversary",
    image: "/images/anniversary.jfif",
  },
  {
    name: "Wedding",
    image: "/images/wedding.jfif",
  },
  {
    name: "Festival",
    image: "/images/festival.jfif",
  },
  {
    name: "Custom",
    image: "/images/custom-image.jfif",
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