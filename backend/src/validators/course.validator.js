import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().trim().min(2, "Course name is required"),
  code: z.string().trim().min(2, "Course code is required").toUpperCase(),
  description: z.string().trim().optional(),
});

export const enrollSchema = z.object({
  // Enroll either by numeric courseId or by course code (search box uses code).
  courseId: z.coerce.number().int().positive().optional(),
  code: z.string().trim().toUpperCase().optional(),
});
