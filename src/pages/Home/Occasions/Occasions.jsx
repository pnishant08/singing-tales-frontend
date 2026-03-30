import React from 'react';
import "./Occasions.css";

const occasions = [
  { name: "Birthday 🎂", image: "/images/birthday.jpg" },
  { name: "Anniversary 💖", image: "/images/anniversary.jpg" },
  { name: "Valentine ❤️", image: "/images/valentine.jpg" },
  { name: "Festivals 🎉", image: "/images/festival.jpg" },
];

export default function Occasions() {
  return (
    <section className="occasions">
      <h2>Shop by Occasion</h2>

      <div className="occasion-grid">
        {occasions.map((item, index) => (
          <div key={index} className="occasion-card">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}