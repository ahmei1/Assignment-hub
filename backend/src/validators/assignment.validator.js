import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  dueDate: z.coerce.date({ message: "A valid due date is required" }),
  courseId: z.coerce.number().int().positive("A valid course is required"),
});

export const updateAssignmentSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().trim().min(1).optional(),
  dueDate: z.coerce.date().optional(),
  courseId: z.coerce.number().int().positive().optional(),
});
