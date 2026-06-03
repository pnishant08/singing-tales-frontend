import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">Custom singing cards</p>
        <h1>Send love that feels personal</h1>
        <p>
          Shop customizable singing cards, add your message, choose a tune, and send
          a keepsake that feels made for them.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/customize")} className="btn-primary">
            Create Your Card
          </button>

          <button onClick={() => navigate("/shop")} className="btn-secondary">
            Browse Cards
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img src="/images/card-preview.svg" alt="Singing card preview" />
      </div>
    </section>
  );
}
