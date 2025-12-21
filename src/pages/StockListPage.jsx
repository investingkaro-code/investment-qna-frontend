import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TrendingUp, Layers } from "lucide-react";
import API_BASE_URL from "./config";
import "./StockList.css";
import TopNav from "../components/TopNav";

const StockListPage = () => {
  const { categoryId } = useParams();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();
  const PAGE_SIZE = 20;

  // 🔹 Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // only update after typing stops
      setPage(0); // reset page on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // 🔹 Fetch stocks whenever page or debouncedSearch changes
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

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <div className="categories-container">
      <TopNav
        title="Investment Report"
      />
      <div className="text-center mb-4 animate-fadeIn">
        
        <h1 className="text-accent fw-bold display-6">Stocks</h1>
        <p className="text-white-50">Select a stock to continue</p>

        {/* 🔹 Search Input */}
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
                // onClick={() => navigate(`/category/${categoryId}`)}
                onClick={() => navigate(`/answer/${categoryId}`, {state: { stockSymbol: stock.symbol }})}
              >
                <div
                  className="stock-card p-4 rounded-4 h-100 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="icon-bg">
                      <TrendingUp size={26} className="text-accent" />
                    </div>
                    <Layers size={18} className="text-light opacity-50" />
                  </div>

                  <div className="mt-4">
                    <h5 className="fw-bold text-white">{stock.name}</h5>
                    <span className="badge bg-accent-soft text-accent mt-2">
                      {stock.symbol}
                    </span>
                  </div>

                  <div className="mt-auto text-end">
                    <span className="text-accent small fw-semibold view-link">
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

          {/* Pagination Controls */}
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

      <img
        src="https://cdn3d.iconscout.com/3d/premium/thumb/stock-market-analysis-5145478-4291692.png"
        alt="stocks bg"
        className="floating-bg-img"
      />
    </div>
  );
};

export default StockListPage;
