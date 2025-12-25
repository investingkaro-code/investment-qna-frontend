import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, BarChart2, CheckCircle } from "lucide-react";
import API_BASE_URL from "../pages/config";
import "./DashboardMetrics.css";

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/reports/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetrics();
  }, []);

  if (!metrics) return <p style={{ color: "#5bc0be" }}>Loading metrics...</p>;

  return (
    <div className="dashboard-metrics-container">
      <div className="dashboard-metrics-card">
        <h3 className="stock-title">Your Reports</h3>
        <div className="metrics-row">
          <div className="metric-box overview">
            <BarChart2 size={28} className="icon" />
            <p className="metric-count">{metrics.totalReports}</p>
            <p className="metric-label">Total Reports</p>
          </div>
          <div className="metric-box metrics">
            <FileText size={28} className="icon" />
            <p className="metric-count">{metrics.totalStocks}</p>
            <p className="metric-label">Total Stocks Analyzed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
