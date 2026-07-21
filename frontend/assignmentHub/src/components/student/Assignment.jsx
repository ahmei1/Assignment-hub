import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  NotebookText,
  Trophy,
  User,
} from "lucide-react";
import api from "../../lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  submitted: "bg-emerald-100 text-emerald-700",
  late: "bg-red-100 text-red-700",
  graded: "bg-blue-100 text-blue-700",
};

const statusIcons = {
  pending: Clock3,
  submitted: CheckCircle2,
  late: Clock3,
  graded: CheckCircle2,
};

const actionLabels = {
  pending: "Submit Assignment",
  submitted: "View Submission",
  late: "View Submission",
  graded: "View Grade",
};

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const getAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/assignments");
      setAssignments(response.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "something went wrong please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getAssignments();
  }, []);

  const availableStatuses = Array.from(
    new Set(assignments.map((assignment) => assignment.submissionStatus)),
  );
  const filterOptions = ["all", ...availableStatuses];
  const filteredAssignments =
    statusFilter === "all"
      ? assignments
      : assignments.filter(
          (assignment) => assignment.submissionStatus === statusFilter,
        );

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-full space-y-8 p-5 sm:p-8"
    >
      {/* Header */}
      <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#303348] to-[#252736] p-6 shadow-xl sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-4 inline-flex rounded-2xl bg-[#969DD9]/15 p-3">
            <NotebookText size={30} className="text-[#B7BDF2]" />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Assignments
          </h1>
          <p className="mt-2 max-w-xl leading-7 text-gray-400">
            All the assignments from your enrolled courses that need to be
            settled.
          </p>
        </div>

        {!loading && assignments.length > 0 && (
          <span className="text-sm text-gray-400">
            {assignments.length}{" "}
            {assignments.length === 1 ? "assignment" : "assignments"}
          </span>
        )}
      </section>

      {/* Status filter */}
      {!loading && assignments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatusFilter(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                statusFilter === option
                  ? "bg-[#969DD9] text-[#252736]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* States */}
      {loading ? (
        <Loader />
      ) : assignments.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/3 px-6 py-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-white">
            No assignments yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">
            Assignments from your enrolled courses will show up here.
          </p>
        </section>
      ) : filteredAssignments.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/3 px-6 py-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-white">
            No {statusFilter} assignments
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">
            Try selecting a different filter.
          </p>
        </section>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredAssignments.map((assignment) => {
            const StatusIcon =
              statusIcons[assignment.submissionStatus] || Clock3;
            const statusStyle =
              statusStyles[assignment.submissionStatus] || statusStyles.pending;
            const actionLabel =
              actionLabels[assignment.submissionStatus] ||
              "Submit Assignment";

            return (
              <motion.article
                key={assignment.id}
                variants={staggerItem}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="h-2 bg-gradient-to-r from-[#969DD9] to-[#41455E]" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-[#252736] p-3">
                        <FileText className="text-[#B7BDF2]" size={24} />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700">
                          {assignment.course.code}
                        </span>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-gray-900">
                          {assignment.title}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle}`}
                    >
                      <StatusIcon size={14} />
                      {assignment.submissionStatus}
                    </span>
                  </div>

                  <p className="line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                    {assignment.description ||
                      "No description has been provided."}
                  </p>

                  <div className="my-5 space-y-3 border-y border-gray-100 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                      <User size={17} className="text-[#646B9E]" />
                      <span className="font-medium">
                        {assignment.lecturer.name}
                      </span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="truncate text-gray-500">
                        {assignment.course.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays size={17} className="text-[#646B9E]" />
                      <span>
                        Due{" "}
                        <strong>
                          {new Date(assignment.dueDate).toLocaleDateString(
                            undefined,
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </strong>
                      </span>
                    </div>
                    {assignment.submissionStatus === "graded" &&
                      assignment.grade !== null &&
                      assignment.grade !== undefined && (
                        <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-2.5 text-blue-800">
                          <Trophy size={17} className="text-blue-600" />
                          <span>
                            Grade: <strong>{assignment.grade}/100</strong>
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="mb-4">
                    {assignment.fileUrl ? (
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#252736] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#41455E]"
                      >
                        <Download size={17} />
                        Download attachment
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No attachment provided
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/studentDashboard/assignments/${assignment.id}`}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3 font-semibold text-white transition duration-300 hover:bg-[#41455E]"
                  >
                    {assignment.submissionStatus === "pending" ? (
                      <>
                        {actionLabel}
                        <ArrowRight
                          size={18}
                          className="transition group-hover:translate-x-1"
                        />
                      </>
                    ) : (
                      <>
                        <Eye size={18} />
                        {actionLabel}
                      </>
                    )}
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      )}
    </motion.main>
  );
};

export default Assignment;
