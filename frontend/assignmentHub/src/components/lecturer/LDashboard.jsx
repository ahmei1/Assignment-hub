import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookCheck,
  BookOpenText,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FilePlus2,
  NotebookText,
  Users,
} from "lucide-react";
import api from "../../lib/api";
import Loader from "../Loader";
import LecturerAssignmentCalendar from "./LecturerAssignmentCalendar";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const statusStyles = {
  submitted: "bg-emerald-100 text-emerald-700",
  late: "bg-red-100 text-red-700",
  graded: "bg-blue-100 text-blue-700",
};

const statusIcons = {
  submitted: CheckCircle2,
  late: Clock3,
  graded: CheckCircle2,
};

const LDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/dashboard/lecturer");
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

  const {
    stats: dashboardStats,
    recentAssignments = [],
    recentSubmissions = [],
  } = dashboard;

  const stats = [
    {
      id: 1,
      icon: BookOpenText,
      title: "Courses",
      value: dashboardStats.courses,
      description: "Currently teaching",
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
      title: "Submissions",
      value: dashboardStats.submissions,
      description: "Received from students",
      color: "text-emerald-300",
      background: "bg-emerald-400/10",
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
              Lecturer overview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Manage your courses with ease
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-gray-400">
              Keep track of your assignments, review incoming submissions,
              and see what’s due at a glance.
            </p>
          </div>
          <Link
            to="/lecturerDashboard/createAssignment"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#969DD9] px-5 py-3 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
          >
            <FilePlus2 size={18} />
            Create assignment
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
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
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

      <LecturerAssignmentCalendar />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#646B9E]">
                Activity
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Recent submissions
              </h2>
            </div>
            <BookCheck size={27} className="text-[#646B9E]" />
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <BookCheck size={46} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                No submissions yet
              </h3>
              <p className="mt-2 text-gray-500">
                Student submissions will show up here as they come in.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="divide-y divide-gray-100"
            >
              {recentSubmissions.map((submission) => {
                const StatusIcon = statusIcons[submission.status] || Clock3;
                const statusStyle =
                  statusStyles[submission.status] || statusStyles.submitted;

                return (
                  <motion.article
                    key={submission.id}
                    variants={staggerItem}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="rounded-xl bg-indigo-50 p-3">
                        <Users size={21} className="text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900">
                          {submission.student}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {submission.assignment}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(submission.submittedAt).toLocaleDateString(
                          undefined,
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle}`}
                      >
                        <StatusIcon size={14} />
                        {submission.status}
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
                Coursework
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Your assignments
              </h2>
            </div>
            <NotebookText size={27} className="text-[#B7BDF2]" />
          </div>

          {recentAssignments.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <NotebookText size={40} className="mb-3 text-gray-500" />
              <p className="text-gray-400">
                You haven’t created any assignments yet.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="my-6 flex-1 space-y-3"
            >
              {recentAssignments.map((assignment) => (
                <motion.div
                  key={assignment.id}
                  variants={staggerItem}
                  className="rounded-2xl bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {assignment.title}
                      </p>
                      <p className="truncate text-sm text-gray-400">
                        {assignment.course}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#969DD9]/15 px-2.5 py-1 text-xs font-bold text-[#B7BDF2]">
                      <Users size={13} />
                      {assignment.submissionsCount}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Due{" "}
                    {new Date(assignment.dueDate).toLocaleDateString(
                      undefined,
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          <Link
            to="/lecturerDashboard/createAssignment"
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Create assignment
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </motion.main>
  );
};

export default LDashboard;
