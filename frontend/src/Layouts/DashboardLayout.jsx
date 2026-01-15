import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [serverStatus, setServerStatus] = useState("checking"); 
  // checking | online | offline

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Wake up backend on app load
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        if (!API_URL) {
          console.log("❌ VITE_API_URL missing");
          setServerStatus("offline");
          return;
        }

        const res = await fetch(`${API_URL}/api/test`);
        if (res.ok) {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
      } catch (err) {
        console.log("❌ Backend not reachable:", err);
        setServerStatus("offline");
      }
    };

    wakeBackend();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">CreatorLab</h1>

        {/* ✅ Backend status */}
        <div className="mb-6 text-sm">
          {serverStatus === "checking" && (
            <p className="text-yellow-300">⚡ Connecting to server...</p>
          )}
          {serverStatus === "online" && (
            <p className="text-green-300">✅ Server is ready</p>
          )}
          {serverStatus === "offline" && (
            <p className="text-red-300">❌ Server offline / sleeping</p>
          )}
        </div>

        <nav className="space-y-3 flex-1">
          <NavLink
            to="/caption"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            🔥 Caption Generator
          </NavLink>

          <NavLink
            to="/bio"
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
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            🕒 History
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
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
