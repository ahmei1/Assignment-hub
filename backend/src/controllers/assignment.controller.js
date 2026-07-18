import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { buildFileUrl } from "../utils/file.js";

const shapeAssignment = (a, extra = {}) => ({
  id: a.id,
  title: a.title,
  description: a.description,
  dueDate: a.dueDate,
  fileUrl: a.fileUrl,
  courseId: a.courseId,
  course: a.course ? { id: a.course.id, name: a.course.name, code: a.course.code } : undefined,
  lecturer: a.lecturer ? { id: a.lecturer.id, name: a.lecturer.name } : undefined,
  createdAt: a.createdAt,
  ...extra,
});

const baseInclude = {
  course: { select: { id: true, name: true, code: true } },
  lecturer: { select: { id: true, name: true } },
};

// GET /api/assignments?courseId=
// Lecturer -> own assignments (with submissionsCount).
// Student  -> assignments from enrolled courses (with their own submissionStatus).
export const listAssignments = asyncHandler(async (req, res) => {
  const { id: userId, role } = req.user;
  const courseId = req.query.courseId ? Number(req.query.courseId) : undefined;

  if (role === "LECTURER") {
    const assignments = await prisma.assignment.findMany({
      where: { lecturerId: userId, ...(courseId ? { courseId } : {}) },
      include: { ...baseInclude, _count: { select: { submissions: true } } },
      orderBy: { dueDate: "asc" },
    });
    return sendSuccess(res, {
      message: "Assignments fetched.",
      data: assignments.map((a) =>
        shapeAssignment(a, { submissionsCount: a._count.submissions })
      ),
    });
  }

  // Student: only assignments in courses they're enrolled in.
  const assignments = await prisma.assignment.findMany({
    where: {
      course: { enrollments: { some: { studentId: userId } } },
      ...(courseId ? { courseId } : {}),
    },
    include: {
      ...baseInclude,
      submissions: { where: { studentId: userId }, select: { id: true, status: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  sendSuccess(res, {
    message: "Assignments fetched.",
    data: assignments.map((a) => {
      const sub = a.submissions[0];
      return shapeAssignment(a, {
        submissionStatus: sub ? sub.status.toLowerCase() : "pending",
        submissionId: sub?.id ?? null,
      });
    }),
  });
});

// GET /api/assignments/:id
export const getAssignment = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { id: userId, role } = req.user;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: baseInclude,
  });
  if (!assignment) throw ApiError.notFound("Assignment not found.");

  let extra = {};
  if (role === "LECTURER") {
    if (assignment.lecturerId !== userId) {
      throw ApiError.forbidden("You do not own this assignment.");
    }
    const count = await prisma.submission.count({ where: { assignmentId: id } });
    extra = { submissionsCount: count };
  } else {
    const enrolled = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId: assignment.courseId } },
    });
    if (!enrolled) throw ApiError.forbidden("You are not enrolled in this course.");
    const sub = await prisma.submission.findUnique({
      where: { assignmentId_studentId: { assignmentId: id, studentId: userId } },
    });
    extra = {
      submissionStatus: sub ? sub.status.toLowerCase() : "pending",
      submissionId: sub?.id ?? null,
    };
  }

  sendSuccess(res, {
    message: "Assignment fetched.",
    data: shapeAssignment(assignment, extra),
  });
});

// POST /api/assignments  (lecturer, multipart)
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate, courseId } = req.body;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw ApiError.notFound("Course not found.");
  if (course.lecturerId !== req.user.id) {
    throw ApiError.forbidden("You can only add assignments to your own courses.");
  }

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      dueDate,
      courseId,
      lecturerId: req.user.id,
      fileUrl: buildFileUrl(req, req.file?.filename),
    },
    include: baseInclude,
  });

  sendSuccess(res, {
    status: 201,
    message: "Assignment created.",
    data: shapeAssignment(assignment),
  });
});

// PUT /api/assignments/:id  (lecturer owner, multipart)
export const updateAssignment = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.assignment.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Assignment not found.");
  if (existing.lecturerId !== req.user.id) {
    throw ApiError.forbidden("You do not own this assignment.");
  }

  const { title, description, dueDate, courseId } = req.body;

  if (courseId && courseId !== existing.courseId) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.lecturerId !== req.user.id) {
      throw ApiError.forbidden("Invalid target course.");
    }
  }

  const assignment = await prisma.assignment.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate }),
      ...(courseId !== undefined && { courseId }),
      ...(req.file ? { fileUrl: buildFileUrl(req, req.file.filename) } : {}),
    },
    include: baseInclude,
  });

  sendSuccess(res, {
    message: "Assignment updated.",
    data: shapeAssignment(assignment),
  });
});

// DELETE /api/assignments/:id  (lecturer owner)
export const deleteAssignment = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.assignment.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Assignment not found.");
  if (existing.lecturerId !== req.user.id) {
    throw ApiError.forbidden("You do not own this assignment.");
  }

  await prisma.assignment.delete({ where: { id } });

  sendSuccess(res, { message: "Assignment deleted." });
});
