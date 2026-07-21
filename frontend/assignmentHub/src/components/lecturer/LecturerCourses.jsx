import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Loader from "../Loader";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const emptyForm = { name: "", code: "", description: "" };

const LecturerCourses = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCourses = courses.filter((course) => {
    const searchableText = `${course.name} ${course.code}`.toLowerCase();
    return searchableText.includes(normalizedSearch);
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses");
        setCourses(response.data.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Couldn’t load your courses.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const openModal = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (creating) return;
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.code.trim()) {
      toast.error("Course name and code are required.");
      return;
    }

    try {
      setCreating(true);
      const response = await api.post("/courses", {
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || undefined,
      });
      setCourses((prev) => [response.data.data, ...prev]);
      toast.success(response.data.message || "Course created.");
      setModalOpen(false);
      setForm(emptyForm);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn’t create the course.",
      );
    } finally {
      setCreating(false);
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
            <GraduationCap size={30} className="text-[#B7BDF2]" />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            My Courses
          </h1>
          <p className="mt-2 max-w-xl leading-7 text-gray-400">
            Manage the courses you teach and open any one to review its
            assignments.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-md">
          <label
            htmlFor="lecturer-course-search"
            className="block text-sm font-semibold text-gray-300"
          >
            Search your courses
          </label>
          <div className="relative">
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="lecturer-course-search"
              type="search"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-11 text-white outline-none transition placeholder:text-gray-500 focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              placeholder="Search by name or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear course search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={17} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#969DD9] px-5 py-3 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
          >
            <Plus size={18} />
            New course
          </button>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : filteredCourses.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-white">
            {courses.length === 0
              ? "You haven’t created any courses yet"
              : "No matching courses found"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">
            {courses.length === 0
              ? "Create your first course so students can enroll and receive assignments."
              : `We couldn’t find a course matching “${search}”. Try another name or code.`}
          </p>
          {courses.length === 0 ? (
            <button
              type="button"
              onClick={openModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#969DD9] px-5 py-3 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
            >
              <Plus size={18} />
              Create course
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 rounded-xl bg-[#41455E] px-5 py-3 font-semibold text-white transition hover:bg-[#555a78]"
            >
              Clear search
            </button>
          )}
        </section>
      ) : (
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#969DD9]">
                Teaching
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Course library
              </h2>
            </div>
            <span className="text-sm text-gray-400">
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "course" : "courses"}
            </span>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredCourses.map((course) => (
              <motion.article
                key={course.id}
                variants={staggerItem}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="h-2 bg-gradient-to-r from-[#969DD9] to-[#41455E]" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-5 flex items-start gap-4">
                    <div className="rounded-2xl bg-[#252736] p-3">
                      <BookOpen className="text-[#B7BDF2]" size={27} />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700">
                        {course.code}
                      </span>
                      <h3 className="mt-2 text-xl font-bold leading-snug text-gray-900">
                        {course.name}
                      </h3>
                    </div>
                  </div>

                  <p className="line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                    {course.description ||
                      "No course description has been provided."}
                  </p>

                  <div className="my-6 grid grid-cols-2 gap-3 border-y border-gray-100 py-5 text-sm text-gray-700">
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                      <ClipboardList size={17} className="text-[#646B9E]" />
                      <span>
                        <strong>{course.assignmentsCount}</strong> assignments
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                      <Users size={17} className="text-[#646B9E]" />
                      <span>
                        <strong>{course.studentsCount}</strong> students
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/lecturerDashboard/courses/${course.id}`}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3 font-semibold text-white transition duration-300 hover:bg-[#41455E]"
                  >
                    View Course
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#646B9E]">
                    New course
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Create a course
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  aria-label="Close"
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label
                    htmlFor="course-name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Course name
                  </label>
                  <input
                    id="course-name"
                    type="text"
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Introduction to Algorithms"
                    className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="course-code"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Course code
                  </label>
                  <input
                    id="course-code"
                    type="text"
                    required
                    minLength={2}
                    value={form.code}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="e.g. CS101"
                    className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 uppercase outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="course-description"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Description{" "}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="course-description"
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="What will students learn in this course?"
                    className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={creating}
                    className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#252736] px-5 py-3 font-semibold text-white transition hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Create course
                      </>
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

export default LecturerCourses;
