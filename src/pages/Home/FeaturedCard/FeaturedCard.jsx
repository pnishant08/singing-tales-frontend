import React from "react";
import Card from "../../../components/common/Card/Card";
import { products } from "../../../data/products";
import "./FeaturedCard.css";

export default function FeaturedCards() {
  return (
    <section className="featured">
      <div className="section-heading">
        <p className="eyebrow">Popular picks</p>
        <h2>Ready-to-customize cards</h2>
      </div>

      <div className="card-grid">
        {products.slice(0, 3).map((card) => (
          <Card key={card.id} data={card} />
        ))}
      </div>
    </section>
  );
}
