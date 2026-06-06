import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../../context/useCart";
import api from "../../services/api";
import "../ecommerce.css";

const orderStatuses = ["Placed", "Crafting", "Packed", "Shipped", "Delivered"];

const blankProduct = {
  title: "",
  description: "",
  price: "",
  category: "Birthday",
  image: "null",
  isCustomizable: false,
  isAvailable: true
};

export default function AdminPage() {
  const { updateOrderStatus } = useCart();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(blankProduct);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get("/product"),
          api.get("/order"),
          api.get("/admin/users"),
        ]);

        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setAdminOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Could not load admin data");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const stats = useMemo(() => {
    const revenue = adminOrders.reduce(
      (sum, order) => sum + Number(order.totals?.total || 0),
      0
    );

    return [
      { label: "Total orders", value: adminOrders.length },
      { label: "Products", value: products.length },
      { label: "Users", value: users.length },
      { label: "Revenue", value: `Rs. ${revenue}` },
    ];
  }, [adminOrders, products.length, users.length]);

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("title", productForm.title);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price);
      formData.append("category", productForm.category);

      if (productForm.image) {
        formData.append("image", productForm.image);
      }

      const res = await api.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProducts((current) => [res.data, ...current]);
      setProductForm(blankProduct);

      toast.success("Product saved");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Product save failed");
    }
  };


  const editProduct = (product) => {
    setProductForm({
      ...blankProduct,
      ...product,
      price: String(product.price || ""),
      stock: String(product.stock || ""),
    });
    setActiveTab("products");
  };

  const toggleProductActive = async (productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    try {
      const res = await api.patch(`/admin/products/${productId}`, {
        isActive: !product.isActive,
      });
      const updatedProduct = res.data || { ...product, isActive: !product.isActive };
      setProducts((current) =>
        current.map((item) => (item.id === productId ? updatedProduct : item))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Product update failed");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status });
      const updatedOrder = res.data;
      setAdminOrders((current) =>
        current.map((order) =>
          order.id === orderId ? updatedOrder || { ...order, status } : order
        )
      );
      updateOrderStatus(orderId, status);
      toast.success("Order status updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Order status update failed");
    }
  };

  const updateUser = async (email, updates) => {
    try {
      const res = await api.patch(`/admin/users/${email}`, updates);
      const updatedUser = res.data;
      setUsers((current) =>
        current.map((user) =>
          user.email === email ? updatedUser || { ...user, ...updates } : user
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "User update failed");
    }
  };

  return (
    <section className="commerce-page admin-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="admin-stats">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="segmented admin-tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
          type="button"
        >
          Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
          type="button"
        >
          Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
          type="button"
        >
          Users
        </button>
      </div>

      {loading ? (
        <div className="empty-state small">Loading admin data...</div>
      ) : (
        <>
          {activeTab === "products" && (
            <div className="admin-grid">
              <div className="checkout-form">
                <h2>{productForm.id ? "Edit card" : "Add card"}</h2>
                <div className="form-grid">
                  <label>
                    Title
                    <input
                      name="title"
                      value={productForm.title}
                      onChange={handleProductChange} />
                  </label>
                  <label>
                    Category
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductChange}
                    >
                      <option value="Birthday">Birthday</option>
                      <option value="Aniversary">Aniversary</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Festival">Festival</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </label>

                  <label>
                    Price
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={productForm.price}
                      onChange={handleProductChange} />
                  </label>
                </div>
                <label>
                  Product Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        image: e.target.files[0],
                      })
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    name="description"
                    rows="3"
                    value={productForm.description}
                    onChange={handleProductChange} />
                </label>
                <label className="inline-check">
                  <input name="isActive" type="checkbox" checked={productForm.isActive} onChange={handleProductChange} />
                  Active product
                </label>
                <div className="button-row">
                  <button className="btn-primary" onClick={saveProduct} type="button">Save card</button>
                  <button className="btn-secondary" onClick={() => setProductForm(blankProduct)} type="button">Clear</button>
                </div>
              </div>

              <div className="admin-list">
                {products.map((product) => (
                  <article className="admin-product-row" key={product.id}>
                    <img
                      src={
                        product.image?.[0]
                          ? `http://192.168.1.14:3000${product.image[0]}`
                          : "/images/card-preview.svg"
                      }
                      alt={product.title}
                    />
                    <div>
                      <h3>{product.title}</h3>
                      <p className="muted">{product.category} / {product.occasion || "General"}</p>
                      <p>Rs. {product.price} / Stock {product.stock ?? 0}</p>
                    </div>
                    <span className="status-pill">{product.isActive === false ? "Hidden" : "Active"}</span>
                    <button className="btn-secondary compact" onClick={() => editProduct(product)} type="button">Edit</button>
                    <button className="text-button" onClick={() => toggleProductActive(product.id)} type="button">
                      {product.isActive === false ? "Show" : "Hide"}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="admin-list">
              {adminOrders.length ? adminOrders.map((order) => (
                <article className="admin-order-row" key={order.id}>
                  <div>
                    <h3>{order.id}</h3>
                    <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
                    <p>{order.customer?.fullName || order.customer?.name || "Customer"} / Rs. {order.totals?.total || 0}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </article>
              )) : (
                <div className="empty-state small">No orders yet.</div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="admin-list">
              {users.map((user) => (
                <article className="admin-user-row" key={user.email}>
                  <div>
                    <h3>{user.name || user.username || user.email}</h3>
                    <p>{user.email}</p>
                    <p className="muted">{user.phone || "No phone"} / Last login {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Unknown"}</p>
                  </div>
                  <select
                    value={user.role || "user"}
                    onChange={(e) => updateUser(user.email, { role: e.target.value })}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <span className="status-pill">{user.isBlocked || user.blocked ? "Blocked" : "Active"}</span>
                  <button
                    className="btn-secondary compact"
                    onClick={() => updateUser(user.email, { isBlocked: !(user.isBlocked || user.blocked) })}
                    type="button"
                  >
                    {user.isBlocked || user.blocked ? "Unblock" : "Block"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
