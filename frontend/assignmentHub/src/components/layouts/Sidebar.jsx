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
  GraduationCap,
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
    {
      id: 5,
      name: "Profile",
      link: "/lecturerDashboard/profile",
      icon: UserRoundPen,
      bottom: true,
    },
  ];

  const menu = user?.role === "student" ? studentLayout : lecturerLayout;

  return (
    <>
      {/* Backdrop — mobile only, dims the page while the drawer is open */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        tabIndex={isOpen ? 0 : -1}
        className={`fixed inset-0 z-40 bg-[#11131d]/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Dashboard navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 flex h-screen w-[17rem] shrink-0 flex-col border-r border-white/8 bg-[#202230]/95 p-4 text-[#B7BDF2] shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:bottom-auto lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-9 flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#969DD9]/20 bg-[#969DD9]/12 shadow-inner">
              <GraduationCap size={23} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-[Syne] text-lg font-bold leading-tight text-white">Assignment Hub</h2>
              <p className="mt-0.5 text-xs capitalize text-white/45">{user?.role} workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-xl text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto" aria-label="Primary">
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
                group relative flex min-h-12 items-center gap-3
                px-3.5 py-3
                rounded-xl
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-[#969DD9]/16 text-white shadow-[inset_0_0_0_1px_rgba(183,189,242,0.12)]"
                    : "text-white/60 hover:bg-white/6 hover:text-white"
                }
                ${item.bottom ? "mt-auto" : ""}
                `
                }
              >
                <Icon size={20} aria-hidden="true" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold text-white/80">{user?.email}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
