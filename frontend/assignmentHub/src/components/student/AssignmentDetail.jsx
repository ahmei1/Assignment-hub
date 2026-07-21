import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { pageVariants } from "../../lib/motion";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Loader2,
  Lock,
  Trophy,
  UploadCloud,
  User,
} from "lucide-react";
import Loader from "../Loader";

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

const AssignmentDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [note, setNote] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/assignments/${id}`);
      setDetails(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssignmentDetails();
  }, [id]);

  // Once we know the id of the student's existing submission (if any), fetch
  // its full details so they can review/download what they submitted before
  // deciding to replace it.
  useEffect(() => {
    if (!details?.submissionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMySubmission(null);
      return;
    }

    const fetchMySubmission = async () => {
      try {
        setSubmissionLoading(true);
        const response = await api.get(
          `/submissions/${details.submissionId}`,
        );
        setMySubmission(response.data.data);
        // Pre-fill the notes and reg number so editing feels like editing,
        // not starting from a blank form. The file input can't be
        // pre-filled (browsers block that for security), so the file must
        // be re-chosen.
        setNote(response.data.data.notes || "");
        setRegNumber(response.data.data.regNumber || "");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Couldn’t load your previous submission.",
        );
      } finally {
        setSubmissionLoading(false);
      }
    };

    fetchMySubmission();
  }, [details?.submissionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      details?.submissionStatus === "graded" ||
      mySubmission?.status === "graded"
    ) {
      toast.error(
        "This submission has already been graded and can no longer be edited.",
      );
      return;
    }

    if (!regNumber.trim()) {
      toast.error("Please enter your registration number / school ID.");
      return;
    }

    if (!file) {
      toast.error("Please choose a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", id);
    formData.append("regNumber", regNumber.trim());
    formData.append("notes", note);
    formData.append("file", file);

    try {
      setSubmitting(true);
      const response = await api.post("/submissions", formData);
      toast.success(response.data.message || "Submitted successfully!");

      // Reflect the fresh submission status without a full page refetch.
      const submission = response.data.data;
      setDetails((previous) => ({
        ...previous,
        submissionStatus: submission.status,
        submissionId: submission.id,
      }));
      setMySubmission(submission);

      // Reset the form — file inputs are uncontrolled, so bumping the key
      // forces the browser to remount it and clear the displayed filename.
      setNote("");
      setFile(null);
      setFileInputKey((key) => key + 1);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn’t submit your assignment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!details) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <FileText size={52} className="text-gray-500" />
        <h1 className="text-2xl font-bold text-white">
          Assignment not found
        </h1>
        <p className="max-w-md text-gray-400">
          This assignment doesn’t exist, or you may not be enrolled in its
          course.
        </p>
        <Link
          to="/studentDashboard/assignments"
          className="rounded-xl bg-[#41455E] px-5 py-3 font-semibold text-white transition hover:bg-[#555a78]"
        >
          Back to Assignments
        </Link>
      </div>
    );
  }

  const StatusIcon = statusIcons[details.submissionStatus] || Clock3;
  const statusStyle =
    statusStyles[details.submissionStatus] || statusStyles.pending;
  const isOverdue =
    new Date(details.dueDate) < new Date() &&
    details.submissionStatus === "pending";
  const alreadySubmitted = details.submissionStatus !== "pending";
  const isGraded =
    details.submissionStatus === "graded" || mySubmission?.status === "graded";
  const grade =
    mySubmission?.grade ?? details.grade ?? null;

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-full space-y-8 p-5 sm:p-8"
    >
      <Link
        to="/studentDashboard/assignments"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Assignments
      </Link>

      {/* Assignment header */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#303348] to-[#252736] shadow-xl">
        <div className="flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="rounded-2xl bg-[#969DD9]/15 p-4">
              <FileText size={34} className="text-[#B7BDF2]" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#969DD9]/15 px-3 py-1 text-xs font-bold tracking-wider text-[#B7BDF2]">
                  {details.course.code}
                </span>
                <span className="text-sm text-gray-400">
                  {details.course.name}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {details.title}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-gray-300">
                {details.description || "No description has been provided."}
              </p>

              {details.fileUrl && (
                <a
                  href={details.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Download size={16} />
                  Download assignment attachment
                </a>
              )}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
            <div className="rounded-2xl bg-white/5 p-4">
              <User size={20} className="mb-2 text-[#B7BDF2]" />
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Lecturer
              </p>
              <p className="mt-1 font-semibold text-white">
                {details.lecturer.name}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <CalendarDays size={20} className="mb-2 text-[#B7BDF2]" />
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Due date
              </p>
              <p className="mt-1 font-semibold text-white">
                {new Date(details.dueDate).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              {isOverdue && (
                <span className="mt-2 inline-block rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-bold text-red-300">
                  Overdue
                </span>
              )}
            </div>
            <div className="col-span-2 rounded-2xl bg-white/5 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
                Submission status
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle}`}
                >
                  <StatusIcon size={14} />
                  {details.submissionStatus}
                </span>
                {isGraded && grade !== null && (
                  <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#969DD9]/20 px-3 py-1.5 text-xs font-bold text-[#B7BDF2]">
                    <Trophy size={14} />
                    Grade: {grade}/100
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing submission */}
      {details.submissionId && (
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <FileCheck2 size={24} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your current submission
                </h2>
                {mySubmission && (
                  <p className="text-sm text-gray-500">
                    Submitted{" "}
                    {new Date(mySubmission.submittedAt).toLocaleDateString(
                      undefined,
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </p>
                )}
              </div>
            </div>

            {mySubmission && (
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                  statusStyles[mySubmission.status] || statusStyles.pending
                }`}
              >
                {mySubmission.status}
              </span>
            )}
          </div>

          {submissionLoading ? (
            <p className="text-sm text-gray-500">
              Loading your submission...
            </p>
          ) : mySubmission ? (
            <div className="space-y-4">
              {isGraded && grade !== null && (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-2.5">
                      <Trophy size={20} className="text-blue-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Your grade
                      </p>
                      <p className="text-sm text-blue-800">
                        Graded by your lecturer
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-800">
                    {grade}
                    <span className="text-base font-semibold text-blue-500">
                      /100
                    </span>
                  </p>
                </div>
              )}
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Registration number / School ID
                </p>
                <p className="text-sm leading-6 text-gray-700">
                  {mySubmission.regNumber || "Not provided."}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                  Notes
                </p>
                <p className="text-sm leading-6 text-gray-700">
                  {mySubmission.notes || "No notes were added."}
                </p>
              </div>
              <a
                href={mySubmission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#252736] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#41455E]"
              >
                <Download size={17} />
                Download my submission
              </a>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Couldn’t load your previous submission.
            </p>
          )}
        </section>
      )}

      {/* Submission form — hidden once graded */}
      {isGraded ? (
        <section className="rounded-3xl border border-white/10 bg-[#252736] p-6 shadow-xl sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white/5 p-3">
              <Lock size={24} className="text-[#B7BDF2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Submission locked
              </h2>
              <p className="mt-2 leading-7 text-gray-400">
                This assignment has been graded, so you can no longer edit or
                replace your submission. You can still review your submitted
                file and grade above.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#252736] p-3">
              <UploadCloud size={24} className="text-[#B7BDF2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {alreadySubmitted
                  ? "Update your submission"
                  : "Submit your work"}
              </h2>
              {alreadySubmitted && (
                <p className="text-sm text-gray-500">
                  You’ve already submitted this assignment. Uploading a new
                  file will replace your previous submission.
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="regNumber"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Registration number / School ID
              </label>
              <input
                id="regNumber"
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. REG-2024-0001"
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any notes for your lecturer..."
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="file"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Your file
              </label>
              <input
                key={fileInputKey}
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full rounded-2xl border border-gray-200 text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-[#252736] file:px-4 file:py-2.5 file:font-semibold file:text-white file:transition hover:file:bg-[#41455E]"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3 font-semibold text-white transition duration-300 hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : alreadySubmitted ? (
                "Resubmit Assignment"
              ) : (
                "Submit Assignment"
              )}
            </button>
          </form>
        </section>
      )}
    </motion.main>
  );
};

export default AssignmentDetail;
