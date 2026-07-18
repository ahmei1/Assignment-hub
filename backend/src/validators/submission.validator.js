import { z } from "zod";

export const createSubmissionSchema = z.object({
  assignmentId: z.coerce.number().int().positive("A valid assignment is required"),
  regNumber: z.string().trim().min(1, "Registration number / school ID is required"),
  notes: z.string().trim().optional(),
});
