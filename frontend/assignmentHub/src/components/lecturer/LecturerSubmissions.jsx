import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookCheck,
  Download,
  Filter,
  Loader2,
  Search,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Loader from "../Loader";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const statusStyles = {
  submitted: "bg-emerald-100 text-emerald-700",
  late: "bg-red-100 text-red-700",
  graded: "bg-blue-100 text-blue-700",
};

const LecturerSubmissions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const assignmentFilter = searchParams.get("assignmentId") || "";

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [grading, setGrading] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [savingGrade, setSavingGrade] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = assignmentFilter
          ? { assignmentId: assignmentFilter }
          : undefined;
        const [subsRes, assignmentsRes] = await Promise.all([
          api.get("/submissions", { params }),
          api.get("/assignments"),
        ]);
        setSubmissions(subsRes.data.data);
        setAssignments(assignmentsRes.data.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Couldn’t load submissions.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((s) => {
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      const haystack =
        `${s.student?.name ?? ""} ${s.student?.email ?? ""} ${s.regNumber ?? ""} ${s.assignment?.title ?? ""} ${s.assignment?.course?.name ?? ""}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [submissions, search, statusFilter]);

  const openGradeModal = (submission) => {
    setGrading(submission);
    setGradeValue(
      submission.grade !== null && submission.grade !== undefined
        ? String(submission.grade)
        : "",
    );
  };

  const closeGradeModal = () => {
    if (savingGrade) return;
    setGrading(null);
    setGradeValue("");
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    const grade = Number(gradeValue);
    if (Number.isNaN(grade) || grade < 0 || grade > 100) {
      toast.error("Enter a grade between 0 and 100.");
      return;
    }

    try {
      setSavingGrade(true);
      const response = await api.put(`/submissions/${grading.id}/grade`, {
        grade,
      });
      const updated = response.data.data;
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
      toast.success(response.data.message || "Submission graded.");
      setGrading(null);
      setGradeValue("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn’t save the grade.",
      );
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-full space-y-8 p-5 sm:p-8"
    >
      <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#303348] to-[#252736] p-6 shadow-xl sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-4 inline-flex rounded-2xl bg-[#969DD9]/15 p-3">
            <BookCheck size={30} className="text-[#B7BDF2]" />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Submissions
          </h1>
          <p className="mt-2 max-w-xl leading-7 text-gray-400">
            Review student work, download files, and assign grades.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-[#252736] p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, reg number, assignment..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#969DD9]"
          />
        </div>

        <div className="relative">
          <Filter
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={assignmentFilter}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set("assignmentId", e.target.value);
              else next.delete("assignmentId");
              setSearchParams(next);
            }}
            className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#969DD9]"
          >
            <option value="" className="bg-[#252736]">
              All assignments
            </option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#252736]">
                {a.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#969DD9]"
          >
            <option value="all" className="bg-[#252736]">
              All statuses
            </option>
            <option value="submitted" className="bg-[#252736]">
              Submitted
            </option>
            <option value="late" className="bg-[#252736]">
              Late
            </option>
            <option value="graded" className="bg-[#252736]">
              Graded
            </option>
          </select>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
          <BookCheck size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-white">
            {submissions.length === 0
              ? "No submissions yet"
              : "No matching submissions"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">
            {submissions.length === 0
              ? "Student submissions will appear here once they start handing in work."
              : "Try adjusting your search or filters."}
          </p>
        </section>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          <div className="hidden grid-cols-[1.2fr_1.4fr_0.8fr_0.7fr_1fr] gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 lg:grid">
            <span>Student</span>
            <span>Assignment</span>
            <span>Submitted</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.map((submission) => (
              <motion.article
                key={submission.id}
                variants={staggerItem}
                className="grid grid-cols-1 gap-4 px-6 py-5 transition hover:bg-gray-50 lg:grid-cols-[1.2fr_1.4fr_0.8fr_0.7fr_1fr] lg:items-center"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-xl bg-indigo-50 p-2.5">
                    <User size={18} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900">
                      {submission.student?.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {submission.regNumber
                        ? `ID: ${submission.regNumber}`
                        : submission.student?.email}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {submission.assignment?.title}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {submission.assignment?.course?.name}
                  </p>
                </div>

                <p className="text-sm font-medium text-gray-600">
                  {new Date(submission.submittedAt).toLocaleDateString(
                    undefined,
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                      statusStyles[submission.status] || statusStyles.submitted
                    }`}
                  >
                    {submission.status}
                    {submission.status === "graded" &&
                      submission.grade !== null &&
                      ` · ${submission.grade}`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  {submission.fileUrl && (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                    >
                      <Download size={15} />
                      File
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => openGradeModal(submission)}
                    className="rounded-xl bg-[#252736] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#41455E]"
                  >
                    {submission.status === "graded" ? "Edit grade" : "Grade"}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {grading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={closeGradeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#646B9E]">
                    Grade
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {grading.student?.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {grading.assignment?.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeGradeModal}
                  disabled={savingGrade}
                  aria-label="Close"
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {grading.notes && (
                <div className="mb-5 rounded-2xl bg-gray-50 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Student notes
                  </p>
                  <p className="text-sm leading-6 text-gray-700">
                    {grading.notes}
                  </p>
                </div>
              )}

              <form onSubmit={handleGrade} className="space-y-5">
                <div>
                  <label
                    htmlFor="grade-input"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Grade (0–100)
                  </label>
                  <input
                    id="grade-input"
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeGradeModal}
                    disabled={savingGrade}
                    className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingGrade}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#252736] px-5 py-3 font-semibold text-white transition hover:bg-[#41455E] disabled:opacity-60"
                  >
                    {savingGrade ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save grade"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default LecturerSubmissions;
