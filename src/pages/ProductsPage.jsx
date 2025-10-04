import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", quantity: "", unit: "", price_per_unit: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/products/${editId}`, form);
      } else {
        await API.post("/products", form);
      }
      fetchProducts();
      setForm({ name: "", type: "", quantity: "", unit: "", price_per_unit: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Could not save product.");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      type: product.type,
      quantity: product.quantity,
      unit: product.unit,
      price_per_unit: product.price_per_unit,
    });
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Could not delete product.");
    }
  };

  return (
    <div className="page-container">
      <section className="page-header">
        <h2>Products</h2>
        <p>Craft, roast, and monitor every blend stocked in your Island Brew Lanka shelves.</p>
        {/* Coffee cup illustration area */}
      </section>

      <div className="content-grid">
        <section className="card">
          <h3>{editId ? "Update Product" : "Add a New Roast"}</h3>
          <p>Capture the aroma of every bag with precise details and pricing.</p>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              placeholder="Coffee Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Roast Type"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
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
              placeholder="Unit (e.g. kg, bags)"
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
              required
            />
            <input
              placeholder="Price per Unit"
              type="number"
              value={form.price_per_unit}
              onChange={e => setForm({ ...form, price_per_unit: e.target.value })}
              required
            />
            <div className="form-actions">
              <button type="submit" className="coffee-btn">
                {editId ? "Save Product" : "Add Product"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="coffee-btn secondary"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", type: "", quantity: "", unit: "", price_per_unit: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="image-placeholder">{"// Coffee beans image placeholder"}</div>
        </section>

        <section className="card">
          <h3>Existing Products</h3>
          <p>Review the curated selection ready to brew.</p>

          {loading && <p className="status-message loading">Loading products...</p>}
          {error && <p className="status-message error">{error}</p>}

          {!loading && !error && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p) => (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>{p.type}</td>
                        <td>{p.quantity}</td>
                        <td>{p.unit}</td>
                        <td>{p.price_per_unit}</td>
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
                        No products available
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
