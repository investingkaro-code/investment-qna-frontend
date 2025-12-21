import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const TopNav = ({ title, subtitle, showBack = true }) => {
  const navigate = useNavigate();

  return (
    
    <div className="container mb-4 animate-fadeIn">

      <div className="d-flex justify-content-between align-items-center mb-3">

        {/* LEFT CONTROLS */}
        <div className="d-flex gap-2">
          {showBack && (
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}

          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/dashboard")}
          >
            <Home size={16} /> Dashboard
          </button>
        </div>
      </div>

      {/* TITLE */}
      <div className="text-center">
        <h1 className="text-accent fw-bold display-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white-50">{subtitle}</p>
        )}
      </div>

    </div>
  );
};

export default TopNav;
