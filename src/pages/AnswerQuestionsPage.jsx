import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Layers, Home } from "lucide-react";
import API_BASE_URL from "./config";
import "./AnswerQuestions.css";
import TopNav from "../components/TopNav";
import { toast } from "react-toastify";

const AnswerQuestionsPage = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stockSymbol = location.state?.stockSymbol;

  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState({
    answeredCount: 0,
    totalQuestions: 0
  });

  const isEmpty = Object.values(answers).every(v => !v?.trim());

  // ===============================
  // FETCH QUESTIONS
  // ===============================
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/questions/by-category/${categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const questions = res.data;

        if (questions.length > 0) {
          setCategoryName(questions[0].categoryName);
        }

        // GROUP BY SUBCATEGORY
        const grouped = questions.reduce((acc, q) => {
          if (!acc[q.subCategoryName]) {
            acc[q.subCategoryName] = [];
          }
          acc[q.subCategoryName].push(q);
          return acc;
        }, {});

        setGroupedQuestions(grouped);
      } catch (err) {
        console.error("Failed to load questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId]);

  // ===============================
  // FETCH RESUME ANSWERS + PROGRESS
  // ===============================
  useEffect(() => {
    const fetchResumeAnswers = async () => {
      if (!stockSymbol) return;

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}/api/answers/resume`,
          {
            params: {
              stockSymbol,
              categoryId
            },
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Prefill answers
        const prefilled = {};
        res.data.answers.forEach(a => {
          prefilled[a.questionId] = a.answerText;
        });

        setAnswers(prefilled);
        setProgress({
          answeredCount: res.data.answeredCount,
          totalQuestions: res.data.totalQuestions
        });

      } catch (err) {
        console.error("Failed to fetch resume answers", err);
      }
    };

    fetchResumeAnswers();
  }, [stockSymbol, categoryId]);

  // ===============================
  // HANDLE ANSWER CHANGE (LIVE PROGRESS)
  // ===============================
  const handleChange = (questionId, value) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: value };

      const answeredCount = Object.values(updated)
        .filter(v => v && v.trim().length > 0)
        .length;

      setProgress(p => ({
        ...p,
        answeredCount
      }));

      return updated;
    });
  };

  // ===============================
  // SAVE ANSWERS
  // ===============================
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        stockSymbol,
        answers: Object.entries(answers).map(([qid, text]) => ({
          questionId: Number(qid),
          answerText: text
        }))
      };

      await axios.post(
        `${API_BASE_URL}/api/answers/bulk`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Answers saved successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save answers");
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="page-bg">
        <div className="loading-container">
          <div className="spinner-border text-accent" />
          <p className="text-light mt-3">Loading questions...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="page-bg">

      {/* PAGE HEADER */}
      <div className="text-center mb-4 animate-fadeIn">
              <TopNav
        title=""
      />
        <h1 className="text-accent fw-bold display-6">
          {stockSymbol}
        </h1>
        <p className="text-white-50">{categoryName}</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="container mb-4">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-white-50">
            Progress: {progress.answeredCount}/{progress.totalQuestions}
          </span>
          <span className="text-accent fw-semibold">
            {progress.totalQuestions
              ? Math.round((progress.answeredCount / progress.totalQuestions) * 100)
              : 0}%
          </span>
        </div>

        <div className="progress" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-accent"
            style={{
              width: progress.totalQuestions
                ? `${(progress.answeredCount / progress.totalQuestions) * 100}%`
                : "0%"
            }}
          />
        </div>
      </div>

      <div className="container">

        {Object.entries(groupedQuestions).map(([subName, questions]) => (
          <div key={subName} className="mb-5">

            {/* SUBCATEGORY HEADER */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="icon-bg bg-accent-soft">
                <Layers size={20} className="text-accent" />
              </div>
              <h4 className="text-white mb-0">{subName}</h4>
            </div>

            {/* QUESTIONS */}
            <div className="row g-4">
              {questions.map((q, index) => (
                <div key={q.id} className="col-12 col-lg-6">
                  <div
                    className="stock-card p-4 rounded-4 h-100 animate-float"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <p className="text-white fw-semibold mb-3">
                      {q.questionText}
                    </p>

                    <textarea
                      className="form-control answer-input"
                      placeholder="Write your analysis here..."
                      value={answers[q.id] || ""}
                      onChange={e =>
                        handleChange(q.id, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

        {/* SAVE BUTTON */}
        <div className="text-center mt-5">
          <button
            onClick={handleSave}
            disabled={saving || isEmpty}
            className="btn btn-lg btn-accent px-5"
          >
            {saving ? "Saving..." : "Save Answers"}
          </button>
        </div>

      </div>

      {/* FLOATING BACKGROUND */}
      <img
        src="https://cdn3d.iconscout.com/3d/premium/thumb/stock-market-analysis-5145478-4291692.png"
        alt="bg"
        className="floating-bg-img"
      />

    </div>
  );
};

export default AnswerQuestionsPage;
