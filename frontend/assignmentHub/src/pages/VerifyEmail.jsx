import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, MailCheck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/layouts/AuthLayout";
import { useAuth } from "../context/AuthProvider";
import api from "../lib/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email")?.trim() || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "student" ? "/studentDashboard" : "/lecturerDashboard", {
        replace: true,
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const verify = async (event) => {
    event.preventDefault();
    if (!email) return toast.error("Return to registration and enter your email.");

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-email", { email, code });
      const verifiedUser = response.data.data.user;
      login(verifiedUser);
      toast.success("Email verified. Welcome to Assignment Hub!");
      navigate(
        verifiedUser.role === "student" ? "/studentDashboard" : "/lecturerDashboard",
        { replace: true },
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email || cooldown > 0) return;
    try {
      setResending(true);
      const response = await api.post("/auth/resend-verification", { email });
      setCooldown(60);
      toast.success(response.data.message);
    } catch (error) {
      const retryAfter = Number(error.response?.headers?.["retry-after"] || 0);
      if (retryAfter) setCooldown(retryAfter);
      toast.error(error.response?.data?.message || "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#969DD9]/15 text-[#646B9E]">
            <MailCheck size={28} />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the six-digit code sent to
          </p>
          <p className="mt-1 break-all text-sm font-semibold text-gray-800">
            {email || "your email address"}
          </p>
        </div>

        <form onSubmit={verify} className="space-y-5">
          <div>
            <label htmlFor="verification-code" className="mb-2 block text-sm font-semibold text-gray-700">
              Verification code
            </label>
            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6 || !email}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3.5 font-semibold text-white transition hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            {loading ? "Verifying..." : "Verify and continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Didn’t receive it?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={resending || cooldown > 0 || !email}
            className="inline-flex items-center gap-1 font-semibold text-[#646B9E] hover:text-[#252736] disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {resending && <RefreshCw size={14} className="animate-spin" />}
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          <Link to="/register" className="font-semibold text-[#646B9E] hover:text-[#252736]">
            Use a different email
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
