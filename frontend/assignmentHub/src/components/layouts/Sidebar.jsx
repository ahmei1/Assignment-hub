import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import {
  LayoutDashboard,
  BookOpenText,
  NotebookText,
  BookCheck,
  UserRoundPen,
} from "lucide-react";
const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-64 min-h-screen p-4 bg-[#252736] text-[#969DD9] ">
      <h2 className="text-2xl font-bold mb-20">Assignment Hub</h2>

      {user?.role === "student" && (
        <div className="flex flex-col gap-15">
            <Link to="/studentDashboard" className="flex gap-2 p-3  hover:rounded-3xl hover:bg-[#41455E]  transition-all duration-200">
              <LayoutDashboard />
              Dashboard
            </Link>
            <Link to="/studentDashboard/mycourses" className="flex gap-2 p-3 hover:rounded-2xl hover:bg-[#41455E] transition-all duration-200">
              <BookOpenText />
              My Courses
            </Link>
            <Link to="/studentDashboard/assignments" className="flex gap-2 p-3 hover:rounded-2xl hover:bg-[#41455E] transition-all duration-200">
              <NotebookText />
              Assignments
            </Link>
            <Link to="/studentDashboard/submissions" className="flex gap-2 p-3 hover:rounded-2xl hover:bg-[#41455E]  transition-all duration-200">
              <BookCheck />
              Submissions
            </Link>
            <Link to="/studentDashboard/profile" className="flex gap-2 p-3 mt-80 hover:rounded-2xl hover:bg-[#41455E] transition-all duration-200">
              <UserRoundPen />
              Profile
            </Link>
        </div>
      )}

      {user?.role === "lecturer" && (
        <div className="flex flex-col gap-4">
          <Link to="/lecturerDashboard">Dashboard</Link>
          <Link to="/lecturerDashboard/lecturerCourses">My Courses</Link>
          <Link to="/lecturerDashboard/createAssignment">
            Create Assignment
          </Link>
          <Link to="/lecturerDashboard/submissions">Submissions</Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
