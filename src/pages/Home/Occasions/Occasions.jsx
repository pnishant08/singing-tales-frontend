import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Occasions.css";

export default function Occasions() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/product")
      .then((res) => {
        const uniqueCategories = [
          ...new Set(res.data.map((p) => p.category))
        ];
        setCategories(uniqueCategories);
      });
  }, []);

  return (
    <section className="occasions">
      <div className="section-heading">
        <p className="eyebrow">Shop by occasion</p>
        <h2>Find the right tone for the moment</h2>
      </div>

      <div className="occasion-slider occasion-grid">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/occasion/${category}`}
            className="occasion-card"
          >
            <span>{category}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
