import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, FileText } from "lucide-react";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="container text-center">

        <h1 className="dashboard-title">Welcome 👋</h1>
        <p className="dashboard-subtitle">
          Start a new stock analysis or review your research
        </p>

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

      </div>
    </div>
  );
};

export default DashboardPage;
