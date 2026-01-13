import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./Layouts/DashboardLayout";

// pages
import CaptionGenerator from "./pages/CaptionGenerator";
import BioOptimizer from "./pages/BioOptimizer";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ HOME ROUTE FIX */}
        <Route path="/" element={<Navigate to="/caption" />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/caption" element={<CaptionGenerator />} />
          <Route path="/bio" element={<BioOptimizer />} />
          <Route path="/history" element={<History />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
