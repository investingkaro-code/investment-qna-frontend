import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HelpCircle, Send } from "lucide-react";
import "./Questions.css"; // 👈 same theme CSS
import API_BASE_URL from "./config";

const QuestionsPage = () => {
  const { subCategoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/questions/by-subcategory/${subCategoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subCategoryId]);

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (questionId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_BASE_URL}/api/answers`,
        {
          questionId,
          answerText: answers[questionId] || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted((prev) => ({ ...prev, [questionId]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <p className="text-accent text-lg animate-pulse">
          Loading questions...
        </p>
      </div>
    );

  return (
    <div className="categories-container">
      <h1 className="text-center text-4xl font-bold text-accent mb-10 animate-fadeIn">
        Questions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-8">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="category-card animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="icon-bg">
                  <HelpCircle className="text-accent w-6 h-6" />
                </div>
                <span className="text-gray-400 text-sm">
                  {q.subCategoryName || ""}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-white mb-3">
                {q.questionText}
              </h2>

              <textarea
                rows="3"
                className="w-full bg-transparent border border-gray-600 rounded-md text-gray-200 p-2 focus:outline-none focus:border-accent"
                placeholder="Type your answer..."
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                disabled={submitted[q.id]}
              ></textarea>

              <button
                onClick={() => handleSubmit(q.id)}
                disabled={submitted[q.id]}
                className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-all ${
                  submitted[q.id]
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-accent hover:opacity-90"
                }`}
              >
                <Send className="w-4 h-4" />
                {submitted[q.id] ? "Submitted" : "Submit"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center text-gray-400 text-lg mt-10">
          No questions found.
        </div>
      )}

      {/* Floating background image */}
      <img
        src="/assets/investing-bg.png"
        alt="floating background"
        className="floating-bg-img"
      />
    </div>
  );
};

export default QuestionsPage;
