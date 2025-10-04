import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

// ✅ Register components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Title);

export default function AnalyticsPage() {
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [supplierContribution, setSupplierContribution] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        topRes,
        monthlyRes,
        stockRes,
        supplierRes,
        dailyRes
      ] = await Promise.all([
        API.get("/analytics/top-products"),
        API.get("/analytics/monthly-sales"),
        API.get("/analytics/low-stock"),
        API.get("/analytics/supplier-contribution"),
        API.get("/analytics/daily-sales"),
      ]);

      setTopProducts(topRes.data);
      setMonthlySales(monthlyRes.data);
      setLowStock(stockRes.data);
      setSupplierContribution(supplierRes.data);
      setDailySales(dailyRes.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // === Chart.js Datasets ===

  // 1️⃣ Top Products
  const topProductsData = {
    labels: topProducts.map(p => p._id || "Unknown"),
    datasets: [
      {
        label: "Units Sold",
        data: topProducts.map(p => p.totalSold),
        backgroundColor: "rgba(100, 149, 237, 0.6)", // cornflower blue
        borderColor: "rgba(100, 149, 237, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 2️⃣ Monthly Sales
  const monthlySalesData = {
    labels: monthlySales.map(m => `${m._id.month}/${m._id.year}`),
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: monthlySales.map(m => m.total),
        borderColor: "rgba(60, 179, 113, 1)", // medium sea green
        backgroundColor: "rgba(60, 179, 113, 0.3)",
        fill: true,
        tension: 0.2,
      },
    ],
  };

  // 4️⃣ Supplier Contribution
  const supplierContributionData = {
    labels: supplierContribution.map(s => s._id || "Unknown"),
    datasets: [
      {
        label: "Total Supplied (Units)",
        data: supplierContribution.map(s => s.totalSupplied),
        backgroundColor: "rgba(218, 165, 32, 0.6)", // goldenrod
        borderColor: "rgba(218, 165, 32, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 5️⃣ Daily Sales Summary
  const dailySalesData = {
    labels: dailySales.map(d => `${d._id.day}/${d._id.month}`),
    datasets: [
      {
        label: "Daily Total ($)",
        data: dailySales.map(d => d.dailyTotal),
        borderColor: "rgba(199, 21, 133, 1)", // medium violet red
        backgroundColor: "rgba(199, 21, 133, 0.3)",
        tension: 0.2,
      },
    ],
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Analytics Dashboard</h2>

      {loading && <p>Loading analytics...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {/* 1️⃣ Top Products */}
          <h3>Top Products</h3>
          {topProducts.length > 0 ? (
            <div style={{ width: "600px", marginBottom: "2rem" }}>
              <Bar data={topProductsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          ) : (
            <p>No top product data available.</p>
          )}

          {/* 2️⃣ Monthly Sales */}
          <h3>Monthly Sales</h3>
          {monthlySales.length > 0 ? (
            <div style={{ width: "600px", marginBottom: "2rem" }}>
              <Line data={monthlySalesData} options={{ responsive: true }} />
            </div>
          ) : (
            <p>No monthly sales data available.</p>
          )}

          {/* 3️⃣ Low Stock */}
          <h3>Low Stock</h3>
          {lowStock.length > 0 ? (
            <ul>
              {lowStock.map(p => (
                <li key={p._id}>{p.name} – {p.quantity} left</li>
              ))}
            </ul>
          ) : (
            <p>No low-stock items found.</p>
          )}

          {/* 4️⃣ Supplier Contribution */}
          <h3>Supplier Contribution</h3>
          {supplierContribution.length > 0 ? (
            <div style={{ width: "600px", marginBottom: "2rem" }}>
              <Bar data={supplierContributionData} options={{ responsive: true }} />
            </div>
          ) : (
            <p>No supplier contribution data available.</p>
          )}

          {/* 5️⃣ Daily Sales Summary */}
          <h3>Daily Sales Summary</h3>
          {dailySales.length > 0 ? (
            <div style={{ width: "600px", marginBottom: "2rem" }}>
              <Line data={dailySalesData} options={{ responsive: true }} />
            </div>
          ) : (
            <p>No daily sales data available.</p>
          )}
        </>
      )}
    </div>
  );
}
