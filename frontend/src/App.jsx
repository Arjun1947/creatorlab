import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

// pages
import CaptionGenerator from "./pages/CaptionGenerator";
import BioOptimizer from "./pages/BioOptimizer";
import History from "./pages/History";

export default function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/caption" />} />

      {/* Layout wrapper */}
      <Route element={<DashboardLayout />}>
        <Route path="/caption" element={<CaptionGenerator />} />
        <Route path="/bio" element={<BioOptimizer />} />
        <Route path="/history" element={<History />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/caption" />} />
    </Routes>
  );
}
