import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold"
      : "hover:text-blue-400";

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">CreatorLab</h1>

      <nav className="space-y-4">
        <p className="text-gray-400 text-sm uppercase">Tools</p>

        <ul className="space-y-3">
          <li>
            <NavLink to="/" className={linkClass}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/caption-generator" className={linkClass}>
              Caption & Hashtags
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
