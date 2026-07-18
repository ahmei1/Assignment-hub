import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Each page renders its own <main>, so this stays a plain div
            to avoid invalid nested <main> elements. */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
