import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import SalesPage from "./pages/SalesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import "./index.css";
import PurchasesPage from "./pages/PurchasesPage";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <div className="texture-overlay" aria-hidden="true">
          {/* subtle coffee grain background */}
        </div>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
          </Routes>
        </main>
        <footer>© 2025 Island Brew Lanka — Coffee Inventory System</footer>
      </div>
    </Router>
  );
}

export default App;
