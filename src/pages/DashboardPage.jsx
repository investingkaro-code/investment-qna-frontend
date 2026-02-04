import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle, FileText } from "lucide-react";
import "./DashboardPage.css";
import TopNav from "../components/TopNav";
import DashboardMetrics from "../components/DashboardMetrics.jsx";
import API_BASE_URL from "./config";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data || []);
      } catch (e) {
        setWatchlist([]);
      }
    };

    fetchWatchlist();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="container">
        <TopNav title="" />

        <h1 className="dashboard-title">Welcome 👋</h1>
        <p className="dashboard-subtitle">
          Start a new stock analysis or review your research
        </p>

        {/* ACTION CARDS */}
        <div className="dashboard-actions">
          <div
            className="dashboard-card"
            onClick={() => navigate("/categories")}
          >
            <PlusCircle size={36} className="text-accent mb-3" />
            <h3>Start New Analysis</h3>
            <p>Select category → stock → answer questions</p>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/report")}
          >
            <FileText size={36} className="text-accent mb-3" />
            <h3>View Reports</h3>
            <p>See your completed investment research</p>
          </div>
        </div>

        {/* WATCHLIST SECTION */}
        <div className="dashboard-section mt-5">
          <h3 className="text-white fw-bold mb-3">Watchlist</h3>

          {watchlist.length === 0 ? (
            // EMPTY STATE
            <div
              className="dashboard-card text-center"
              onClick={() => navigate("/watchlist")}
              style={{ cursor: "pointer" }}
            >
              <p className="text-white-50 mb-2">
                No stocks added to watchlist
              </p>
              <p className="text-accent small mb-0">
                You can add stocks from the Stock List page
              </p>
            </div>
          ) : (
            // PREVIEW STATE
            <div
              className="dashboard-card"
              onClick={() => navigate("/watchlist")}
              style={{ cursor: "pointer" }}
            >
              {watchlist.slice(0, 3).map((item) => (
                <div key={item.stockSymbol} className="mb-2">
                  <strong className="text-white">{item.stockName}</strong>
                  <span className="text-white-50 ms-2">
                    ({item.stockSymbol})
                  </span>
                </div>
              ))}

              <p className="text-accent small mt-2 mb-0">
                View full watchlist →
              </p>
            </div>
          )}
        </div>

        <DashboardMetrics />
      </div>
    </div>
  );
};

export default DashboardPage;
