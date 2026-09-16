import { Outlet } from "react-router-dom";
import DashboardLayouts from "../components/layouts/DashboardLayouts";

const StudentDashboard = () => {

  return (
    <div className="app-shell-bg">
      <DashboardLayouts>
        <Outlet />
      </DashboardLayouts>
    </div>
  );
};

export default StudentDashboard;
