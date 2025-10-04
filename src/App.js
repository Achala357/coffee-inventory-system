import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import SalesPage from "./pages/SalesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import "./index.css"; // optional for nav bar styling
import PurchasesPage from "./pages/PurchasesPage";


function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
