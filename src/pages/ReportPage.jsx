import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import API_BASE_URL from "./config";
import "./ReportPage.css";
import TopNav from "../components/TopNav";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  // =========================
  // Download PDF Programmatically
  // =========================
  const downloadPDF = (stock = null) => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20; // initial vertical position

    pdf.setFontSize(20);
    pdf.setTextColor(28, 37, 65);
    pdf.text("Investment Research Report", 105, y, { align: "center" });
    y += 15;

    const data = stock ? [stock] : reports;

    data.forEach((s) => {
      pdf.setFontSize(16);
      pdf.setTextColor(0, 128, 128);
      pdf.text(`Stock: ${s.stockSymbol}`, 10, y);
      y += 8;

      s.subcategories.forEach((sub) => {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 102, 204);
        pdf.text(sub.subCategoryName, 12, y);
        y += 7;

        sub.questions.forEach((q) => {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`Q: ${q.questionText}`, 14, y);
          y += 6;

          pdf.setTextColor(80, 80, 80);
          pdf.text(`A: ${q.answerText || "—"}`, 16, y);
          y += 8;

          // Add page if we reach bottom
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
        });

        y += 4; // space between subcategories
      });

      y += 8; // space between stocks
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

  if (loading) {
    return (
      <div className="report-loading">
        <div className="spinner-border text-accent" />
        <p className="mt-3">Loading your investment report…</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="report-loading">
        <p>No reports available yet.</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <TopNav
        title="Investment Report"
      />

      <div className="container">

        {/* HEADER WITH FULL REPORT DOWNLOAD */}
        <div className="report-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 className="report-title">Investment Research Report</h1>
          <button className="btn-download" onClick={() => downloadPDF()}>
            Download Full Report
          </button>
        </div>

        {/* REPORT DISPLAY */}
        {reports.map((stock) => (
          <section key={stock.stockSymbol} className="stock-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="stock-title">{stock.stockSymbol}</h2>
              <button className="btn-download-small" onClick={() => downloadPDF(stock)}>
                Download Stock
              </button>
            </div>

            {stock.subcategories.map((sub) => (
              <div key={sub.subCategoryName} className="subcategory-section">
                <h3 className="subcategory-title">{sub.subCategoryName}</h3>

                {sub.questions.map((q, idx) => (
                  <div key={idx} className="qa-block">
                    <p className="question-text">{q.questionText}</p>
                    <p className="answer-text">{q.answerText || "—"}</p>
                  </div>
                ))}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

export default ReportPage;
