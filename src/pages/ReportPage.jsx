import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";
import './ReportPage.css'
import API_BASE_URL from "./config";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = 1; // you can get this dynamically later if needed

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/answers?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReports(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load report data.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [userId]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="text-accent text-lg font-medium animate-pulse">
          Loading report data...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="loading-container">
        <div className="text-red-400">{error}</div>
      </div>
    );

  return (
    <div className="categories-container">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-center text-accent mb-10 animate-fadeIn flex items-center justify-center gap-2">
          <FileText className="w-8 h-8" />
          Your Answers Report
        </h1>

        {reports.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            No answers submitted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((r, index) => (
              <div
                key={index}
                className="category-card p-6 rounded-xl shadow-md animate-float border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="icon-bg">
                    <FileText className="text-accent w-6 h-6" />
                  </div>
                  <h2 className="ml-3 text-lg font-semibold text-accent">
                    Question ID: {r.questionId}
                  </h2>
                </div>
                <div className="answer-container">
                    <span className="answer-label">Your Answer:</span>
                    <p className="answer-text">{r.answerText?.trim() || "—"}</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating 3D background image */}
      <img
        src="https://cdn.dribbble.com/users/1162077/screenshots/15654025/media/e1a65a1e1e7e31e71a3c92c29dfb22c9.png?compress=1&resize=800x600"
        alt="floating background"
        className="floating-bg-img"
      />
    </div>
  );
};

export default ReportPage;
