import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import api from "../lib/api";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Presentation,
  User,
  UserPlus,
} from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";

const Register = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  // Someone already logged in has no business seeing the register form again.
  useEffect(() => {
    if (user && !authLoading) {
      navigate(
        user.role === "student" ? "/studentDashboard" : "/lecturerDashboard",
        { replace: true },
      );
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select whether you’re a student or a lecturer.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don’t match.");
      return;
    }

    const registerNew = async () => {
      try {
        setLoading(true);
        const response = await api.post("/auth/register", {
          name: `${fname} ${lname}`,
          email,
          password,
          role,
        });

        const verificationEmail = response.data.data.email;
        toast.success(response.data.message || "Verification code sent!");
        navigate(`/verify-email?email=${encodeURIComponent(verificationEmail)}`);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    registerNew();
  };

  return (
    <>
      <div className="w-full rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Join Assignment Hub to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fname"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                First name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="fname"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Mike"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lname"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Last name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="lname"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Albert"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                />
              </div>
            </div>
          </div>

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

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                />
              </div>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-gray-700">
              I am a...
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                aria-pressed={role === "student"}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition ${
                  role === "student"
                    ? "border-[#969DD9] bg-[#969DD9]/10 text-[#252736]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <GraduationCap size={22} />
                <span className="text-sm font-semibold">Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("lecturer")}
                aria-pressed={role === "lecturer"}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition ${
                  role === "lecturer"
                    ? "border-[#969DD9] bg-[#969DD9]/10 text-[#252736]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Presentation size={22} />
                <span className="text-sm font-semibold">Lecturer</span>
              </button>
            </div>
          </div>

          {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <>
              <GoogleAuthButton role={role} />
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />or register with email<span className="h-px flex-1 bg-gray-200" />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3.5 font-semibold text-white transition duration-300 hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Register
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#646B9E] hover:text-[#252736]"
          >
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
