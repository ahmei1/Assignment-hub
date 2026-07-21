import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Someone already logged in has no business seeing the login form again.
  useEffect(() => {
    if (user) {
      navigate(
        user.role === "student" ? "/studentDashboard" : "/lecturerDashboard",
        { replace: true },
      );
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const doLogin = async () => {
      try {
        setLoading(true);
        const response = await api.post("/auth/login", { email, password });
        const loggedInUser = response.data.data.user;

        login(loggedInUser);
        toast.success("Welcome back!");
        navigate(
          loggedInUser.role === "student"
            ? "/studentDashboard"
            : "/lecturerDashboard",
        );
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    doLogin();
  };

  return (
    <AuthLayout>
      <div className="w-full rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Log in to continue to your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-12 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3.5 font-semibold text-white transition duration-300 hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#646B9E] hover:text-[#252736]"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
