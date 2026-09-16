import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import DashboardLayout from "../components/layouts/DashboardLayouts";
import ContentSkeleton from "../components/ContentSkeleton";

const LecturerDashboard = () => {
  return (
    <div className="app-shell-bg">
      <DashboardLayout>
        <Suspense fallback={<ContentSkeleton />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    </div>
  );
};

export default LecturerDashboard;
