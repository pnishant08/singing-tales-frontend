import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card/Card";
import "./FeaturedCard.css";
import api from "../../../services/api";

export default function FeaturedCards() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/product")
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

  return (
    <section className="featured">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Popular picks</p>
          <h2>Ready-to-customize cards</h2>
        </div>

        <Link to="/shop" className="view-all-link">
          View All →
        </Link>
      </div>

      <div className="card-grid">
        {products.slice(0, 6).map((card) => (
          <Card key={card._id} data={card} />
        ))}
      </div>
    </section>
  );
}
