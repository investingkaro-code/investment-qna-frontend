import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CategoriesList from "./pages/CategoriesList";
import SubCategoriesPage from "./pages/SubCategoriesPage";
import QuestionsPage from "./pages/QuestionsPage";
import ReportPage from "./pages/ReportPage";
import StocksListPage from "./pages/StockListPage";
import AnswerQuestionsPage from "./pages/AnswerQuestionsPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WatchlistPage from "./pages/WatchlistPage";


function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/category/stocklist/:categoryId"
            element={
              <ProtectedRoute>
                <StocksListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/answer/:categoryId"
            element={
              <ProtectedRoute>
                <AnswerQuestionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subcategory/:subCategoryId"
            element={
              <ProtectedRoute>
                <QuestionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
          path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>   
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        toastClassName="custom-toast"
        progressClassName="custom-toast-progress"
      />
    </>
  );
}

export default App;
