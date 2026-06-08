import React, { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card/Card";
import api from "../../services/api";
import "../ecommerce.css";
import { useSearchParams } from "react-router-dom";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const selectedOccasion = searchParams.get("occasion");

  const categories = ["All", "Vintage", "Floral", "Modern", "Minimal", "Luxury"];

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesOccasion =
        !selectedOccasion || product.occasion === selectedOccasion;

      const searchText = `${product.title} ${product.category} ${product.occasion} ${product.description}`.toLowerCase();

      const matchesQuery = searchText.includes(query.toLowerCase());

      return matchesCategory && matchesOccasion && matchesQuery;
    });
  }, [products, category, query, selectedOccasion]);

  return (
    <section className="commerce-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Shop singing cards</p>
          <h1>
            {selectedOccasion
              ? `${selectedOccasion} Cards`
              : "Personal cards for every celebration"}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h2>Loading products...</h2>
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