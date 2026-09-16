import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayouts";

const LecturerDashboard = () => {
  return (
    <div className="app-shell-bg">
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default LecturerDashboard;
