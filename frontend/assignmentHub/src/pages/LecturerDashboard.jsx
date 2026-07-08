import { Outlet } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayouts";
import { useAuth } from "../context/AuthProvider";

const LecturerDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default LecturerDashboard;
