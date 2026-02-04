import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TrendingUp, Heart } from "lucide-react"; 
import API_BASE_URL from "./config";
import "./StockList.css";
import TopNav from "../components/TopNav";

const StockListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const PAGE_SIZE = 20;

  /* ---------------- SEARCH DEBOUNCE ---------------- */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  /* ---------------- FETCH STOCKS ---------------- */
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/stocks?page=${page}&size=${PAGE_SIZE}&search=${debouncedSearch}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStocks(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [page, debouncedSearch, categoryId]);

  /* ---------------- FETCH FAVORITES ---------------- */
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favSet = new Set(
          (res.data || []).map((f) => f.stockSymbol)
        );
        setFavorites(favSet);
      } catch (e) {
        console.error("Failed to fetch favorites", e);
      }
    };

    fetchFavorites();
  }, []);

  /* ---------------- TOGGLE FAVORITE ---------------- */
  const toggleFavorite = async (e, stock) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    const isFav = favorites.has(stock.symbol);

    try {
      if (isFav) {
        await axios.delete(
          `${API_BASE_URL}/favorites/${stock.symbol}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFavorites((prev) => {
          const copy = new Set(prev);
          copy.delete(stock.symbol);
          return copy;
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/favorites`,
          {
            stockSymbol: stock.symbol,
            stockName: stock.name,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFavorites((prev) => new Set(prev).add(stock.symbol));
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <div className="categories-container">
      <TopNav title="Investment Report" />

      <div className="text-center mb-4">
        <h1 className="text-accent fw-bold display-6">Stocks</h1>
        <p className="text-white-50">Select a stock to continue</p>

        <div className="search-container mt-3">
          <input
            type="text"
            placeholder="Search stocks by name or symbol..."
            className="form-control search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-accent" />
          <p className="text-light mt-3">Loading stocks...</p>
        </div>
      ) : (
        <div className="container">
          <div className="row g-4">
            {stocks.map((stock, index) => (
              <div
                key={stock.symbol || index}
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                onClick={() =>
                  navigate(`/answer/${categoryId}`, {
                    state: { stockSymbol: stock.symbol },
                  })
                }
              >
                <div className="stock-card p-4 rounded-4 h-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="icon-bg">
                      <TrendingUp size={26} className="text-accent" />
                    </div>

                    <Heart
                      size={20}
                      onClick={(e) => toggleFavorite(e, stock)}
                      className={
                        favorites.has(stock.symbol)
                          ? "text-danger"
                          : "text-light opacity-50"
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </div>

                  <div className="mt-4">
                    <h5 className="fw-bold text-white">{stock.name}</h5>
                    <span className="badge bg-accent-soft text-accent mt-2">
                      {stock.symbol}
                    </span>
                  </div>

                  <div className="mt-auto text-end">
                    <span className="text-accent small fw-semibold">
                      View Subcategories →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stocks.length === 0 && (
            <p className="text-center text-secondary mt-5">
              No stocks found for "{debouncedSearch}"
            </p>
          )}

          {totalPages > 1 && (
            <div className="pagination-container mt-5">
              <button onClick={handlePrev} disabled={page === 0}>
                ← Prev
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page + 1 === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockListPage;
