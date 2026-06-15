import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import api from "../../services/api";
import { readSavedAddresses } from "../../services/addressStorage";
import "../ecommerce.css";

const getAddressId = (address) => address.id || address._id;
const getAddressLine = (address) => address.addressLine || address.address || "";

export default function CheckoutPage() {
  const { items, totals, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [savedAddresses, setSavedAddresses] = useState(() => readSavedAddresses());
  const defaultAddress = savedAddresses.find((address) => address.isDefault);
  const [customer, setCustomer] = useState({
    fullName: defaultAddress?.fullName || user?.name || "",
    phone: defaultAddress?.phone || user?.phone || "",
    email: user?.email || "",
    addressLine: defaultAddress ? getAddressLine(defaultAddress) : "",
    city: defaultAddress?.city || "",
    state: defaultAddress?.state || "",
    pincode: defaultAddress?.pincode || "",
    country: defaultAddress?.country || "India",
  });

  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (!user) {
        setSavedAddresses(readSavedAddresses());
        return;
      }

      try {
        const res = await api.get("/user/addresses");
        const addresses = Array.isArray(res.data) ? res.data : [];
        const preferredAddress = addresses.find((address) => address.isDefault);

        setSavedAddresses(addresses);
        setCustomer((current) => {
          const next = { ...current };

          if (!next.fullName && user?.name) next.fullName = user.name;
          if (!next.phone && user?.phone) next.phone = user.phone;
          if (!next.email && user?.email) next.email = user.email;

          if (preferredAddress && !next.addressLine && !next.city && !next.state && !next.pincode) {
            next.fullName = preferredAddress.fullName || next.fullName;
            next.phone = preferredAddress.phone || next.phone;
            next.addressLine = getAddressLine(preferredAddress);
            next.city = preferredAddress.city || "";
            next.state = preferredAddress.state || "";
            next.pincode = preferredAddress.pincode || "";
            next.country = preferredAddress.country || "India";
          }

          return next;
        });
      } catch (err) {
        console.log(err);
        setSavedAddresses([]);
      }
    };

    loadSavedAddresses();
  }, [user]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const applySavedAddress = (addressId) => {
    const address = savedAddresses.find((item) => String(getAddressId(item)) === addressId);
    if (!address) return;

    setCustomer((current) => ({
      ...current,
      fullName: address.fullName,
      phone: address.phone,
      addressLine: getAddressLine(address),
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    }));
  };

  const submitOrder = async () => {
    if (!user) {
      toast.error("Please login to place your order");
      navigate("/login", {
        state: {
          backgroundLocation: location,
          returnTo: "/checkout",
        },
      });
      return;
    }

    const required = [
      "fullName",
      "phone",
      "email",
      "addressLine",
      "city",
      "state",
      "pincode",
      "country",
    ];
    const missing = required.some((field) => {
      const value = customer[field];
      return !String(value || "").trim();
    });
    if (missing) {
      toast.error("Please fill all delivery details");
      return;
    }

    try {
      const backendOrder = await placeOrder({
        shippingAddress: {
          fullName: customer.fullName,
          fullname: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          address: customer.addressLine,
          addressLine: customer.addressLine,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          country: customer.country,
        },
        paymentMethod: "COD",
      });
      const orderId = backendOrder?.id || backendOrder?._id;

      if (!orderId) {
        toast.error("Order response is missing an order ID");
        return;
      }


      toast.success("Order placed");
      navigate(`/order-success?order=${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Order could not be placed");
    }
  };

  if (!items.length) {
    return (
      <section className="commerce-page empty-state">
        <h1>No items to checkout</h1>
        <Link to="/shop" className="btn-primary link-button">Continue shopping</Link>
      </section>
    );
  }

  return (
    <section className="commerce-page checkout-layout">
      <div className="checkout-form">
        <p className="eyebrow">Checkout</p>
        <h1>Delivery details</h1>
        {!user && (
          <div className="login-required">
            <strong>Login required</strong>
            <span>You can fill details now, but you must login before placing the order.</span>
          </div>
        )}

        {savedAddresses.length > 0 && (
          <label>
            Use saved address
            <select defaultValue="" onChange={(e) => applySavedAddress(e.target.value)}>
              <option value="">Choose an address</option>
              {savedAddresses.map((address) => (
                <option key={getAddressId(address)} value={getAddressId(address)}>
                  {address.isDefault ? "Default - " : ""}{address.fullName}, {address.city}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="form-grid">
          <label>Full name<input name="fullName" value={customer.fullName} onChange={handleChange} /></label>
          <label>Phone<input name="phone" value={customer.phone} onChange={handleChange} /></label>
          <label>Email<input name="email" type="email" value={customer.email} onChange={handleChange} /></label>
          <label>City<input name="city" value={customer.city} onChange={handleChange} /></label>
          <label>State<input name="state" value={customer.state} onChange={handleChange} /></label>
          <label>Pincode<input name="pincode" value={customer.pincode} onChange={handleChange} /></label>
          <label>Country<input name="country" value={customer.country} onChange={handleChange} /></label>
        </div>
        <label>Address line<textarea name="addressLine" rows="4" value={customer.addressLine} onChange={handleChange} /></label>
        <button className="btn-primary" onClick={submitOrder}>
          {user ? "Place order" : "Login to place order"}
        </button>
      </div>

      <aside className="summary-box">
        <h2>Payment summary</h2>
        {items.map((item) => (
          <p key={item._id}>
            <span>{item.product?.title} x {item.quantity}</span>
            <strong>
              Rs. {(item.product?.price || 0) * item.quantity}
            </strong>
          </p>
        ))}
        <hr />
        <p className="summary-total"><span>Total</span><strong>Rs. {totals.total}</strong></p>
        <small>Your order details are prepared from the checkout form.</small>
      </aside>
    </section>
  );
}
