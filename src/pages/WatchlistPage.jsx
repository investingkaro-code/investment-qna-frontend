import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNav from "../components/TopNav";
import API_BASE_URL from "./config";
import { TrendingUp, Heart } from "lucide-react";
import API from "../api/api";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`${API_BASE_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Watchlist data:", res.data);
        setWatchlist(res.data || []);
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (symbol) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API_BASE_URL}/favorites/${symbol}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // update UI instantly
    setWatchlist((prev) =>
      prev.filter((item) => item.stockSymbol !== symbol)
    );
  } catch (err) {
    console.error("Failed to remove from watchlist", err);
  }
};



  return (
    <div className="page-bg">
      <TopNav title="Watchlist" />

      {loading ? (
        <div className="text-center mt-5">
          <p className="text-white-50">Loading watchlist...</p>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="container text-center mt-5">
          <p className="text-white-50">
            No stocks added to watchlist
          </p>
          <p className="text-accent">
            You can add stocks from the Stock List page
          </p>
        </div>
      ) : (
        <div className="container mt-4">
          <div className="row g-4">
            {watchlist.map((item, index) => (
              <div
                key={item.stockSymbol}
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              >
                <div
                  className="stock-card p-4 rounded-4 h-100 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="icon-bg">
                      <TrendingUp size={26} className="text-accent" />
                    </div>
                    <Heart
                        size={20}
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => removeFromWatchlist(item.stockSymbol)}
                      />
                  </div>

                  <div className="mt-4">
                    <h5 className="fw-bold text-white">
                      {item.stockName}
                    </h5>
                    <span className="badge bg-accent-soft text-accent mt-2">
                      {item.stockSymbol}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
