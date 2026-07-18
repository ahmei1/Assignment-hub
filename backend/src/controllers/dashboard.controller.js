import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const DUE_SOON_DAYS = 7;

// GET /api/dashboard/student
export const studentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const now = new Date();
  const dueSoonCutoff = new Date(now.getTime() + DUE_SOON_DAYS * 24 * 60 * 60 * 1000);

  const enrolledCourseIds = (
    await prisma.enrollment.findMany({
      where: { studentId },
      select: { courseId: true },
    })
  ).map((e) => e.courseId);

  const [coursesCount, assignments, submissions] = await Promise.all([
    Promise.resolve(enrolledCourseIds.length),
    prisma.assignment.findMany({
      where: { courseId: { in: enrolledCourseIds } },
      include: { course: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.submission.findMany({
      where: { studentId },
      select: { assignmentId: true, status: true },
    }),
  ]);

  const submittedIds = new Set(submissions.map((s) => s.assignmentId));
  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter((a) => submittedIds.has(a.id)).length;

  const dueSoon = assignments.filter(
    (a) => !submittedIds.has(a.id) && a.dueDate >= now && a.dueDate <= dueSoonCutoff
  ).length;

  const progress =
    totalAssignments === 0 ? 0 : Math.round((submittedCount / totalAssignments) * 100);

  // Upcoming deadlines table (next 5 not-yet-past assignments).
  const deadlines = assignments
    .filter((a) => a.dueDate >= now || !submittedIds.has(a.id))
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      assignment: a.title,
      course: a.course?.name ?? "",
      dueDate: a.dueDate,
      status: submittedIds.has(a.id) ? "submitted" : "pending",
    }));

  sendSuccess(res, {
    message: "Student dashboard.",
    data: {
      stats: {
        courses: coursesCount,
        assignments: totalAssignments,
        submitted: submittedCount,
        dueSoon,
      },
      deadlines,
      progress,
    },
  });
});

// GET /api/dashboard/lecturer
export const lecturerDashboard = asyncHandler(async (req, res) => {
  const lecturerId = req.user.id;

  const [coursesCount, assignmentsCount, submissionsCount, recentAssignments, recentSubmissions] =
    await Promise.all([
      prisma.course.count({ where: { lecturerId } }),
      prisma.assignment.count({ where: { lecturerId } }),
      prisma.submission.count({ where: { assignment: { lecturerId } } }),
      prisma.assignment.findMany({
        where: { lecturerId },
        include: {
          course: { select: { name: true } },
          _count: { select: { submissions: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.submission.findMany({
        where: { assignment: { lecturerId } },
        include: {
          student: { select: { id: true, name: true } },
          assignment: { select: { id: true, title: true } },
        },
        orderBy: { submittedAt: "desc" },
        take: 5,
      }),
    ]);

  sendSuccess(res, {
    message: "Lecturer dashboard.",
    data: {
      stats: {
        courses: coursesCount,
        assignments: assignmentsCount,
        submissions: submissionsCount,
      },
      recentAssignments: recentAssignments.map((a) => ({
        id: a.id,
        title: a.title,
        course: a.course?.name ?? "",
        dueDate: a.dueDate,
        submissionsCount: a._count.submissions,
      })),
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        student: s.student?.name ?? "",
        assignment: s.assignment?.title ?? "",
        status: s.status.toLowerCase(),
        submittedAt: s.submittedAt,
      })),
    },
  });
});
