import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Folder, Layers, FileText } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CategoriesList.css";
import API_BASE_URL from "./config";
import TopNav from "../components/TopNav";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner-border text-accent" role="status"></div>
        <p className="mt-3 text-light">Loading categories...</p>
      </div>
    );

  if (error)
    return <div className="text-center mt-5 text-danger fw-bold">{error}</div>;

  return (
    <div className="categories-container">
      <TopNav
        title="Investment Report"
      />
      <div className="text-center mb-5 animate-fadeIn">
        <h1 className="text-accent fw-bold display-5">Categories</h1>
        <p className="fw text-white">Explore your investment areas</p>
      </div>

      <div className="container">
        <div className="row g-4">

          {/* Render all categories */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
              onClick={() => navigate(`/category/stocklist/${cat.id}`)}
            >
              <div className="category-card p-4 rounded-4 shadow-lg h-100 animate-float">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="icon-bg">
                    <Folder size={28} className="text-accent" />
                  </div>
                  <Layers size={20} className="text-light opacity-50" />
                </div>

                <div className="mt-4">
                  <h5 className="fw-bold text-white">{cat.name}</h5>
                  <p className="text-secondary small mb-3">{cat.description}</p>
                </div>

                <div className="text-end mt-auto">
                  <span className="text-accent small fw-semibold view-link">
                    View Subcategories →
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* 🔥 Add Hardcoded Report Page */}
          {/* <div
            className="col-12 col-sm-6 col-lg-4 col-xl-3"
            onClick={() => navigate("/report")}
          >
            <div className="category-card p-4 rounded-4 shadow-lg h-100 animate-float report-card">
              <div className="d-flex align-items-center justify-content-between">
                <div className="icon-bg">
                  <FileText size={28} className="text-accent" />
                </div>
                <Layers size={20} className="text-light opacity-50" />
              </div>

              <div className="mt-4">
                <h5 className="fw-bold text-white">Reports</h5>
                <p className="text-secondary small mb-3">
                  View your submitted answers and investment details
                </p>
              </div>

              <div className="text-end mt-auto">
                <span className="text-accent small fw-semibold view-link">
                  View Reports →
                </span>
              </div>
            </div>
          </div> */}

        </div>
      </div>

      {/* Optional floating illustration */}
      <img
        src="https://cdn3d.iconscout.com/3d/premium/thumb/stock-market-4428672-3680560.png"
        alt="Finance illustration"
        className="floating-bg-img"
      />
    </div>
  );
};

export default CategoriesList;
