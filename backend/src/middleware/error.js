import multer from "multer";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

// Centralized error handler — always returns { success: false, message }.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum size is 10 MB."
        : err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      const target = err.meta?.target?.join?.(", ") || "field";
      message = `A record with this ${target} already exists.`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found.";
    } else {
      statusCode = 400;
      message = "Database request error.";
    }
  } else if (err.message) {
    // multer fileFilter errors and other operational messages
    message = err.message;
    if (message.includes("not allowed")) statusCode = 400;
  }

  if (statusCode === 500 && !env.isProd) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isProd ? {} : { stack: err.stack }),
  });
};
