import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import DashboardLayouts from "../components/layouts/DashboardLayouts";
import ContentSkeleton from "../components/ContentSkeleton";

const StudentDashboard = () => {

  return (
    <div className="app-shell-bg">
      <DashboardLayouts>
        <Suspense fallback={<ContentSkeleton />}>
          <Outlet />
        </Suspense>
      </DashboardLayouts>
    </div>
  );
};

export default StudentDashboard;
