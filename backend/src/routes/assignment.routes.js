import express from "express";
import {
  listAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignment.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../config/multer.js";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "../validators/assignment.validator.js";

const router = express.Router();

router.use(authenticate);

router.get("/", listAssignments);
router.get("/:id", getAssignment);

router.post(
  "/",
  requireRole("LECTURER"),
  upload.single("file"),
  validate(createAssignmentSchema),
  createAssignment
);

router.put(
  "/:id",
  requireRole("LECTURER"),
  upload.single("file"),
  validate(updateAssignmentSchema),
  updateAssignment
);

router.delete("/:id", requireRole("LECTURER"), deleteAssignment);

export default router;
