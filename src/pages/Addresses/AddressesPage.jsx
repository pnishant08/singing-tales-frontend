import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../ecommerce.css";

const STORAGE_KEY = "singing_tales_addresses";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveAddress = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill address details");
      return;
    }

    setAddresses((current) => [{ id: Date.now(), ...form }, ...current]);
    setForm({ label: "Home", name: "", phone: "", address: "" });
    toast.success("Address saved");
  };

  return (
    <section className="commerce-page checkout-layout">
      <div className="checkout-form">
        <p className="eyebrow">Account</p>
        <h1>Saved addresses</h1>
        <div className="form-grid">
          <label>Label<input name="label" value={form.label} onChange={handleChange} /></label>
          <label>Name<input name="name" value={form.name} onChange={handleChange} /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={handleChange} /></label>
        </div>
        <label>Address<textarea name="address" rows="4" value={form.address} onChange={handleChange} /></label>
        <button className="btn-primary" onClick={saveAddress}>Save address</button>
      </div>

      <aside className="address-list">
        {addresses.map((address) => (
          <article className="address-card" key={address.id}>
            <strong>{address.label}</strong>
            <p>{address.name}</p>
            <p className="muted">{address.phone}</p>
            <p>{address.address}</p>
          </article>
        ))}
        {!addresses.length && <p className="muted">No saved addresses yet.</p>}
      </aside>
    </section>
  );
}
