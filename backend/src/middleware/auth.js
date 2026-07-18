import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken, COOKIE_NAME } from "../utils/token.js";

// Verifies the JWT cookie (falls back to Bearer header) and attaches req.user.
export const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.[COOKIE_NAME];

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw ApiError.unauthorized("Authentication required. Please log in.");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired session. Please log in again.");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    throw ApiError.unauthorized("User no longer exists.");
  }

  req.user = user;
  next();
});
