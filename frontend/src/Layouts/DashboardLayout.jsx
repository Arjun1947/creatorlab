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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ✅ Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`
          fixed md:sticky md:top-0 top-0 left-0 z-50
          h-screen w-64 bg-gray-900 text-white p-6 flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">CreatorLab</h1>

          {/* Close button (Mobile) */}
          <button
            onClick={closeSidebar}
            className="md:hidden text-white text-2xl"
          >
            ✖
          </button>
        </div>

        <nav className="space-y-3 flex-1">
          <NavLink
            to="/caption"
            onClick={closeSidebar}
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
            onClick={closeSidebar}
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
            onClick={closeSidebar}
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
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar (Mobile Only) */}
        <header className="md:hidden bg-white shadow p-4 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-gray-900 text-white px-3 py-2 rounded"
          >
            ☰
          </button>
          <h2 className="font-semibold text-gray-800">CreatorLab</h2>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
