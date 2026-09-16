import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import bcrypt from "bcrypt";
import { getPagination } from "../utils/pagination.js";
import { resolveStoredFileUrl } from "../services/storage.js";

const JOIN_PASSWORD_ROUNDS = 10;

// Shapes a course record to match the frontend course cards.
const shapeCourse = (course, { includeJoinPassword = false } = {}) => ({
  id: course.id,
  name: course.name,
  code: course.code,
  description: course.description,
  lecturer: course.lecturer?.name ?? null,
  lecturerId: course.lecturerId,
  assignmentsCount: course._count?.assignments ?? 0,
  studentsCount: course._count?.enrollments ?? 0,
  createdAt: course.createdAt,
  ...(includeJoinPassword ? { hasJoinPassword: Boolean(course.joinPassword) } : {}),
});

const courseInclude = {
  lecturer: { select: { id: true, name: true } },
  _count: { select: { assignments: true, enrollments: true } },
};

// GET /api/courses
// Student -> enrolled courses; Lecturer -> courses they own.
export const listCourses = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  const { skip, limit } = getPagination(req.query);

  let courses;
  if (role === "LECTURER") {
    courses = await prisma.course.findMany({
      where: { lecturerId: id },
      include: courseInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
  } else {
    courses = await prisma.course.findMany({
      where: { enrollments: { some: { studentId: id } } },
      include: courseInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
  }

  const isLecturer = role === "LECTURER";
  sendSuccess(res, {
    message: "Courses fetched.",
    data: courses.map((c) =>
      shapeCourse(c, { includeJoinPassword: isLecturer }),
    ),
  });
});

// GET /api/courses/browse  (students discover courses they can enroll in)
export const browseCourses = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { search } = req.query;
  const { skip, limit } = getPagination(req.query, { defaultLimit: 24 });

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
    skip,
    take: limit,
  });

  sendSuccess(res, {
    message: "Available courses fetched.",
    data: courses.map((c) => shapeCourse(c)),
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

  const isOwner = role === "LECTURER" && course.lecturerId === userId;

  sendSuccess(res, {
    message: "Course fetched.",
    data: {
      ...shapeCourse(course, { includeJoinPassword: isOwner }),
      assignments: await Promise.all(course.assignments.map(async (a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        fileUrl: await resolveStoredFileUrl(a.fileUrl),
        submissionsCount: a._count.submissions,
      }))),
    },
  });
});

// POST /api/courses  (lecturer)
export const createCourse = asyncHandler(async (req, res) => {
  const { name, code, description, joinPassword } = req.body;
  const joinPasswordHash = await bcrypt.hash(joinPassword, JOIN_PASSWORD_ROUNDS);

  const course = await prisma.course.create({
    data: {
      name,
      code,
      description,
      joinPassword: joinPasswordHash,
      lecturerId: req.user.id,
    },
    include: courseInclude,
  });

  sendSuccess(res, {
    status: 201,
    message: "Course created.",
    data: shapeCourse(course, { includeJoinPassword: true }),
  });
});

// POST /api/courses/:id/enroll  or  POST /api/courses/enroll { code }  (student)
export const enroll = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const idFromParam = req.params.id ? Number(req.params.id) : undefined;
  const { courseId: idFromBody, code, joinPassword } = req.body ?? {};

  if (!joinPassword?.trim()) {
    throw ApiError.badRequest("Course join password is required.");
  }

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

  const suppliedPassword = joinPassword.trim();
  const isHash = course.joinPassword.startsWith("$2");
  const passwordMatches = isHash
    ? await bcrypt.compare(suppliedPassword, course.joinPassword)
    : course.joinPassword === suppliedPassword;
  if (!passwordMatches) {
    throw ApiError.forbidden("Incorrect course join password.");
  }

  // Transparently upgrade courses created before join-password hashing was added.
  if (!isHash) {
    await prisma.course.update({
      where: { id: course.id },
      data: { joinPassword: await bcrypt.hash(suppliedPassword, JOIN_PASSWORD_ROUNDS) },
    });
  }

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
