import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", contact: "", phone: "", address: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/suppliers/${editId}`, form);
      } else {
        await API.post("/suppliers", form);
      }
      fetchSuppliers();
      setForm({ name: "", contact: "", phone: "", address: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving supplier:", err);
      setError("Could not save supplier.");
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      address: supplier.address,
    });
    setEditId(supplier._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await API.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setError("Could not delete supplier.");
    }
  };

  return (
    <div className="page-container">
      <section className="page-header">
        <h2>Suppliers</h2>
        <p>Celebrate every partner who keeps our beans flowing from plantations to island cups.</p>
        {/* Coffee beans delivery illustration placeholder */}
      </section>

      <div className="content-grid">
        <section className="card">
          <h3>{editId ? "Update Supplier" : "Add Supplier"}</h3>
          <p>Maintain warm relationships with trusted growers and distributors.</p>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              placeholder="Supplier Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Contact Email"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              required
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <div className="form-actions">
              <button type="submit" className="coffee-btn">
                {editId ? "Save Supplier" : "Add Supplier"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="coffee-btn secondary"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", contact: "", phone: "", address: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="image-placeholder">{"// Coffee sourcing map placeholder"}</div>
        </section>

        <section className="card">
          <h3>Supplier Roster</h3>
          <p>Track the artisans and partners fueling Island Brew Lanka.</p>

          {loading && <p className="status-message loading">Loading suppliers...</p>}
          {error && <p className="status-message error">{error}</p>}

          {!loading && !error && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length > 0 ? (
                    suppliers.map((s) => (
                      <tr key={s._id}>
                        <td>{s.name}</td>
                        <td>{s.contact}</td>
                        <td>{s.phone}</td>
                        <td>{s.address}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="action-btn" onClick={() => handleEdit(s)}>
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn delete"
                              onClick={() => handleDelete(s._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "1.5rem" }}>
                        No suppliers available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
