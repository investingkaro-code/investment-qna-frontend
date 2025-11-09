import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CategoriesList from "./pages/CategoriesList";
import SubCategoriesPage from "./pages/SubCategoriesPage";
import QuestionsPage from "./pages/QuestionsPage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/category/:categoryId" element={<SubCategoriesPage />} />
        <Route path="/subcategory/:subCategoryId" element={<QuestionsPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
