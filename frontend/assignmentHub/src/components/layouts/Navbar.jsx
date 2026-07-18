import { useAuth } from "../../context/AuthProvider";
import { LogOut, Menu } from "lucide-react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar";

const Navbar = ({ onMenuClick = () => {} }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate()

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
    <div className="flex h-16 items-center justify-between gap-3 bg-[#252736] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="shrink-0 rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>
        <Avatar user={user} size={38} showStatus />
        <h1 className="truncate text-lg font-bold text-white sm:text-2xl">
          {greeting}, {user?.name} 👋
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full p-3 text-[15px] font-bold text-[#969DD9] transition duration-300 hover:text-[#c20b0b]"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default Navbar;