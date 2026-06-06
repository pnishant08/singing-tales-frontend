import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import "../ecommerce.css";

const blankAddress = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

const getAddressId = (address) => address.id || address._id;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(blankAddress);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await api.get("/user/addresses");
        setAddresses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error(err.response?.data?.error || "Could not load addresses");
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveAddress = async () => {
    const required = ["fullName", "phone", "addressLine", "city", "state", "pincode", "country"];
    const missing = required.some((field) => !form[field].trim());

    if (missing) {
      toast.error("Please fill address details");
      return;
    }

    try {
      setSaving(true);
      const res = await api.post("/user/addresses", form);
      setAddresses((current) => [res.data, ...current]);
      setForm(blankAddress);
      toast.success("Address saved");
    } catch (err) {
      toast.error(err.response?.data?.error || "Address save failed");
    } finally {
      setSaving(false);
    }
  };

  const markDefault = async (id) => {
    try {
      const res = await api.patch(`/user/addresses/${id}/default`);
      const updatedAddress = res.data;

      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          isDefault: getAddressId(address) === id,
        }))
      );

      if (updatedAddress) {
        setAddresses((current) =>
          current.map((address) =>
            getAddressId(address) === id ? { ...address, ...updatedAddress } : address
          )
        );
      }

      toast.success("Default address updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Default update failed");
    }
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(`/user/addresses/${id}`);
      setAddresses((current) => current.filter((address) => getAddressId(address) !== id));
      toast.success("Address deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Address delete failed");
    }
  };

  return (
    <section className="commerce-page checkout-layout">
      <div className="checkout-form">
        <p className="eyebrow">Account</p>
        <h1>Saved addresses</h1>
        <div className="form-grid">
          <label>Full name<input name="fullName" value={form.fullName} onChange={handleChange} /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={handleChange} /></label>
          <label>City<input name="city" value={form.city} onChange={handleChange} /></label>
          <label>State<input name="state" value={form.state} onChange={handleChange} /></label>
          <label>Pincode<input name="pincode" value={form.pincode} onChange={handleChange} /></label>
          <label>Country<input name="country" value={form.country} onChange={handleChange} /></label>
        </div>
        <label>Address line<textarea name="addressLine" rows="4" value={form.addressLine} onChange={handleChange} /></label>
        <label className="inline-check">
          <input
            name="isDefault"
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          Set as default address
        </label>
        <button className="btn-primary" onClick={saveAddress} disabled={saving}>
          {saving ? "Saving..." : "Save address"}
        </button>
      </div>

      <aside className="address-list">
        {loading ? (
          <p className="muted">Loading addresses...</p>
        ) : (
          <>
            {addresses.map((address) => {
              const id = getAddressId(address);

              return (
                <article className="address-card" key={id}>
                  <div className="address-title-row">
                    <strong>{address.fullName}</strong>
                    {address.isDefault && <span className="status-pill">Default</span>}
                  </div>
                  <p className="muted">{address.phone}</p>
                  <p>{address.addressLine}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p>{address.country}</p>
                  <div className="button-row">
                    {!address.isDefault && (
                      <button className="btn-secondary compact" type="button" onClick={() => markDefault(id)}>
                        Mark default
                      </button>
                    )}
                    <button className="text-button" type="button" onClick={() => deleteAddress(id)}>
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
            {!addresses.length && <p className="muted">No saved addresses yet.</p>}
          </>
        )}
      </aside>
    </section>
  );
}
