import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const COOKIE_NAME = "token";

export const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

export const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    // "lax" works with the Vercel same-origin /api proxy and is reliable on
    // mobile browsers. Cross-site "none" cookies get blocked on many phones.
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
  });
};

export { COOKIE_NAME };
