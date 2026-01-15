import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [serverStatus, setServerStatus] = useState("checking");
  // checking | online | offline
  const [retrying, setRetrying] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Function to wake backend
  const wakeBackend = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      if (!API_URL) {
        console.log("❌ VITE_API_URL missing");
        setServerStatus("offline");
        return;
      }

      setRetrying(true);
      setServerStatus("checking");

      const res = await fetch(`${API_URL}/api/test`);

      if (res.ok) {
        setServerStatus("online");
      } else {
        setServerStatus("offline");
      }
    } catch (err) {
      console.log("❌ Backend not reachable:", err);
      setServerStatus("offline");
    } finally {
      setRetrying(false);
    }
  };

  // ✅ Wake backend on page load
  useEffect(() => {
    wakeBackend();
  }, []);

  // ✅ Auto retry every 7 sec if backend sleeping
  useEffect(() => {
    if (serverStatus !== "offline") return;

    const interval = setInterval(() => {
      wakeBackend();
    }, 7000);

    return () => clearInterval(interval);
  }, [serverStatus]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">CreatorLab</h1>

        {/* ✅ Backend status */}
        <div className="mb-6 text-sm space-y-2">
          {serverStatus === "checking" && (
            <p className="text-yellow-300">⚡ Connecting to server...</p>
          )}

          {serverStatus === "online" && (
            <p className="text-green-300">✅ Server is ready</p>
          )}

          {serverStatus === "offline" && (
            <>
              <p className="text-red-300">❌ Server sleeping / offline</p>

              <button
                onClick={wakeBackend}
                disabled={retrying}
                className={`w-full text-sm py-2 rounded ${
                  retrying
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {retrying ? "Retrying..." : "🔄 Retry Connection"}
              </button>

              <p className="text-xs text-gray-300">
                Auto retry running every 7 seconds...
              </p>
            </>
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
