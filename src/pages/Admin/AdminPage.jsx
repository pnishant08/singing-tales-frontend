import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api, { getImageUrl } from "../../services/api";
import "../ecommerce.css";
import "./AdminPage.css";

const orderStatuses = [
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];

const blankProduct = {
  title: "",
  description: "",
  price: "",
  category: "Vintage",
  occasion: "Birthday",
  image: "",
  imageFile: null,
  isCustomizable: false,
  isAvailable: true
};

const getOrderTotal = (order) =>
  Number(order.totalAmount ?? order.totals?.total ?? order.total ?? 0);

const getOrderStatus = (order) => order.orderStatus || order.status || "placed";

const getShippingLine = (shippingAddress = {}) =>
  shippingAddress.addressLine || shippingAddress.address || "";

const getCustomerName = (order) =>
  order.customer?.fullName ||
  order.customer?.name ||
  order.user?.name ||
  order.shippingAddress?.fullName ||
  order.shippingAddress?.fullname ||
  "Customer";

const getShipToName = (order) =>
  order.shippingAddress?.fullName ||
  order.shippingAddress?.fullname ||
  order.customer?.fullName ||
  order.customer?.name ||
  order.user?.name ||
  "Customer";

export default function AdminPage() {
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
      (sum, order) => sum + getOrderTotal(order),
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
      formData.append("occasion", productForm.occasion);

      if (productForm.imageFile) {
        formData.append("image", productForm.imageFile);
      } else {
        formData.append("image", productForm.image || "");
      }

      let res;

      if (productForm._id) {
        // Update existing product
        res = await api.put(`/product/${productForm._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Create new product
        res = await api.post("/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      };


      if (productForm._id) {
        setProducts((current) =>
          current.map((item) =>
            item._id === productForm._id ? res.data : item
          )
        );
        setProductForm(blankProduct);
        toast.success("Product updated");
      } else {
        setProducts((current) => [res.data, ...current]);
        toast.success("Product created");
        setProductForm(blankProduct);
      }
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

  const toggleProductAvailable = async (productId) => {
    const product = products.find((item) => item._id === productId);
    if (!product) return;

    try {
      const res = await api.put(`/product/${productId}`, {
        isAvailable: !product.isAvailable,
      });
      const updatedProduct = res.data || { ...product, isActive: !product.isAvailable };
      setProducts((current) =>
        current.map((item) => (item._id === productId ? updatedProduct : item))
      );
      toast.success("Product Hidden");
    } catch (err) {
      toast.error(err.response?.data?.error || "Product hidden failed");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await api.put(`/order/${orderId}/status`, {
        orderStatus: status,
      });

      setAdminOrders((current) =>
        current.map((order) =>
          order._id === orderId ? res.data : order
        )
      );

      toast.success("Order status updated");
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Failed to update status");
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
                <h2>{productForm._id ? "Edit card" : "Add card"}</h2>
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
                    <select name="category" value={productForm.category} onChange={handleProductChange}>
                      <option value="Vintage">Vintage</option>
                      <option value="Floral">Floral</option>
                      <option value="Modern">Modern</option>
                      <option value="Minimal">Minimal</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </label>

                  <label>
                    Occasion
                    <select name="occasion" value={productForm.occasion} onChange={handleProductChange}>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
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
                  Image URL
                  <input
                    name="image"
                    value={productForm.image}
                    onChange={handleProductChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </label>

                <label>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        imageFile: e.target.files[0],
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
                  <article className="admin-product-row" key={product._id}>
                    <img src={getImageUrl(product.image)} alt={product.title} />
                    <div>
                      <h3>{product.title}</h3>
                      <p className="muted">{product.category} / {product.occasion || "General"}</p>
                      <p>Rs. {product.price} / Stock {product.stock ?? 0}</p>
                    </div>
                    <span className="status-pill">{product.isAvailable === false ? "Hidden" : "Active"}</span>
                    <button className="btn-secondary compact" onClick={() => editProduct(product)} type="button">Edit</button>
                    <button className="text-button" onClick={() => toggleProductAvailable(product._id)} type="button">
                      {product.isAvailable === false ? "Show" : "Hide"}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="admin-orders-panel">
              {adminOrders.length ? (
                adminOrders.map((order) => {
                  const orderTotal = getOrderTotal(order);
                  const orderStatus = getOrderStatus(order);
                  const shippingAddress = order.shippingAddress || {};
                  const customerEmail = shippingAddress.email || order.user?.email || order.customer?.email;
                  const customerPhone = shippingAddress.phone || order.user?.phone || order.customer?.phone;
                  const shipToEmail = shippingAddress.email || customerEmail;
                  const shipToPhone = shippingAddress.phone || customerPhone;

                  return (
                    <div className="admin-order-card" key={order._id}>
                    <div className="order-header">
                      <div>
                        <h3>Order #{String(order._id || "").slice(-8)}</h3>
                        <p className="order-date">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date unavailable"}
                        </p>
                      </div>

                      <div className="order-price">
                        Rs. {orderTotal}
                      </div>
                    </div>

                    <div className="order-info-grid">
                      <div className="order-section">
                        <h4>Ordered By</h4>
                        <p>
                          <strong>{getCustomerName(order)}</strong>
                        </p>
                        {order.user?.email || order.customer?.email ? (
                          <p>{order.user?.email || order.customer?.email}</p>
                        ) : null}
                        {order.user?.phone || order.customer?.phone ? (
                          <p>{order.user?.phone || order.customer?.phone}</p>
                        ) : null}
                      </div>

                      <div className="order-section">
                        <h4>Ship To</h4>
                        <div className="shipping-contact">
                          <strong>{getShipToName(order)}</strong>
                          {shipToPhone && <span>Phone: {shipToPhone}</span>}
                          {shipToEmail && <span>Email: {shipToEmail}</span>}
                        </div>
                        {getShippingLine(shippingAddress) && <p>{getShippingLine(shippingAddress)}</p>}
                        <p>
                          {[shippingAddress.city, shippingAddress.state, shippingAddress.pincode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {shippingAddress.country && <p>{shippingAddress.country}</p>}
                      </div>
                    </div>

                    <div className="order-section order-items-section">
                      <h4>Items</h4>

                      {order.items?.map((item) => {
                        const product = item.product || {};
                        const title = product.title || item.title || "Product";
                        const quantity = Number(item.quantity || 1);
                        const unitPrice = Number(product.price ?? item.price ?? item.unitPrice ?? 0);
                        const lineTotal = unitPrice * quantity;

                        return (
                          <div key={item._id || title} className="order-item">
                            <img
                              className="order-item-image"
                              src={getImageUrl(product.image || item.image)}
                              alt={title}
                            />
                            <div className="order-item-details">
                              <strong>{title}</strong>
                              <span>{product.category || product.occasion || "Greeting card"}</span>
                            </div>
                            <div className="order-item-numbers">
                              <span>Qty: {quantity}</span>
                              <strong>Rs. {lineTotal}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="order-footer">
                      <div className="order-badges">
                        <span className="payment-badge">
                          {order.paymentStatus || order.paymentMethod || "COD"}
                        </span>
                        <span className="payment-badge soft">
                          {order.paymentMethod || "Cash on delivery"}
                        </span>
                      </div>

                      <select
                        className={`status-select ${orderStatus}`}
                        value={orderStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                      >
                        {orderStatuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  No orders found
                </div>
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
