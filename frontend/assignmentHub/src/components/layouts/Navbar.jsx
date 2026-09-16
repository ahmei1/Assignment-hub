import { useAuth } from "../../context/AuthProvider";
import { LogOut, Menu, Sparkles } from "lucide-react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";

const Navbar = ({ onMenuClick = () => {}, menuOpen = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
        ? "Good Afternoon"
        : "Good Evening";

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/logout");
      logout();
      toast.success("Come back again");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };
  return (
    <header className="sticky top-0 z-30 flex min-h-[4.5rem] items-center justify-between gap-3 border-b border-white/8 bg-[#252736]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>
        <Avatar user={user} size={40} showStatus />
        <div className="min-w-0">
          <p className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#969DD9] sm:flex">
            <Sparkles size={13} aria-hidden="true" /> Your workspace
          </p>
          <h1 className="truncate text-base font-bold text-white sm:text-xl">
            {greeting}, {user?.name}
          </h1>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-white/8 bg-white/[0.035] px-3.5 text-sm font-semibold text-[#B7BDF2] transition hover:border-red-300/20 hover:bg-red-400/10 hover:text-red-200"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
};

export default Navbar;
