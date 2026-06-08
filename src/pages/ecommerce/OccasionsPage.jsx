import React from "react";
import { Link } from "react-router-dom";
import "./OccasionsPage.css";

const occasions = [
    {
        name: "Birthday",
        text: "Make birthdays unforgettable with personalized singing cards.",
        image:
            "https://images.unsplash.com/photo-1464349153735-7db50ed83c84",
    },
    {
        name: "Anniversary",
        text: "Celebrate love and milestones with romantic musical cards.",
        image:
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    },
    {
        name: "Wedding",
        text: "Elegant cards crafted for weddings and special ceremonies.",
        image:
            "https://images.unsplash.com/photo-1519741497674-611481863552",
    },
    {
        name: "Festival",
        text: "Spread joy and festive wishes through musical greetings.",
        image:
            "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342",
    },
    {
        name: "Custom",
        text: "Design a one-of-a-kind card with your own message and song.",
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
];

export default function OccasionsPage() {
    return (
        <section className="occasion-page">
            <div className="occasion-hero">
                <p className="eyebrow">Occasions</p>
                <h1>Choose the perfect moment</h1>
                <p>
                    Browse singing cards by celebration and find the right design,
                    message, and melody.
                </p>
            </div>

            <div className="occasion-page-grid">
                {occasions.map((occasion) => (
                    <Link
                        key={occasion.name}
                        to={`/shop?occasion=${occasion.name}`}
                        className="occasion-page-card"
                    >
                        <img src={occasion.image} alt={occasion.name} />

                        <div className="occasion-content">
                            <h2>{occasion.name}</h2>
                            <p>{occasion.text}</p>

                            <div className="occasion-action">
                                <span>Explore Collection</span>
                                <span className="arrow">→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}