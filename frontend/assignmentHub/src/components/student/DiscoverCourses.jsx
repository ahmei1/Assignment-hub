import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CircleAlert,
  Compass,
  KeyRound,
  Loader2,
  Search,
  User,
  X,
} from "lucide-react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const DiscoverCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [joinPassword, setJoinPassword] = useState("");

  const fetchCourses = async (searchTerm) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/courses/browse", {
        params: { search: searchTerm },
      });
      setCourses(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn’t load available courses. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses("");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchCourses("");
  };

  const openJoinModal = (course) => {
    setSelectedCourse(course);
    setJoinPassword("");
  };

  const closeJoinModal = () => {
    if (enrollingId) return;
    setSelectedCourse(null);
    setJoinPassword("");
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (!joinPassword.trim()) {
      toast.error("Enter the join password from your lecturer.");
      return;
    }

    try {
      setEnrollingId(selectedCourse.id);
      const response = await api.post(
        `/courses/${selectedCourse.id}/enroll`,
        { joinPassword: joinPassword.trim() },
      );
      toast.success(
        response.data.message || `Enrolled in ${selectedCourse.name}!`,
      );

      setCourses((previousCourses) =>
        previousCourses.filter((c) => c.id !== selectedCourse.id),
      );
      setSelectedCourse(null);
      setJoinPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn’t enroll in this course. Please try again.",
      );
    } finally {
      setEnrollingId(null);
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
            <Compass size={30} className="text-[#B7BDF2]" />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Discover Courses
          </h1>
          <p className="mt-2 max-w-xl leading-7 text-gray-400">
            Browse courses and join with the password your lecturer shared.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full lg:max-w-md">
          <label
            htmlFor="discover-search"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Search by name or course code
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="discover-search"
                type="search"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-11 text-white outline-none transition placeholder:text-gray-500 focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                placeholder="e.g. CS301 or Web Development"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={17} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-[#969DD9] px-5 py-3.5 font-semibold text-[#252736] transition hover:bg-[#B7BDF2]"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {loading ? (
        <Loader />
      ) : error ? (
        <section className="rounded-3xl border border-red-400/20 bg-red-400/5 px-6 py-16 text-center">
          <CircleAlert size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-white">
            Something went wrong
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">{error}</p>
          <button
            type="button"
            onClick={() => fetchCourses(search)}
            className="mt-6 rounded-xl bg-[#41455E] px-5 py-3 font-semibold text-white transition hover:bg-[#555a78]"
          >
            Try again
          </button>
        </section>
      ) : courses.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/3 px-6 py-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-white">
            {search
              ? "No matching courses found"
              : "You’ve joined every available course"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">
            {search
              ? `We couldn’t find a course matching “${search}”. Try another name or code.`
              : "Check back later for new courses to enroll in."}
          </p>
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
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
                Available
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Courses you can join
              </h2>
            </div>
            <span className="text-sm text-gray-400">
              {courses.length} {courses.length === 1 ? "course" : "courses"}
            </span>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence>
              {courses.map((course) => (
                <motion.article
                  key={course.id}
                  variants={staggerItem}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
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

                    <div className="my-6 flex items-center gap-3 border-y border-gray-100 py-5 text-sm text-gray-700">
                      <User size={18} className="text-[#646B9E]" />
                      <span className="font-medium">{course.lecturer}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openJoinModal(course)}
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3 font-semibold text-white transition duration-300 hover:bg-[#41455E]"
                    >
                      <KeyRound size={18} />
                      Join Course
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={closeJoinModal}
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
                    Join course
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {selectedCourse.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedCourse.code} · {selectedCourse.lecturer}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeJoinModal}
                  disabled={!!enrollingId}
                  aria-label="Close"
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEnroll} className="space-y-5">
                <div>
                  <label
                    htmlFor="join-password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Join password
                  </label>
                  <input
                    id="join-password"
                    type="text"
                    required
                    autoFocus
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="Enter the password from your lecturer"
                    className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeJoinModal}
                    disabled={!!enrollingId}
                    className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!enrollingId}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#252736] px-5 py-3 font-semibold text-white transition hover:bg-[#41455E] disabled:opacity-60"
                  >
                    {enrollingId ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join course"
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

export default DiscoverCourses;
