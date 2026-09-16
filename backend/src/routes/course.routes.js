import express from "express";
import {
  listCourses,
  browseCourses,
  getCourse,
  createCourse,
  enroll,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createCourseSchema, enrollSchema, updateCourseSchema } from "../validators/course.validator.js";

const router = express.Router();

router.use(authenticate);

router.get("/", listCourses);
router.get("/browse", requireRole("STUDENT"), browseCourses);
router.post("/", requireRole("LECTURER"), validate(createCourseSchema), createCourse);
router.put("/:id", requireRole("LECTURER"), validate(updateCourseSchema), updateCourse);
router.delete("/:id", requireRole("LECTURER"), deleteCourse);
router.post("/enroll", requireRole("STUDENT"), validate(enrollSchema), enroll);
router.post(
  "/:id/enroll",
  requireRole("STUDENT"),
  validate(enrollSchema),
  enroll
);
router.get("/:id", getCourse);

export default router;
