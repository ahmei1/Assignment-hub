import express from "express";
import {
  register,
  login,
  logout,
  me,
  updateProfile,
  updateAvatar,
  changePassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { uploadAvatar } from "../config/multer.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.put("/me", authenticate, validate(updateProfileSchema), updateProfile);
router.put(
  "/me/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  updateAvatar,
);
router.put(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
