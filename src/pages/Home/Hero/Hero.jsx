import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Send Love That Feels Personal 💌</h1>
        <p>
          Create beautiful customized cards and surprise your loved ones.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/create")} className="btn-primary">
            Create Your Card
          </button>

          <button onClick={() => navigate("/shop")} className="btn-secondary">
            Browse Cards
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img src="/images/card-preview.png" alt="Card Preview" />
      </div>
    </section>
  );
}