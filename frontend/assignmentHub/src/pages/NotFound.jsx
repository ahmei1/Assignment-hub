import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Home, SearchX } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const NotFound = () => {
  const { user } = useAuth();

  const homeLink = user
    ? user.role === "student"
      ? "/studentDashboard"
      : "/lecturerDashboard"
    : "/";

  const homeLabel = user ? "Back to dashboard" : "Back to home";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#303348] via-[#252736] to-[#1c1e2b] text-white">
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#969DD9]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#41455E]/50 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="rounded-xl bg-white/10 p-2">
            <GraduationCap size={20} className="text-[#B7BDF2]" />
          </div>
          <span className="font-[Syne] text-lg font-bold tracking-tight">
            Assignment Hub
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-lg"
        >
          <div className="mx-auto mb-8 inline-flex rounded-2xl bg-white/5 p-4">
            <SearchX size={36} className="text-[#B7BDF2]" />
          </div>

          <p className="font-[Syne] text-7xl font-bold tracking-tight text-[#969DD9] sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 font-[Syne] text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-400 sm:text-lg">
            This page doesn’t exist — or it moved. Let’s get you back to
            something useful.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={homeLink}
              className="inline-flex items-center gap-2 rounded-xl bg-[#969DD9] px-6 py-3.5 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
            >
              <Home size={18} />
              {homeLabel}
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              <ArrowLeft size={18} />
              Go back
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 px-5 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Assignment Hub
      </footer>
    </div>
  );
};

export default NotFound;
