import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { buildFileUrl } from "../utils/file.js";

const shapeSubmission = (s) => ({
  id: s.id,
  fileUrl: s.fileUrl,
  notes: s.notes,
  regNumber: s.regNumber,
  status: s.status.toLowerCase(),
  grade: s.grade,
  submittedAt: s.submittedAt,
  assignment: s.assignment
    ? {
        id: s.assignment.id,
        title: s.assignment.title,
        dueDate: s.assignment.dueDate,
        course: s.assignment.course
          ? { id: s.assignment.course.id, name: s.assignment.course.name }
          : undefined,
      }
    : undefined,
  student: s.student ? { id: s.student.id, name: s.student.name, email: s.student.email } : undefined,
});

const submissionInclude = {
  assignment: {
    select: {
      id: true,
      title: true,
      dueDate: true,
      lecturerId: true,
      course: { select: { id: true, name: true } },
    },
  },
  student: { select: { id: true, name: true, email: true } },
};

// POST /api/submissions  (student, multipart) — upsert: re-submitting replaces the file.
export const createSubmission = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId, notes, regNumber } = req.body;

  if (!req.file) throw ApiError.badRequest("A file is required to submit.");

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });
  if (!assignment) throw ApiError.notFound("Assignment not found.");

  const enrolled = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId: assignment.courseId } },
  });
  if (!enrolled) throw ApiError.forbidden("You are not enrolled in this course.");

  // Once a lecturer has graded the work, the submission is locked.
  const existing = await prisma.submission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
  });
  if (existing?.status === "GRADED") {
    throw ApiError.forbidden(
      "This submission has already been graded and can no longer be edited.",
    );
  }

  const isLate = new Date() > new Date(assignment.dueDate);
  const status = isLate ? "LATE" : "SUBMITTED";
  const fileUrl = buildFileUrl(req, req.file.filename);

  const submission = await prisma.submission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId } },
    update: { fileUrl, notes, regNumber, status },
    create: { assignmentId, studentId, fileUrl, notes, regNumber, status },
    include: submissionInclude,
  });

  sendSuccess(res, {
    status: 201,
    message: isLate ? "Submitted (after the deadline)." : "Submitted successfully.",
    data: shapeSubmission(submission),
  });
});

// GET /api/submissions?assignmentId=
// Lecturer -> submissions for their assignments; Student -> their own submissions.
export const listSubmissions = asyncHandler(async (req, res) => {
  const { id: userId, role } = req.user;
  const assignmentId = req.query.assignmentId ? Number(req.query.assignmentId) : undefined;

  let where;
  if (role === "LECTURER") {
    where = {
      assignment: { lecturerId: userId },
      ...(assignmentId ? { assignmentId } : {}),
    };
  } else {
    where = { studentId: userId, ...(assignmentId ? { assignmentId } : {}) };
  }

  const submissions = await prisma.submission.findMany({
    where,
    include: submissionInclude,
    orderBy: { submittedAt: "desc" },
  });

  sendSuccess(res, {
    message: "Submissions fetched.",
    data: submissions.map(shapeSubmission),
  });
});

// GET /api/submissions/:id
export const getSubmission = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { id: userId, role } = req.user;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: submissionInclude,
  });
  if (!submission) throw ApiError.notFound("Submission not found.");

  const owns =
    (role === "STUDENT" && submission.studentId === userId) ||
    (role === "LECTURER" && submission.assignment.lecturerId === userId);
  if (!owns) throw ApiError.forbidden("You cannot view this submission.");

  sendSuccess(res, {
    message: "Submission fetched.",
    data: shapeSubmission(submission),
  });
});

// PUT /api/submissions/:id/grade  (lecturer owner)
export const gradeSubmission = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { grade } = req.body;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: submissionInclude,
  });
  if (!submission) throw ApiError.notFound("Submission not found.");
  if (submission.assignment.lecturerId !== req.user.id) {
    throw ApiError.forbidden("You can only grade submissions for your own assignments.");
  }

  const updated = await prisma.submission.update({
    where: { id },
    data: { grade, status: "GRADED" },
    include: submissionInclude,
  });

  sendSuccess(res, {
    message: "Submission graded.",
    data: shapeSubmission(updated),
  });
});
