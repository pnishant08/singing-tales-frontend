import React, { useEffect, useMemo, useState } from "react";
import Card from "../../components/common/Card/Card";
import api from "../../services/api";
import "../ecommerce.css";

export default function ShopPage({ initialView = "products" }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState(initialView);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((item) => item.category).filter(Boolean))];
  }, [products]);

  const occasions = useMemo(() => {
    return [...new Set(products.map((item) => item.category).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const searchText = `${product.title} ${product.category} ${product.description}`.toLowerCase();

      const matchesQuery = searchText.includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  return (
    <section className="commerce-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Shop singing cards</p>
          <h1>Personal cards for every celebration</h1>
        </div>

        <div className="segmented">
          <button
            type="button"
            className={view === "products" ? "active" : ""}
            onClick={() => setView("products")}
          >
            Products
          </button>

          <button
            type="button"
            className={view === "occasions" ? "active" : ""}
            onClick={() => setView("occasions")}
          >
            Occasions
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h2>Loading products...</h2>
        </div>
      ) : view === "occasions" ? (
        <div className="occasion-list">
          {occasions.map((item) => (
            <button
              key={item}
              type="button"
              className="occasion-tile"
              onClick={() => {
                setCategory(item);
                setQuery("");
                setView("products");
              }}
            >
              <span>{item}</span>
              <small>Explore {item} singing cards</small>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="shop-toolbar">
            <input
              type="search"
              placeholder="Search birthday, wedding, festival..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="category-pills">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
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
              <Card key={product._id} data={product} />
            ))}
          </div>

          {!filteredProducts.length && (
            <div className="empty-state">
              <h2>No cards found</h2>
              <p>Try a different category or clear the search.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}