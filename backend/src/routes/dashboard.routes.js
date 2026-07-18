import express from "express";
import {
  studentDashboard,
  lecturerDashboard,
} from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

router.use(authenticate);

router.get("/student", requireRole("STUDENT"), studentDashboard);
router.get("/lecturer", requireRole("LECTURER"), lecturerDashboard);

export default router;
