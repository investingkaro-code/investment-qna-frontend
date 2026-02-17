import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Layers, FolderOpen } from "lucide-react";
import "./SubCategories.css"; // 👈 same theme as CategoryList
import API_BASE_URL from "./config";

const SubCategoriesPage = () => {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/subcategories/by-category/${categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubcategories(response.data);
        if (response.data.length > 0) {
          setCategoryName(response.data[0].category.name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubcategories();
  }, [categoryId]);

  if (loading)
    return (
      <div className="loading-container">
        <p className="text-accent text-lg animate-pulse">
          Loading subcategories...
        </p>
      </div>
    );

  return (
    <div className="page-bg">
      <h1 className="text-center text-4xl font-bold text-accent mb-10 animate-fadeIn">
        {categoryName} - Subcategories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-10">
        {subcategories.map((sub, index) => (
          <div
            key={sub.id}
            onClick={() => navigate(`/subcategory/${sub.id}`)}
            className="category-card animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="icon-bg">
                  <FolderOpen className="text-accent w-6 h-6" />
                </div>
                <Layers className="text-gray-400 w-5 h-5" />
              </div>

              <h2 className="text-lg font-semibold text-white mb-2">
                {sub.name}
              </h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {sub.category.description || "No description available"}
              </p>

              <span className="text-accent text-sm font-medium view-link">
                View Questions →
              </span>
            </div>
          </div>
        ))}
      </div>

      {subcategories.length === 0 && (
        <div className="text-center text-gray-400 text-lg mt-10">
          No subcategories found.
        </div>
      )}

      <img
        src="/assets/investing-bg.png"
        alt="floating background"
        className="floating-bg-img"
      />
    </div>
  );
};

export default SubCategoriesPage;
