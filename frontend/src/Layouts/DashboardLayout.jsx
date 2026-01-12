import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">CreatorLab</h1>

        <nav className="space-y-3 flex-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            🏠 Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/captions"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            ✍️ Caption Generator
          </NavLink>

          <NavLink
            to="/dashboard/bio"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            👤 Bio Optimizer
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
