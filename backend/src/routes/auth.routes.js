import express from "express";
import {
  register,
  login,
  logout,
  me,
  updateProfile,
  updateAvatar,
  changePassword,
  googleAuth,
  verifyEmail,
  resendVerification,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { uploadAvatar } from "../config/multer.js";
import { validateAvatarUpload } from "../middleware/upload.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  googleAuthSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", validate(googleAuthSchema), googleAuth);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/resend-verification", validate(resendVerificationSchema), resendVerification);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.put("/me", authenticate, validate(updateProfileSchema), updateProfile);
router.put(
  "/me/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  validateAvatarUpload,
  updateAvatar,
);
router.put(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
