import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#333", color: "white" }}>
      <Link to="/products" style={{ marginRight: 20, color: "white" }}>Products</Link>
      <Link to="/suppliers" style={{ marginRight: 20, color: "white" }}>Suppliers</Link>
      <Link to="/sales" style={{ marginRight: 20, color: "white" }}>Sales</Link>
      <Link to="/purchases" style={{ marginRight: 20, color: "white" }}>Purchases</Link>
      <Link to="/analytics" style={{ color: "white" }}>Analytics</Link>
      

    </nav>
  );
}
