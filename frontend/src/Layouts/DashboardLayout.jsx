import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // ✅ Clear login storage (real logout)
    localStorage.removeItem("creatorlab_token");
    localStorage.removeItem("creatorlab_user");

    // ✅ If you are using AuthContext logout also
    if (logout) logout();

    navigate("/login");
  };

  // ✅ Close sidebar automatically when screen becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Auto-close sidebar when clicking a menu item
  const closeSidebar = () => setSidebarOpen(false);

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-gray-700 text-white" : "text-gray-200 hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ✅ Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-full w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">CreatorLab</h1>
          <p className="text-xs text-gray-400 mt-1">AI Tools Dashboard 🚀</p>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2 flex-1">
          <NavLink to="/caption" className={linkClass} onClick={closeSidebar}>
            🧠 Caption Generator
          </NavLink>

          <NavLink to="/bio" className={linkClass} onClick={closeSidebar}>
            👤 Bio Optimizer
          </NavLink>

          <NavLink to="/history" className={linkClass} onClick={closeSidebar}>
            📌 History
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ✅ Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        {/* ✅ Top Bar (Mobile) */}
        <header className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-2 rounded-lg bg-gray-900 text-white"
          >
            ☰
          </button>

          <h2 className="text-base font-semibold text-gray-800">
            CreatorLab Dashboard
          </h2>

          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
