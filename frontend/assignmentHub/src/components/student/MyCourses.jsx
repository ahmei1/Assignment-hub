import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const MyCourses = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCourses = courses.filter((course) => {
    const searchableText =
      `${course.name} ${course.code} ${course.lecturer}`.toLowerCase();
    return searchableText.includes(normalizedSearch);
  });

  useEffect(() => {
    const handleCoursesFetch = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses");
        setCourses(response.data.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Courses not found please try again!",
        );
      } finally {
        setLoading(false);
      }
    };

    handleCoursesFetch();
  }, []);

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
            View all the courses you are currently enrolled in.
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <label
            htmlFor="course-search"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Search your courses
          </label>
          <div className="relative">
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="course-search"
              type="search"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-11 text-white outline-none transition placeholder:text-gray-500 focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              placeholder="Search by name, code, or lecturer"
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
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : filteredCourses.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-white/15 bg-white/3 px-6 py-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-white">
            {courses.length === 0
              ? "You’re not enrolled in any courses yet"
              : "No matching courses found"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-gray-400">
            {courses.length === 0
              ? "Your enrolled courses will appear here when they become available."
              : `We couldn’t find a course matching “${search}”. Try another name, code, or lecturer.`}
          </p>
          {courses.length > 0 && (
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
                Enrolled
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

                  <div className="my-6 space-y-3 border-y border-gray-100 py-5 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-[#646B9E]" />
                      <span className="font-medium">{course.lecturer}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                        <ClipboardList size={17} className="text-[#646B9E]" />
                        <span>
                          <strong>{course.assignmentsCount}</strong>{" "}
                          assignments
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                        <Users size={17} className="text-[#646B9E]" />
                        <span>
                          <strong>{course.studentsCount}</strong> students
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/studentDashboard/mycourses/${course.id}`}
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
    </motion.main>
  );
};

export default MyCourses;
