import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const Landing = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate(
        user.role === "student" ? "/studentDashboard" : "/lecturerDashboard",
        { replace: true },
      );
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-[#F4F5FA] text-[#252736]">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-20 border-b border-white/[0.06] bg-[#252736]/35 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
              <GraduationCap size={20} className="text-[#B7BDF2]" />
            </div>
            <span className="font-[Syne] text-lg font-bold tracking-tight text-white">
              Assignment Hub
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="interactive-lift inline-flex min-h-11 items-center rounded-xl bg-[#969DD9] px-4 py-2.5 text-sm font-semibold text-[#252736] shadow-lg shadow-[#969DD9]/10 hover:bg-[#B7BDF2]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — one composition */}
      <section className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-[#303348] via-[#252736] to-[#1c1e2b]">
        <div className="pointer-events-none absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-[#969DD9]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[24rem] w-[24rem] rounded-full bg-[#41455E]/50 blur-3xl" />

        {/* Soft grid atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B7BDF2]/15 bg-[#969DD9]/10 px-4 py-2 text-sm font-semibold text-[#D5D8F0]">
              <Sparkles size={16} className="text-amber-300" aria-hidden="true" />
              Study smarter. Smile more.
            </div>
            <p className="font-[Syne] text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Assignment Hub
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-semibold leading-snug text-[#D5D8F0] sm:text-3xl">
              Less stress. More done. A little more fun.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-gray-400 sm:text-lg">
              A calm workspace for students and lecturers to publish
              assignments, submit work, and track progress without the chaos.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="interactive-lift inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#969DD9] px-6 py-3.5 font-semibold text-[#252736] shadow-xl shadow-black/15 hover:bg-[#B7BDF2]"
              >
                Get started
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </motion.div>

          {/* Joyful original illustration with useful floating status cues */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[34rem]"
          >
            <div className="absolute inset-x-8 bottom-4 h-20 rounded-full bg-[#969DD9]/20 blur-3xl" aria-hidden="true" />
            <motion.img
              src="/illustrations/assignment-team.webp"
              alt="Two students celebrating while completing assignments together"
              width="1000"
              height="1000"
              fetchPriority="high"
              animate={{ y: [0, -9, 0], rotate: [0, 0.8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 h-auto w-full drop-shadow-[0_28px_35px_rgba(0,0,0,0.28)]"
            />

            <motion.div
              initial={{ opacity: 0, x: -16, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 180 }}
              className="absolute left-0 top-[18%] z-20 flex items-center gap-2 rounded-2xl border border-white/15 bg-[#252736]/85 px-3.5 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md sm:-left-5"
            >
              <CalendarDays size={18} className="text-amber-300" aria-hidden="true" />
              Deadline handled
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.72, type: "spring", stiffness: 180 }}
              className="absolute bottom-[15%] right-0 z-20 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/90 px-3.5 py-3 text-sm font-bold text-[#252736] shadow-xl backdrop-blur-md sm:-right-4"
            >
              <Trophy size={18} className="text-[#646B9E]" aria-hidden="true" />
              Nice work! +92
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Purpose — one job */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#646B9E]">
            Why it exists
          </p>
          <h2 className="mt-3 font-[Syne] text-3xl font-bold tracking-tight text-[#252736] sm:text-4xl">
            Less hunting for files. More time for learning.
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Assignment Hub keeps courses, submissions, and grades together so
            nobody has to dig through chats, email threads, or shared folders
            to know what’s due — or what’s done.
          </p>
        </motion.div>
      </section>

      {/* Two audiences — one job */}
      <section className="border-y border-[#252736]/8 bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-5 inline-flex rounded-2xl bg-[#252736] p-3">
              <BookOpenText size={24} className="text-[#B7BDF2]" />
            </div>
            <h3 className="font-[Syne] text-2xl font-bold text-[#252736]">
              For students
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Enroll in courses, see every deadline on a calendar, submit
              work with your school ID, and check grades the moment they’re
              released.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              {[
                "Clear upcoming deadlines",
                "Simple file submission & resubmits",
                "Grades locked and easy to review",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#646B9E]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <div className="mb-5 inline-flex rounded-2xl bg-[#252736] p-3">
              <ClipboardList size={24} className="text-[#B7BDF2]" />
            </div>
            <h3 className="font-[Syne] text-2xl font-bold text-[#252736]">
              For lecturers
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Create courses, publish assignments, collect submissions in one
              queue, and grade student work without leaving the hub.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              {[
                "Own your course library",
                "Publish assignments with attachments",
                "Review, download, and grade fast",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#646B9E]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#303348] to-[#252736] px-8 py-14 text-center sm:px-12"
        >
          <h2 className="font-[Syne] text-3xl font-bold text-white sm:text-4xl">
            Ready to organize your semester?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Create a free account as a student or lecturer and start in
            minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#969DD9] px-6 py-3.5 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
            >
              Sign up
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[#252736]/8 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-[#646B9E]" />
            <span className="font-[Syne] font-semibold text-[#252736]">
              Assignment Hub
            </span>
          </div>
          <p>© {new Date().getFullYear()} Assignment Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
