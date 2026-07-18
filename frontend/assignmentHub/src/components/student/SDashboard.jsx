import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookCheck,
  BookOpenText,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock3,
  NotebookText,
  Target,
  Timer,
} from "lucide-react";
import api from "../../lib/api";
import Loader from "../Loader";
import AssignmentCalendar from "./AssignmentCalendar";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const SDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/dashboard/student");
        setDashboard(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "We couldn’t load your dashboard. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  if (error || !dashboard) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <CircleAlert size={52} className="mb-4 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Dashboard unavailable</h1>
        <p className="mt-2 max-w-md text-gray-400">
          {error || "No dashboard information is available."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-[#41455E] px-5 py-3 font-semibold text-white transition hover:bg-[#555a78]"
        >
          Try again
        </button>
      </div>
    );
  }

  const { stats: dashboardStats, deadlines = [], progress = 0 } = dashboard;
  const safeProgress = Math.min(100, Math.max(0, progress));

  const stats = [
    {
      id: 1,
      icon: BookOpenText,
      title: "Courses",
      value: dashboardStats.courses,
      description: "Currently enrolled",
      color: "text-sky-300",
      background: "bg-sky-400/10",
    },
    {
      id: 2,
      icon: NotebookText,
      title: "Assignments",
      value: dashboardStats.assignments,
      description: "Across all courses",
      color: "text-violet-300",
      background: "bg-violet-400/10",
    },
    {
      id: 3,
      icon: BookCheck,
      title: "Submitted",
      value: dashboardStats.submitted,
      description: "Work completed",
      color: "text-emerald-300",
      background: "bg-emerald-400/10",
    },
    {
      id: 4,
      icon: Timer,
      title: "Due Soon",
      value: dashboardStats.dueSoon,
      description: "Next seven days",
      color: "text-amber-300",
      background: "bg-amber-400/10",
    },
  ];

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-full space-y-8 p-5 sm:p-8"
    >
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#303348] to-[#252736] shadow-xl">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#B7BDF2]">
              Student overview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Keep your coursework on track
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-gray-400">
              Review upcoming deadlines, monitor your progress, and quickly
              access your active courses.
            </p>
          </div>
          <Link
            to="/studentDashboard/assignments"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#969DD9] px-5 py-3 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
          >
            View assignments
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#969DD9]">
            At a glance
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Dashboard overview
          </h2>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.article
                key={stat.id}
                variants={staggerItem}
                className="rounded-3xl border border-white/10 bg-[#252736] p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-2xl p-3 ${stat.background}`}>
                    <Icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <span className="text-4xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  {stat.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      <AssignmentCalendar />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#646B9E]">
                Schedule
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Upcoming deadlines
              </h2>
            </div>
            <CalendarClock size={27} className="text-[#646B9E]" />
          </div>

          {deadlines.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <CheckCircle2
                size={46}
                className="mx-auto mb-4 text-emerald-500"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                You’re all caught up
              </h3>
              <p className="mt-2 text-gray-500">
                There are no upcoming assignments to display.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="divide-y divide-gray-100"
            >
              {deadlines.map((deadline) => {
                const submitted = deadline.status === "submitted";

                return (
                  <motion.article
                    key={deadline.id}
                    variants={staggerItem}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className={`rounded-xl p-3 ${
                          submitted ? "bg-emerald-50" : "bg-amber-50"
                        }`}
                      >
                        {submitted ? (
                          <CheckCircle2
                            size={21}
                            className="text-emerald-600"
                          />
                        ) : (
                          <Clock3 size={21} className="text-amber-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900">
                          {deadline.assignment}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {deadline.course}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(deadline.dueDate).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          submitted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {deadline.status}
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>

        <section className="flex flex-col rounded-3xl border border-white/10 bg-[#252736] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#969DD9]">
                Completion
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Overall progress
              </h2>
            </div>
            <Target size={27} className="text-[#B7BDF2]" />
          </div>

          <div className="my-9 flex flex-1 items-center justify-center">
            <div
              className="relative grid h-44 w-44 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#969DD9 ${safeProgress}%, rgba(255,255,255,0.08) ${safeProgress}% 100%)`,
              }}
            >
              <div className="grid h-36 w-36 place-items-center rounded-full bg-[#252736]">
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">
                    {safeProgress}%
                  </span>
                  <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                    Complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center leading-6 text-gray-400">
            You have submitted{" "}
            <span className="font-semibold text-white">
              {dashboardStats.submitted} of {dashboardStats.assignments}
            </span>{" "}
            assignments.
          </p>
          <Link
            to="/studentDashboard/mycourses"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Browse courses
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </motion.main>
  );
};

export default SDashboard;
