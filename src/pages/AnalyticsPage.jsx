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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Title);

const espresso = "rgba(75, 46, 5, 0.85)";
const caramel = "rgba(196, 154, 108, 0.75)";
const cream = "rgba(243, 233, 220, 0.9)";
const bean = "rgba(139, 90, 43, 0.85)";
const createOptions = (overrides = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#4b2e05",
        font: { family: "Poppins", size: 13 }
      },
      ...overrides?.plugins?.legend,
    },
    title: {
      display: false,
      color: "#2e1503",
      font: { family: "Poppins", weight: "600", size: 16 },
      ...overrides?.plugins?.title,
    },
    tooltip: {
      backgroundColor: "rgba(46, 21, 3, 0.9)",
      titleFont: { family: "Poppins", size: 13 },
      bodyFont: { family: "Poppins", size: 12 },
    },
    ...overrides?.plugins,
  },
  scales: {
    x: {
      ticks: { color: "#4b2e05", font: { family: "Poppins" } },
      grid: { color: "rgba(75, 46, 5, 0.08)" },
      ...overrides?.scales?.x,
    },
    y: {
      ticks: { color: "#4b2e05", font: { family: "Poppins" } },
      grid: { color: "rgba(75, 46, 5, 0.05)" },
      ...overrides?.scales?.y,
    },
    ...overrides?.scales,
  },
});

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

  const totalMonthlySales = monthlySales.reduce((sum, m) => sum + (m.total || 0), 0);
  const totalDailySales = dailySales.reduce((sum, d) => sum + (d.dailyTotal || 0), 0);
  const averageDailySales = dailySales.length ? totalDailySales / dailySales.length : 0;
  const topProductName = topProducts.length ? (topProducts[0]._id || "Top Seller") : "Awaiting data";

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const topProductsData = {
    labels: topProducts.map(p => p._id || "Unknown"),
    datasets: [
      {
        label: "Units Sold",
        data: topProducts.map(p => p.totalSold),
        backgroundColor: caramel,
        borderColor: espresso,
        borderWidth: 1,
        hoverBackgroundColor: bean,
      },
    ],
  };

  const monthlySalesData = {
    labels: monthlySales.map(m => `${m._id.month}/${m._id.year}`),
    datasets: [
      {
        label: "Monthly Sales (LKR)",
        data: monthlySales.map(m => m.total),
        borderColor: espresso,
        backgroundColor: "rgba(75, 46, 5, 0.25)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: caramel,
      },
    ],
  };

  const supplierContributionData = {
    labels: supplierContribution.map(s => s._id || "Unknown"),
    datasets: [
      {
        label: "Total Supplied (Units)",
        data: supplierContribution.map(s => s.totalSupplied),
        backgroundColor: bean,
        borderColor: espresso,
        borderWidth: 1,
        hoverBackgroundColor: caramel,
      },
    ],
  };

  const dailySalesData = {
    labels: dailySales.map(d => `${d._id.day}/${d._id.month}`),
    datasets: [
      {
        label: "Daily Total (LKR)",
        data: dailySales.map(d => d.dailyTotal),
        borderColor: bean,
        backgroundColor: "rgba(196, 154, 108, 0.25)",
        tension: 0.25,
        pointBackgroundColor: espresso,
      },
    ],
  };

  return (
    <div className="page-container">
      <section className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Warm insights brewed fresh — follow the pulse of Island Brew Lanka operations.</p>
        {/* Coffee analytics hero illustration placeholder */}
      </section>

      {loading && <p className="status-message loading">Brewing analytics data...</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">Monthly Sales</span>
              <strong className="summary-value">LKR {formatCurrency(totalMonthlySales)}</strong>
              <small>Across {monthlySales.length} months of records</small>
            </div>
            <div className="summary-card">
              <span className="summary-label">Top Product</span>
              <strong className="summary-value">{topProductName}</strong>
              <small>{topProducts.length ? `${topProducts[0].totalSold} units sold` : "Awaiting sales data"}</small>
            </div>
            <div className="summary-card">
              <span className="summary-label">Low Stock Alerts</span>
              <strong className="summary-value">{lowStock.length}</strong>
              <small>Products requiring replenishment</small>
            </div>
            <div className="summary-card">
              <span className="summary-label">Avg Daily Sales</span>
              <strong className="summary-value">LKR {formatCurrency(averageDailySales)}</strong>
              <small>Based on {dailySales.length} daily entries</small>
            </div>
          </div>

          <div className="content-grid">
            <section className="card chart-card">
              <h3>Top Products</h3>
              <p>Spot the blends that customers reach for first.</p>
              {topProducts.length > 0 ? (
                <div style={{ minHeight: 320 }}>
                  <Bar data={topProductsData} options={createOptions({ plugins: { legend: { display: false } } })} />
                </div>
              ) : (
                <p>No top product data available.</p>
              )}
            </section>

            <section className="card chart-card">
              <h3>Monthly Sales Trend</h3>
              <p>Track performance over time to plan promotions and roasts.</p>
              {monthlySales.length > 0 ? (
                <div style={{ minHeight: 320 }}>
                  <Line data={monthlySalesData} options={createOptions()} />
                </div>
              ) : (
                <p>No monthly sales data available.</p>
              )}
            </section>
          </div>

          <div className="content-grid">
            <section className="card">
              <h3>Low Stock Watchlist</h3>
              <p>Keep shelves stocked — replenish before the morning rush.</p>
              {lowStock.length > 0 ? (
                <ul style={{ paddingLeft: "1.2rem", margin: 0, display: "grid", gap: "0.75rem" }}>
                  {lowStock.map(p => (
                    <li key={p._id} style={{ listStyle: "none", background: cream, borderRadius: "12px", padding: "0.8rem 1rem", boxShadow: "0 8px 18px rgba(46, 21, 3, 0.12)" }}>
                      <strong>{p.name}</strong> – {p.quantity} remaining
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No low-stock items found.</p>
              )}
              <div className="image-placeholder">{"// Coffee storage shelf placeholder"}</div>
            </section>

            <section className="card chart-card">
              <h3>Supplier Contribution</h3>
              <p>Celebrate partners by understanding their impact.</p>
              {supplierContribution.length > 0 ? (
                <div style={{ minHeight: 320 }}>
                  <Bar data={supplierContributionData} options={createOptions()} />
                </div>
              ) : (
                <p>No supplier contribution data available.</p>
              )}
            </section>

            <section className="card chart-card" style={{ gridColumn: "1 / -1" }}>
              <h3>Daily Sales Summary</h3>
              <p>Observe daily rhythms to staff and stock strategically.</p>
              {dailySales.length > 0 ? (
                <div style={{ minHeight: 320 }}>
                  <Line data={dailySalesData} options={createOptions()} />
                </div>
              ) : (
                <p>No daily sales data available.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
