// src/layouts/DashboardLayout.jsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="page-bg">
      <Sidebar />
      <main className="page-bg">
        <Outlet /> {/* This renders the child routes */}
      </main>
    </div>
  );
};

export default DashboardLayout;
