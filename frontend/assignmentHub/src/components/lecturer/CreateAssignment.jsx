import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FilePlus2,
  Loader2,
  Paperclip,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Loader from "../Loader";
import { pageVariants } from "../../lib/motion";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCourseId = location.state?.courseId
    ? String(location.state.courseId)
    : "";

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState(preselectedCourseId);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await api.get("/courses");
        const list = response.data.data;
        setCourses(list);

        if (
          preselectedCourseId &&
          list.some((c) => String(c.id) === preselectedCourseId)
        ) {
          setCourseId(preselectedCourseId);
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Couldn’t load your courses.",
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [preselectedCourseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !dueDate || !courseId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("dueDate", new Date(dueDate).toISOString());
    formData.append("courseId", courseId);
    if (file) formData.append("file", file);

    try {
      setSubmitting(true);
      const response = await api.post("/assignments", formData);
      toast.success(response.data.message || "Assignment created.");
      navigate(`/lecturerDashboard/courses/${courseId}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn’t create the assignment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCourses) return <Loader />;

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
        Back to courses
      </Link>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#303348] to-[#252736] p-6 shadow-xl sm:p-8">
        <div className="mb-2 inline-flex rounded-2xl bg-[#969DD9]/15 p-3">
          <FilePlus2 size={28} className="text-[#B7BDF2]" />
        </div>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Create assignment
        </h1>
        <p className="mt-2 max-w-2xl leading-7 text-gray-400">
          Publish a new assignment for one of your courses. Students enrolled
          in that course will see it immediately.
        </p>
      </section>

      {courses.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
          <FilePlus2 size={44} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-white">
            Create a course first
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">
            You need at least one course before you can publish an assignment.
          </p>
          <Link
            to="/lecturerDashboard/courses"
            className="mt-6 inline-flex rounded-xl bg-[#969DD9] px-5 py-3 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
          >
            Go to My Courses
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="assignment-course"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Course
              </label>
              <select
                id="assignment-course"
                required
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} — {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="assignment-title"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Title
              </label>
              <input
                id="assignment-title"
                type="text"
                required
                minLength={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Week 3 Lab Report"
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="assignment-description"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Description
              </label>
              <textarea
                id="assignment-description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task, requirements, and any formatting rules."
                className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="assignment-due"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Due date
              </label>
              <input
                id="assignment-due"
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="assignment-file"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Attachment{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              {file ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Paperclip size={18} className="shrink-0 text-[#646B9E]" />
                    <span className="truncate text-sm font-medium text-gray-800">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    aria-label="Remove file"
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="assignment-file"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:border-[#969DD9] hover:bg-[#969DD9]/5"
                >
                  <Paperclip size={22} className="text-[#646B9E]" />
                  <span className="text-sm font-semibold text-gray-700">
                    Click to upload a brief or resource file
                  </span>
                  <span className="text-xs text-gray-400">
                    PDF, DOC, DOCX, ZIP, images, etc.
                  </span>
                  <input
                    id="assignment-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3.5 font-semibold text-white transition hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FilePlus2 size={18} />
                  Publish assignment
                </>
              )}
            </button>
          </form>
        </section>
      )}
    </motion.main>
  );
};

export default CreateAssignment;
