import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import API_BASE_URL from "./config";
import TopNav from "../components/TopNav";
import { toast } from "react-toastify";
import "./ReportPage.css";

const categorizeAnswers = (stock) => {
  const overview = [];
  const metrics = [];
  const conclusion = [];

  stock.subcategories.forEach((sub) => {
    sub.questions.forEach((q) => {
      const text = q.answerText || "—";
      const name = sub.subCategoryName.toLowerCase();

      if (name.includes("overview") || name.includes("business")) {
        overview.push(text);
      } else if (name.includes("metric") || name.includes("financial")) {
        metrics.push(text);
      } else if (name.includes("conclusion") || name.includes("summary")) {
        conclusion.push(text);
      } else {
        overview.push(text);
      }
    });
  });

  return { overview, metrics, conclusion };
};

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const downloadPDF = (stock = null) => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;

    pdf.setFontSize(20);
    pdf.setTextColor(28, 37, 65);
    pdf.text("Investment Research Report", 105, y, { align: "center" });
    y += 15;

    const data = stock ? [stock] : reports;

    data.forEach((s) => {
      const { overview, metrics, conclusion } = categorizeAnswers(s);

      pdf.setFontSize(16);
      pdf.setTextColor(0, 128, 128);
      pdf.text(`Stock: ${s.stockSymbol}`, 10, y);
      y += 10;

      const sections = [
        { title: "Overview", content: overview },
        { title: "Metrics", content: metrics },
        { title: "Conclusion", content: conclusion },
      ];

      sections.forEach((sec) => {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 102, 204);
        pdf.text(sec.title, 12, y);
        y += 7;

        sec.content.forEach((txt) => {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.text(txt, 14, y);
          y += 6;

          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
        });

        y += 5;
      });

      y += 8;
      pdf.setDrawColor(200);
      pdf.setLineWidth(0.5);
      pdf.line(10, y, 200, y);
      y += 10;

      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
    });

    const fileName = stock ? `${stock.stockSymbol}_Report.pdf` : "Full_Investment_Report.pdf";
    pdf.save(fileName);
  };

  const handleDelete = async (stockSymbol) => {
    if (!window.confirm(`Are you sure you want to delete the report for ${stockSymbol}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/reports/${stockSymbol}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReports((prev) => prev.filter((r) => r.stockSymbol !== stockSymbol));
      toast.success(`🗑️ ${stockSymbol} deleted successfully`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete report");
    }
  };

  if (loading) {
    return (
      <div className="report-loading">
        <div className="spinner-border text-accent" />
        <p className="mt-3">Loading your investment reports…</p>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="report-loading">
        <p>No reports available yet.</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <TopNav title="Investment Reports" />

      <div className="container">
        {reports.map((stock) => {
          const { overview, metrics, conclusion } = categorizeAnswers(stock);

          return (
            <div key={stock.stockSymbol} className="report-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="stock-title">{stock.stockSymbol}</h2>
                <div className="d-flex gap-2">
                  <button className="btn-download-small" onClick={() => downloadPDF(stock)}>Download</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(stock.stockSymbol)}>Delete</button>
                </div>
              </div>

              <div className="report-grid">
                <div className="report-box overview">
                  <h4>Overview</h4>
                  {overview.map((ans, idx) => <p key={idx}>{ans}</p>)}
                </div>
                <div className="report-box metrics">
                  <h4>Metrics</h4>
                  {metrics.map((ans, idx) => <p key={idx}>{ans}</p>)}
                </div>
                <div className="report-box conclusion">
                  <h4>Conclusion</h4>
                  {conclusion.map((ans, idx) => <p key={idx}>{ans}</p>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportPage;
