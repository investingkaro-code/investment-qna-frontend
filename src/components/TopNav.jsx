import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

const TopNav = ({
  title,
  subtitle,
  showBack = true,
  showLeftControls = true
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  return (
    <div className="container mb-4 animate-fadeIn">

      <div className="d-flex justify-content-between align-items-center mb-3">

        {/* LEFT CONTROLS */}
        {showLeftControls ? (
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
        ) : (
          <div />  // <-- KEY: empty spacer removed
        )}

        {/* RIGHT CONTROLS */}
        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          <LogOut size={16} /> Logout
        </button>

      </div>

      {/* TITLE */}
      <div className="text-center">
        <h1 className="text-accent fw-bold display-6">{title}</h1>
        {subtitle && <p className="text-white-50">{subtitle}</p>}
      </div>

    </div>
  );
};

export default TopNav;
