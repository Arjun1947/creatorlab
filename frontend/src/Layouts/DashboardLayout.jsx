import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Backend status
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

  // ✅ Close sidebar on route click (mobile)
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Topbar (Mobile) */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl"
          aria-label="Open Menu"
        >
          ☰
        </button>

        <h1 className="font-bold text-lg">CreatorLab</h1>

        <div className="w-8" />
      </div>

      <div className="flex min-h-screen">
        {/* ✅ Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* ✅ Sidebar */}
        <aside
          className={`
            fixed md:static top-0 left-0 h-full z-50
            w-72 md:w-64 bg-gray-900 text-white p-6 flex flex-col
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">CreatorLab</h1>

            {/* Close button (Mobile) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-2xl"
              aria-label="Close Menu"
            >
              ✕
            </button>
          </div>

          {/* ✅ Backend Status */}
          <div className="mb-6 text-sm space-y-2 bg-gray-800 p-3 rounded">
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
                  Auto retry every 7 seconds...
                </p>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-3 flex-1">
            <NavLink
              to="/caption"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-4 py-3 rounded font-medium ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`
              }
            >
              🔥 Caption Generator
            </NavLink>

            <NavLink
              to="/bio"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-4 py-3 rounded font-medium ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`
              }
            >
              👤 Bio Optimizer
            </NavLink>

            <NavLink
              to="/history"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-4 py-3 rounded font-medium ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`
              }
            >
              🕒 History
            </NavLink>
          </nav>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold"
          >
            🚪 Logout
          </button>
        </aside>

        {/* ✅ Main Content */}
        <main className="flex-1 p-4 md:p-8 md:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
