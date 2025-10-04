import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ total: "", payment_method: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError("Failed to load sales. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/sales/${editId}`, form);
      } else {
        await API.post("/sales", { ...form, date: new Date() });
      }
      fetchSales();
      setForm({ total: "", payment_method: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving sale:", err);
      setError("Could not save sale.");
    }
  };

  const handleEdit = (sale) => {
    setForm({
      total: sale.total,
      payment_method: sale.payment_method,
    });
    setEditId(sale._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale record?")) return;
    try {
      await API.delete(`/sales/${id}`);
      fetchSales();
    } catch (err) {
      console.error("Error deleting sale:", err);
      setError("Could not delete sale.");
    }
  };

  return (
    <div className="page-container">
      <section className="page-header">
        <h2>Sales</h2>
        <p>Brewed moments captured in every transaction across Island Brew Lanka cafés.</p>
        {/* Coffee steam animation placeholder */}
      </section>

      <div className="content-grid">
        <section className="card">
          <h3>{editId ? "Update Sale" : "Record a Sale"}</h3>
          <p>Log each sip served to keep our ledgers as warm as our mugs.</p>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              placeholder="Total Amount"
              type="number"
              value={form.total}
              onChange={(e) => setForm({ ...form, total: e.target.value })}
              required
            />
            <input
              placeholder="Payment Method"
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              required
            />
            <div className="form-actions">
              <button type="submit" className="coffee-btn">
                {editId ? "Save Sale" : "Record Sale"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="coffee-btn secondary"
                  onClick={() => {
                    setEditId(null);
                    setForm({ total: "", payment_method: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="image-placeholder">{"// Coffee receipt illustration placeholder"}</div>
        </section>

        <section className="card">
          <h3>Recent Sales</h3>
          <p>Monitor daily sales activity and keep the brew counter thriving.</p>

          {loading && <p className="status-message loading">Loading sales...</p>}
          {error && <p className="status-message error">{error}</p>}

          {!loading && !error && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length > 0 ? (
                    sales.map((s) => (
                      <tr key={s._id}>
                        <td>{new Date(s.date).toLocaleDateString()}</td>
                        <td>{s.total}</td>
                        <td>{s.payment_method}</td>
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
                      <td colSpan="4" style={{ textAlign: "center", padding: "1.5rem" }}>
                        No sales recorded
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
