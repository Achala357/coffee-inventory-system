import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ supplier: "", product: "", quantity: "", unit_price: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/purchases");
      setPurchases(res.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("Failed to load purchases. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/purchases/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/purchases", form);
      }
      fetchPurchases();
      setForm({ supplier: "", product: "", quantity: "", unit_price: "" });
    } catch (err) {
      console.error("Error saving purchase:", err);
      setError("Could not save purchase.");
    }
  };

  const handleEdit = (purchase) => {
    setForm({
      supplier: purchase.supplier,
      product: purchase.product,
      quantity: purchase.quantity,
      unit_price: purchase.unit_price,
    });
    setEditingId(purchase._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;
    try {
      await API.delete(`/purchases/${id}`);
      fetchPurchases();
    } catch (err) {
      console.error("Error deleting purchase:", err);
      setError("Could not delete purchase.");
    }
  };

  return (
    <div className="page-container">
      <section className="page-header">
        <h2>Purchases</h2>
        <p>Trace every shipment that keeps our roastery brimming with beans.</p>
        {/* Coffee delivery truck placeholder */}
      </section>

      <div className="content-grid">
        <section className="card">
          <h3>{editingId ? "Update Purchase" : "Log a Purchase"}</h3>
          <p>Record fresh arrivals from plantations and partners.</p>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              placeholder="Supplier"
              value={form.supplier}
              onChange={e => setForm({ ...form, supplier: e.target.value })}
              required
            />
            <input
              placeholder="Product"
              value={form.product}
              onChange={e => setForm({ ...form, product: e.target.value })}
              required
            />
            <input
              placeholder="Quantity"
              type="number"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              required
            />
            <input
              placeholder="Unit Price"
              type="number"
              value={form.unit_price}
              onChange={e => setForm({ ...form, unit_price: e.target.value })}
              required
            />
            <div className="form-actions">
              <button type="submit" className="coffee-btn">
                {editingId ? "Save Purchase" : "Add Purchase"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="coffee-btn secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ supplier: "", product: "", quantity: "", unit_price: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="image-placeholder">{"// Coffee warehouse scene placeholder"}</div>
        </section>

        <section className="card">
          <h3>Purchase History</h3>
          <p>Ensure supply lines remain steady and sweet.</p>

          {loading && <p className="status-message loading">Loading purchases...</p>}
          {error && <p className="status-message error">{error}</p>}

          {!loading && !error && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length > 0 ? (
                    purchases.map(p => (
                      <tr key={p._id}>
                        <td>{p.supplier}</td>
                        <td>{p.product}</td>
                        <td>{p.quantity}</td>
                        <td>{p.unit_price}</td>
                        <td>{new Date(p.date).toLocaleDateString()}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="action-btn" onClick={() => handleEdit(p)}>
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn delete"
                              onClick={() => handleDelete(p._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "1.5rem" }}>
                        No purchases recorded
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
