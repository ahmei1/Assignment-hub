import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../lib/api";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusDotColor = {
  pending: "bg-amber-400",
  submitted: "bg-emerald-400",
  late: "bg-red-400",
  graded: "bg-blue-400",
};

const toDateKey = (date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

// Builds a 6-week grid (42 days) starting on the Sunday on/before the 1st
// of the month and ending on the Saturday on/after the last day, so the
// calendar always renders a clean rectangular grid.
const buildMonthGrid = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return date;
  });
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const AssignmentCalendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/assignments");
        setAssignments(response.data.data);
      } catch {
        // The calendar is a convenience view — fail quietly and just show
        // an empty calendar rather than blocking the whole dashboard.
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const assignmentsByDay = useMemo(() => {
    const map = new Map();
    assignments.forEach((assignment) => {
      const key = toDateKey(new Date(assignment.dueDate));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(assignment);
    });
    return map;
  }, [assignments]);

  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const selectedAssignments =
    assignmentsByDay.get(toDateKey(selectedDate)) || [];

  const goToMonth = (offset) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const goToToday = () => {
    setViewDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <section className="grid grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-[#252736] p-6 shadow-xl sm:p-8 lg:grid-cols-[1.4fr_1fr]">
      {/* Calendar grid */}
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#969DD9]">
              Calendar
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {viewDate.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label="Previous month"
              className="rounded-xl bg-white/5 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              aria-label="Next month"
              className="rounded-xl bg-white/5 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((date) => {
            const inCurrentMonth = date.getMonth() === month;
            const dueToday = assignmentsByDay.get(toDateKey(date)) || [];
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                  isSelected
                    ? "bg-[#969DD9] font-bold text-[#252736]"
                    : isToday
                      ? "bg-white/10 font-bold text-white"
                      : inCurrentMonth
                        ? "text-gray-200 hover:bg-white/5"
                        : "text-gray-600 hover:bg-white/5"
                }`}
              >
                {date.getDate()}
                {dueToday.length > 0 && (
                  <span className="absolute bottom-1.5 flex gap-0.5">
                    {dueToday.slice(0, 3).map((a) => (
                      <span
                        key={a.id}
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected
                            ? "bg-[#252736]"
                            : statusDotColor[a.submissionStatus] ||
                              "bg-gray-400"
                        }`}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day details */}
      <div className="flex flex-col rounded-2xl bg-white/5 p-5">
        <div className="mb-4 flex items-center gap-3">
          <CalendarDays size={20} className="text-[#B7BDF2]" />
          <h3 className="font-bold text-white">
            {selectedDate.toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={toDateKey(selectedDate)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 space-y-3"
          >
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : selectedAssignments.length === 0 ? (
              <p className="text-sm text-gray-400">
                No assignments due on this day.
              </p>
            ) : (
              selectedAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/studentDashboard/assignments/${assignment.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {assignment.title}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {assignment.course?.name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                      assignment.submissionStatus === "pending"
                        ? "bg-amber-400/15 text-amber-300"
                        : assignment.submissionStatus === "late"
                          ? "bg-red-400/15 text-red-300"
                          : assignment.submissionStatus === "graded"
                            ? "bg-blue-400/15 text-blue-300"
                            : "bg-emerald-400/15 text-emerald-300"
                    }`}
                  >
                    {assignment.submissionStatus}
                  </span>
                  <ArrowRight
                    size={16}
                    className="hidden shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-white sm:block"
                  />
                </Link>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AssignmentCalendar;
