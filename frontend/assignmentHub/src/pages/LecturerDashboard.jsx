import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayouts";
import { div } from "framer-motion/client";

const LecturerDashboard = () => {
  return (
    <div className="bg-[#41455E]">
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default LecturerDashboard;
