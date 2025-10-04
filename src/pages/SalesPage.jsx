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

  // ✅ Create or Update sale
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

  // ✅ Edit sale
  const handleEdit = (sale) => {
    setForm({
      total: sale.total,
      payment_method: sale.payment_method,
    });
    setEditId(sale._id);
  };

  // ✅ Delete sale
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
    <div style={{ padding: "1rem" }}>
      <h2>Sales</h2>

      {/* Sale form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
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
        <button type="submit">{editId ? "Update Sale" : "Record Sale"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ total: "", payment_method: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Loading / Error */}
      {loading && <p>Loading sales...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Sales Table */}
      {!loading && !error && (
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No sales recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
