import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Download,
  FilePlus2,
  FileText,
  KeyRound,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Loader from "../Loader";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const LecturerCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editingCourse, setEditingCourse] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: "", code: "", description: "", joinPassword: "" });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${id}`);
        setData(response.data.data);
      } catch (error) {
        setData(null);
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <Loader />;

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <BookOpen size={52} className="text-gray-500" />
        <h1 className="text-2xl font-bold text-white">
          Course information unavailable
        </h1>
        <p className="max-w-md text-gray-400">
          We could not load this course. It may not exist, or you may not own
          it.
        </p>
        <Link
          to="/lecturerDashboard/courses"
          className="rounded-xl bg-[#41455E] px-5 py-3 font-semibold text-white transition hover:bg-[#555a78]"
        >
          Back to My Courses
        </Link>
      </div>
    );
  }

  const assignments = data.assignments ?? [];

  const deleteAssignment = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const response = await api.delete(`/assignments/${deleteTarget.id}`);
      setData((current) => ({
        ...current,
        assignments: current.assignments.filter((assignment) => assignment.id !== deleteTarget.id),
        assignmentsCount: Math.max(0, (current.assignmentsCount ?? 1) - 1),
      }));
      toast.success(response.data.message || "Assignment deleted.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn’t delete the assignment.");
    } finally {
      setDeleting(false);
    }
  };

  const openCourseEditor = () => {
    setCourseForm({ name: data.name, code: data.code, description: data.description || "", joinPassword: "" });
    setEditingCourse(true);
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    try {
      const payload = { name: courseForm.name, code: courseForm.code, description: courseForm.description };
      if (courseForm.joinPassword.trim()) payload.joinPassword = courseForm.joinPassword;
      const response = await api.put(`/courses/${data.id}`, payload);
      setData((current) => ({ ...current, ...response.data.data, assignments: current.assignments }));
      setEditingCourse(false);
      toast.success(response.data.message || "Course updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn’t update the course.");
    }
  };

  const removeCourse = async () => {
    try {
      setDeleting(true);
      const response = await api.delete(`/courses/${data.id}`);
      toast.success(response.data.message || "Course deleted.");
      navigate("/lecturerDashboard/courses", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn’t delete the course.");
      setDeleting(false);
    }
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-full space-y-8 p-5 sm:p-8"
    >
      <Link
        to="/lecturerDashboard/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to My Courses
      </Link>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#303348] to-[#252736] shadow-xl">
        <div className="flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="rounded-2xl bg-[#969DD9]/15 p-4">
              <BookOpen size={34} className="text-[#B7BDF2]" />
            </div>
            <div>
              <span className="mb-2 inline-block rounded-full bg-[#969DD9]/15 px-3 py-1 text-xs font-bold tracking-wider text-[#B7BDF2]">
                {data.code}
              </span>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {data.name}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-gray-300">
                {data.description || "No course description has been provided."}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto">
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <Users size={20} className="mb-2 text-[#B7BDF2]" />
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Students
                </p>
                <p className="mt-1 font-semibold text-white">
                  {data.studentsCount}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <ClipboardList size={20} className="mb-2 text-[#B7BDF2]" />
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Assignments
                </p>
                <p className="mt-1 font-semibold text-white">
                  {assignments.length}
                </p>
              </div>
            </div>
            {data.joinPassword && (
              <div className="flex items-center gap-3 rounded-2xl bg-[#969DD9]/15 px-4 py-3">
                <KeyRound size={18} className="shrink-0 text-[#B7BDF2]" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Join password
                  </p>
                  <p className="truncate font-mono font-semibold tracking-wide text-white">
                    {data.joinPassword}
                  </p>
                </div>
              </div>
            )}
            <Link
              to="/lecturerDashboard/createAssignment"
              state={{ courseId: data.id }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#969DD9] px-5 py-3 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
            >
              <FilePlus2 size={18} />
              Add assignment
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={openCourseEditor} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 font-semibold text-white hover:bg-white/10"><Pencil size={17} />Edit course</button>
              <button type="button" onClick={() => setDeletingCourse(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 px-4 py-2.5 font-semibold text-red-300 hover:bg-red-500/10"><Trash2 size={17} />Delete</button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#969DD9]">
              Coursework
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              Assignments
            </h2>
          </div>
          <span className="text-sm text-gray-400">
            {assignments.length}{" "}
            {assignments.length === 1 ? "assignment" : "assignments"}
          </span>
        </div>

        {assignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <ClipboardList size={44} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold text-white">
              No assignments yet
            </h3>
            <p className="mt-2 text-gray-400">
              Create an assignment for this course to start collecting student
              work.
            </p>
            <Link
              to="/lecturerDashboard/createAssignment"
              state={{ courseId: data.id }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#969DD9] px-5 py-3 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
            >
              <FilePlus2 size={18} />
              Create assignment
            </Link>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            {assignments.map((assignment) => (
              <motion.article
                key={assignment.id}
                variants={staggerItem}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="rounded-xl bg-[#252736] p-3">
                    <FileText size={24} className="text-[#B7BDF2]" />
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                    <CalendarDays size={16} />
                    {new Date(assignment.dueDate).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {assignment.title}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-gray-600">
                  {assignment.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                    <Users size={14} />
                    {assignment.submissionsCount} submissions
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to="/lecturerDashboard/createAssignment"
                      state={{ courseId: data.id, assignment: { ...assignment, courseId: data.id } }}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(assignment)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    {assignment.fileUrl && (
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                      >
                        <Download size={16} />
                        File
                      </a>
                    )}
                    <Link
                      to={`/lecturerDashboard/submissions?assignmentId=${assignment.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#252736] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#41455E]"
                    >
                      View submissions
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-assignment-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-5 inline-flex rounded-2xl bg-red-50 p-3 text-red-700"><Trash2 size={24} /></div>
            <h2 id="delete-assignment-title" className="text-2xl font-bold text-gray-900">Delete assignment?</h2>
            <p className="mt-3 leading-7 text-gray-600">
              “{deleteTarget.title}” and every student submission attached to it will be permanently deleted.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" disabled={deleting} onClick={deleteAssignment} className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={saveCourse} className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">Edit course</h2>
            <input required minLength={2} value={courseForm.name} onChange={(e) => setCourseForm((v) => ({ ...v, name: e.target.value }))} placeholder="Course name" className="w-full rounded-2xl border border-gray-200 p-4" />
            <input required minLength={2} value={courseForm.code} onChange={(e) => setCourseForm((v) => ({ ...v, code: e.target.value.toUpperCase() }))} placeholder="Course code" className="w-full rounded-2xl border border-gray-200 p-4" />
            <textarea rows={4} value={courseForm.description} onChange={(e) => setCourseForm((v) => ({ ...v, description: e.target.value }))} placeholder="Description" className="w-full rounded-2xl border border-gray-200 p-4" />
            <input type="password" minLength={4} value={courseForm.joinPassword} onChange={(e) => setCourseForm((v) => ({ ...v, joinPassword: e.target.value }))} placeholder="New join password (leave blank to keep current)" className="w-full rounded-2xl border border-gray-200 p-4" />
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditingCourse(false)} className="rounded-xl border px-4 py-2.5 font-semibold">Cancel</button><button type="submit" className="rounded-xl bg-[#252736] px-5 py-2.5 font-semibold text-white">Save changes</button></div>
          </form>
        </div>
      )}

      {deletingCourse && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <Trash2 size={28} className="text-red-600" /><h2 className="mt-4 text-2xl font-bold">Delete this course?</h2>
            <p className="mt-3 leading-7 text-gray-600">This permanently deletes the course, enrollments, assignments, submissions, and stored files.</p>
            <div className="mt-7 flex justify-end gap-3"><button type="button" disabled={deleting} onClick={() => setDeletingCourse(false)} className="rounded-xl border px-4 py-2.5 font-semibold">Cancel</button><button type="button" disabled={deleting} onClick={removeCourse} className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white disabled:opacity-60">{deleting ? "Deleting..." : "Delete permanently"}</button></div>
          </div>
        </div>
      )}
    </motion.main>
  );
};

export default LecturerCourseDetails;
