import React, { useMemo, useState } from "react";
import Card from "../../components/common/Card/Card";
import { categories, occasions, products } from "../../data/products";
import "../ecommerce.css";

export default function ShopPage({ initialView = "products" }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState(initialView);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchText = `${product.title} ${product.category} ${product.occasion}`.toLowerCase();
      const matchesQuery = searchText.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section className="commerce-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Shop singing cards</p>
          <h1>Personal cards for every celebration</h1>
        </div>
        <div className="segmented">
          <button className={view === "products" ? "active" : ""} onClick={() => setView("products")}>
            Products
          </button>
          <button className={view === "occasions" ? "active" : ""} onClick={() => setView("occasions")}>
            Occasions
          </button>
        </div>
      </div>

      {view === "occasions" ? (
        <div className="occasion-list">
          {occasions.map((occasion) => (
            <button
              key={occasion.name}
              className="occasion-tile"
              onClick={() => {
                setCategory("All");
                setQuery(occasion.name);
                setView("products");
              }}
            >
              <img src={occasion.image} alt={occasion.name} />
              <span>{occasion.name}</span>
              <small>{occasion.description}</small>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="shop-toolbar">
            <input
              type="search"
              placeholder="Search birthday, romance, festive..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="category-pills">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <Card key={product.id} data={product} />
            ))}
          </div>

          {!filteredProducts.length && (
            <div className="empty-state">
              <h2>No cards found</h2>
              <p>Try a different occasion or clear the search.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
