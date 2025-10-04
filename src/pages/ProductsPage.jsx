import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", quantity: "", unit: "", price_per_unit: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products on load
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

  // Create or Update product
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

  // Edit selected product
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

  // Delete product
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
    <div style={{ padding: "1rem" }}>
      <h2>Products</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Type"
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
          placeholder="Unit"
          value={form.unit}
          onChange={e => setForm({ ...form, unit: e.target.value })}
          required
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price_per_unit}
          onChange={e => setForm({ ...form, price_per_unit: e.target.value })}
          required
        />
        <button type="submit">{editId ? "Update Product" : "Add Product"}</button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ name: "", type: "", quantity: "", unit: "", price_per_unit: "" }); }}>
            Cancel
          </button>
        )}
      </form>

      {/* Status Messages */}
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No products available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
