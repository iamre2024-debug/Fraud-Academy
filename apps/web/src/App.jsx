import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

import Dashboard from "./pages/Dashboard";
import InvestigationWorkspace from "./pages/InvestigationWorkspace";
import Customer360 from "./pages/Customer360";
import IdentityIntel from "./pages/IdentityIntel";
import LoginHistory from "./pages/LoginHistory";
import DeviceIntel from "./pages/DeviceIntel";
import FinancialInvestigation from "./pages/FinancialInvestigation";
import EvidenceCenter from "./pages/EvidenceCenter";
import TimelineBuilder from "./pages/TimelineBuilder";
import CaseReview from "./pages/CaseReview";
import WorkspaceNav from "./components/WorkspaceNav";

function NeonAppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex text-white bg-[#0e0418] font-sans">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 bg-[#1a062f] w-64 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <WorkspaceNav />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 bg-[#1a062f] shadow-md shadow-fuchsia-900/50">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6 text-fuchsia-400" />
          </button>
          <h1 className="text-xl font-semibold text-fuchsia-400">Fraud Academy</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Hi Ree!</span>
          </div>
        </header>

        {/* Routed pages */}
        <main className="flex-1 overflow-y-auto p-4 bg-[#120622]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard & Shell */}
        <Route path="/" element={<NeonAppShell />}>
          <Route index element={<Dashboard />} />

          {/* Investigation Workspace routes */}
          <Route path="case/:caseId" element={<InvestigationWorkspace />}>
            <Route path="customer360" element={<Customer360 />} />
            <Route path="identity-intel" element={<IdentityIntel />} />
            <Route path="login-history" element={<LoginHistory />} />
            <Route path="device-intel" element={<DeviceIntel />} />
            <Route path="financial" element={<FinancialInvestigation />} />
            <Route path="evidence" element={<EvidenceCenter />} />
            <Route path="timeline" element={<TimelineBuilder />} />
            <Route path="review" element={<CaseReview />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
