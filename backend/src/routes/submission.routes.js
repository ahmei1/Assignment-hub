import express from "express";
import {
  createSubmission,
  listSubmissions,
  getSubmission,
  gradeSubmission,
} from "../controllers/submission.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../config/multer.js";
import {
  createSubmissionSchema,
  gradeSubmissionSchema,
} from "../validators/submission.validator.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requireRole("STUDENT"),
  upload.single("file"),
  validate(createSubmissionSchema),
  createSubmission
);

router.get("/", listSubmissions);
router.get("/:id", getSubmission);
router.put(
  "/:id/grade",
  requireRole("LECTURER"),
  validate(gradeSubmissionSchema),
  gradeSubmission
);

export default router;
