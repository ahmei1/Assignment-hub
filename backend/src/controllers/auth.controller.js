import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";
import { sendSuccess, toPublicUser } from "../utils/response.js";
import { deleteStoredFile, STORAGE_BUCKETS, storeUploadedFile } from "../services/storage.js";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

const SALT_ROUNDS = 10;
const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;

// POST /api/auth/google
export const googleAuth = asyncHandler(async (req, res) => {
  if (!googleClient) throw ApiError.badRequest("Google sign-in is not configured.");

  const ticket = await googleClient.verifyIdToken({
    idToken: req.body.credential,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw ApiError.unauthorized("Google could not verify this email address.");
  }

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }] },
  });

  if (!user && !req.body.role) {
    throw ApiError.conflict("Choose Student or Lecturer on the registration page before using Google.");
  }

  if (user) {
    if (user.googleId && user.googleId !== payload.sub) {
      throw ApiError.conflict("This email is already linked to another Google account.");
    }
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId: payload.sub, avatarUrl: user.avatarUrl || payload.picture || null },
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: payload.name?.trim() || payload.email.split("@")[0],
        email: payload.email.toLowerCase(),
        googleId: payload.sub,
        role: req.body.role,
        avatarUrl: payload.picture || null,
      },
    });
  }

  const token = signToken({ id: user.id, role: user.role });
  setAuthCookie(res, token);
  sendSuccess(res, {
    message: "Signed in with Google.",
    data: { user: toPublicUser(user) },
  });
});

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
    data: { user: toPublicUser(user) },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  if (!user.password) {
    throw ApiError.unauthorized("This account uses Google sign-in.");
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = signToken({ id: user.id, role: user.role });
  setAuthCookie(res, token);

  sendSuccess(res, {
    message: "Logged in successfully.",
    data: { user: toPublicUser(user) },
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

  const avatarUrl = await storeUploadedFile(req, req.file, {
    bucket: STORAGE_BUCKETS.avatars,
    prefix: `user-${req.user.id}`,
    isPublic: true,
  });

  let user;
  try {
    user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
    });
  } catch (error) {
    await deleteStoredFile(avatarUrl);
    throw error;
  }

  await deleteStoredFile(req.user.avatarUrl);

  sendSuccess(res, {
    message: "Profile picture updated.",
    data: { user: toPublicUser(user) },
  });
});

// PUT /api/auth/me/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user.password) {
    throw ApiError.badRequest("This account uses Google sign-in and has no password to change.");
  }
  const valid = await bcrypt.compare(currentPassword, req.user.password);
  if (!valid) {
    throw ApiError.unauthorized("Your current password is incorrect.");
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });

  clearAuthCookie(res);

  sendSuccess(res, { message: "Password changed. Please log in again." });
});
