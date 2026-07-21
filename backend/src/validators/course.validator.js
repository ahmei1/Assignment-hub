import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().trim().min(2, "Course name is required"),
  code: z.string().trim().min(2, "Course code is required").toUpperCase(),
  description: z.string().trim().optional(),
  joinPassword: z
    .string()
    .trim()
    .min(4, "Join password must be at least 4 characters"),
});

export const enrollSchema = z.object({
  // Enroll either by numeric courseId or by course code (search box uses code).
  courseId: z.coerce.number().int().positive().optional(),
  code: z.string().trim().toUpperCase().optional(),
  joinPassword: z.string().trim().min(1, "Course join password is required"),
});
