import React from "react";
import "./card.css";

export default function Card({ data }) {
  return (
    <div className="card">
      <img src={data.image} alt={data.title} />

      <h3>{data.title}</h3>
      <p>{data.price}</p>

      <button className="btn-primary">Customize</button>
    </div>
  );
}