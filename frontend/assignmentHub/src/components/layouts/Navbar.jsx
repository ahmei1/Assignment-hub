import { useAuth } from "../../context/AuthProvider";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  const currentHour = new Date().getHours();

  let greeting = "";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-[#252736] text-white">
      <h1 className="text-2xl font-bold">
        {greeting}, {user?.name} 👋
      </h1>

      <button
        onClick={logout}
        className="flex cursor-pointer items-center gap-2 p-3 m-2 text-[15px] hover:bg-[#a52c2c] rounded-full transition duration-300"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Navbar;