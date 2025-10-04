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

  // ✅ Create or Update supplier
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

  // ✅ Edit supplier
  const handleEdit = (supplier) => {
    setForm({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      address: supplier.address,
    });
    setEditId(supplier._id);
  };

  // ✅ Delete supplier
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
    <div style={{ padding: "1rem" }}>
      <h2>Suppliers</h2>

      {/* Supplier Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Name"
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
        <button type="submit">{editId ? "Update Supplier" : "Add Supplier"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", contact: "", phone: "", address: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Loading / Error */}
      {loading && <p>Loading suppliers...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Supplier Table */}
      {!loading && !error && (
        <table border="1" cellPadding="5" style={{ marginTop: "1rem", width: "100%", borderCollapse: "collapse" }}>
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
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No suppliers available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
