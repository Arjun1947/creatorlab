import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ✅ Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-full w-64 bg-gray-900 text-white p-6 flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h1 className="text-2xl font-bold mb-8">CreatorLab</h1>

        <nav className="space-y-3 flex-1">
          <NavLink
            to="/caption"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            ✍️ Caption Generator
          </NavLink>

          <NavLink
            to="/bio"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            👤 Bio Optimizer
          </NavLink>

          <NavLink
            to="/history"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            🕒 History
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          🚪 Logout
        </button>
      </aside>

      {/* ✅ Main Content */}
      <div className="flex-1 w-full md:ml-64">

        {/* ✅ Top Bar (Mobile Header) */}
        <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-gray-900 text-white px-3 py-2 rounded"
          >
            ☰ Menu
          </button>

          <h2 className="font-bold text-gray-800">CreatorLab</h2>
        </div>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
