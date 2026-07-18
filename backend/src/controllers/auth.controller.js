import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";
import { sendSuccess, toPublicUser } from "../utils/response.js";
import { buildFileUrl } from "../utils/file.js";

const SALT_ROUNDS = 10;

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  const token = signToken({ id: user.id, role: user.role });
  setAuthCookie(res, token);

  sendSuccess(res, {
    status: 201,
    message: "Account created successfully.",
    data: { user: toPublicUser(user), token },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = signToken({ id: user.id, role: user.role });
  setAuthCookie(res, token);

  sendSuccess(res, {
    message: "Logged in successfully.",
    data: { user: toPublicUser(user), token },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, { message: "Logged out successfully." });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: "Current user.",
    data: { user: toPublicUser(req.user) },
  });
});

// PUT /api/auth/me
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (email !== req.user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw ApiError.conflict("An account with this email already exists.");
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, email },
  });

  sendSuccess(res, {
    message: "Profile updated successfully.",
    data: { user: toPublicUser(user) },
  });
});

// PUT /api/auth/me/avatar (multipart, field name "avatar")
export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("An image file is required.");

  const avatarUrl = buildFileUrl(req, req.file.filename);

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatarUrl },
  });

  sendSuccess(res, {
    message: "Profile picture updated.",
    data: { user: toPublicUser(user) },
  });
});

// PUT /api/auth/me/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const valid = await bcrypt.compare(currentPassword, req.user.password);
  if (!valid) {
    throw ApiError.unauthorized("Your current password is incorrect.");
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });

  sendSuccess(res, { message: "Password changed successfully." });
});
