import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./Layouts/DashboardLayout";

// pages
import CaptionGenerator from "./pages/CaptionGenerator";
import BioOptimizer from "./pages/BioOptimizer";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      {/* Default route = dashboard */}
      <Route path="/" element={<Navigate to="/caption" />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/caption" element={<CaptionGenerator />} />
        <Route path="/bio" element={<BioOptimizer />} />
        <Route path="/history" element={<History />} />

        {/* Login inside dashboard */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/caption" />} />
    </Routes>
  );
}
