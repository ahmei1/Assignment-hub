import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

// Shapes a course record to match the frontend course cards.
const shapeCourse = (course) => ({
  id: course.id,
  name: course.name,
  code: course.code,
  description: course.description,
  lecturer: course.lecturer?.name ?? null,
  lecturerId: course.lecturerId,
  assignmentsCount: course._count?.assignments ?? 0,
  studentsCount: course._count?.enrollments ?? 0,
  createdAt: course.createdAt,
});

const courseInclude = {
  lecturer: { select: { id: true, name: true } },
  _count: { select: { assignments: true, enrollments: true } },
};

// GET /api/courses
// Student -> enrolled courses; Lecturer -> courses they own.
export const listCourses = asyncHandler(async (req, res) => {
  const { role, id } = req.user;

  let courses;
  if (role === "LECTURER") {
    courses = await prisma.course.findMany({
      where: { lecturerId: id },
      include: courseInclude,
      orderBy: { createdAt: "desc" },
    });
  } else {
    courses = await prisma.course.findMany({
      where: { enrollments: { some: { studentId: id } } },
      include: courseInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  sendSuccess(res, {
    message: "Courses fetched.",
    data: courses.map(shapeCourse),
  });
});

// GET /api/courses/browse  (students discover courses they can enroll in)
export const browseCourses = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { search } = req.query;

  const courses = await prisma.course.findMany({
    where: {
      enrollments: { none: { studentId: id } },
      ...(search
        ? {
            OR: [
              { code: { contains: String(search), mode: "insensitive" } },
              { name: { contains: String(search), mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: courseInclude,
    orderBy: { name: "asc" },
  });

  sendSuccess(res, {
    message: "Available courses fetched.",
    data: courses.map(shapeCourse),
  });
});

// GET /api/courses/:id
export const getCourse = asyncHandler(async (req, res) => {
  const courseId = Number(req.params.id);
  const { id: userId, role } = req.user;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      ...courseInclude,
      assignments: {
        orderBy: { dueDate: "asc" },
        include: { _count: { select: { submissions: true } } },
      },
    },
  });

  if (!course) throw ApiError.notFound("Course not found.");

  // Access check: lecturer owner or enrolled student.
  if (role === "LECTURER" && course.lecturerId !== userId) {
    throw ApiError.forbidden("You do not own this course.");
  }
  if (role === "STUDENT") {
    const enrolled = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } },
    });
    if (!enrolled) throw ApiError.forbidden("You are not enrolled in this course.");
  }

  sendSuccess(res, {
    message: "Course fetched.",
    data: {
      ...shapeCourse(course),
      assignments: course.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        fileUrl: a.fileUrl,
        submissionsCount: a._count.submissions,
      })),
    },
  });
});

// POST /api/courses  (lecturer)
export const createCourse = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;

  const course = await prisma.course.create({
    data: { name, code, description, lecturerId: req.user.id },
    include: courseInclude,
  });

  sendSuccess(res, {
    status: 201,
    message: "Course created.",
    data: shapeCourse(course),
  });
});

// POST /api/courses/:id/enroll  or  POST /api/courses/enroll { code }  (student)
export const enroll = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const idFromParam = req.params.id ? Number(req.params.id) : undefined;
  const { courseId: idFromBody, code } = req.body ?? {};

  let course;
  if (idFromParam || idFromBody) {
    course = await prisma.course.findUnique({
      where: { id: idFromParam ?? idFromBody },
    });
  } else if (code) {
    course = await prisma.course.findUnique({ where: { code } });
  } else {
    throw ApiError.badRequest("Provide a course id or course code.");
  }

  if (!course) throw ApiError.notFound("Course not found.");

  const already = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId: course.id } },
  });
  if (already) throw ApiError.conflict("You are already enrolled in this course.");

  await prisma.enrollment.create({
    data: { studentId, courseId: course.id },
  });

  sendSuccess(res, {
    status: 201,
    message: `Enrolled in ${course.name}.`,
    data: { courseId: course.id },
  });
});
