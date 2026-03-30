import React from 'react';
import Card from "../../../components/common/Card/Card";
import "./FeaturedCard.css";

const cards = [
  { id: 1, title: "Romantic Card", price: "₹199", image: "/images/card1.jpg" },
  { id: 2, title: "Birthday Special", price: "₹149", image: "/images/card2.jpg" },
  { id: 3, title: "Friendship Card", price: "₹129", image: "/images/card3.jpg" },
];

export default function FeaturedCards() {
  return (
    <section className="featured">
      <h2>Popular Cards</h2>

      <div className="card-grid">
        {cards.map((card) => (
          <Card key={card.id} data={card} />
        ))}
      </div>
    </section>
  );
}