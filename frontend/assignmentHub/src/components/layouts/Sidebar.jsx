import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import {
  LayoutDashboard,
  BookOpenText,
  NotebookText,
  BookCheck,
  BookSearch,
  UserRoundPen,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user } = useAuth();

  const studentLayout = [
    {
      id: 1,
      name: "Dashboard",
      link: "/studentDashboard",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "My Courses",
      link: "/studentDashboard/mycourses",
      icon: BookOpenText,
    },
    {
      id: 3,
      name: "Discover Courses",
      link: "/studentDashboard/discoverCourses",
      icon: BookSearch,
    },
    {
      id: 4,
      name: "Assignments",
      link: "/studentDashboard/assignments",
      icon: NotebookText,
    },
    {
      id: 5,
      name: "Profile",
      link: "/studentDashboard/profile",
      icon: UserRoundPen,
      bottom: true,
    },
  ];

  const lecturerLayout = [
    {
      id: 1,
      name: "Dashboard",
      link: "/lecturerDashboard",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "My Courses",
      link: "/lecturerDashboard/courses",
      icon: BookOpenText,
    },
    {
      id: 3,
      name: "Create Assignment",
      link: "/lecturerDashboard/createAssignment",
      icon: NotebookText,
    },
    {
      id: 4,
      name: "Submissions",
      link: "/lecturerDashboard/submissions",
      icon: BookCheck,
    },
  ];

  const menu = user?.role === "student" ? studentLayout : lecturerLayout;

  return (
    <>
      {/* Backdrop — mobile only, dims the page while the drawer is open */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed top-0 bottom-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col bg-[#252736] p-4 text-[#969DD9] transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:bottom-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assignment Hub</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.link}
                onClick={onClose}
                end={
                  item.link === "/studentDashboard" ||
                  item.link === "/lecturerDashboard"
                }
                className={({ isActive }) =>
                  `
                flex items-center gap-3
                p-3
                rounded-2xl
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-[#41455E] text-white"
                    : "hover:bg-[#41455E]"
                }
                ${item.bottom ? "mt-auto" : ""}
                `
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
