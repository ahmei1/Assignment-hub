import { Outlet } from "react-router-dom";
import DashboardLayouts from "../components/layouts/DashboardLayouts";

const StudentDashboard = () => {

  return (
    <div className="bg-[#41455E]">
      <DashboardLayouts>
        <Outlet />
      </DashboardLayouts>
    </div>
  );
};

export default StudentDashboard;
