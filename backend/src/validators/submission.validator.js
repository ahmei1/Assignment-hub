import { z } from "zod";

export const createSubmissionSchema = z.object({
  assignmentId: z.coerce.number().int().positive("A valid assignment is required"),
  regNumber: z.string().trim().min(1, "Registration number / school ID is required"),
  notes: z.string().trim().optional(),
});

export const gradeSubmissionSchema = z.object({
  grade: z.coerce
    .number()
    .int("Grade must be a whole number")
    .min(0, "Grade cannot be below 0")
    .max(100, "Grade cannot be above 100"),
});
