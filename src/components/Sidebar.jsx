// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, List, HelpCircle, Users, Settings } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { path: "/admin/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { path: "/admin/categories", icon: <List size={18} />, label: "Categories" },
    { path: "/admin/questions", icon: <HelpCircle size={18} />, label: "Questions" },
    { path: "/admin/answers", icon: <HelpCircle size={18} />, label: "Answers" },
    { path: "/admin/users", icon: <Users size={18} />, label: "Users" },
    { path: "/admin/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">Investment QnA</div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
