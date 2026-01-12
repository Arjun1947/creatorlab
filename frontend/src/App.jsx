import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import CaptionGenerator from "./pages/CaptionGenerator";
import BioOptimizer from "./pages/BioOptimizer";

function App() {
  return (
    <Routes>
      {/* Dashboard layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="captions" element={<CaptionGenerator />} />
        <Route path="bio" element={<BioOptimizer />} />
      </Route>
    </Routes>
  );
}

export default App;
