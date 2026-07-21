import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { UPLOAD_DIR } from "./config/multer.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// Needed behind Render/Railway proxies so secure cookies and HTTPS URLs work.
if (env.isProd) {
  app.set("trust proxy", 1);
}

// Core middleware (order matters: parsers before routes).
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically.
app.use("/uploads", express.static(UPLOAD_DIR));

// Health check.
app.get("/", (req, res) => {
  res.json({ success: true, message: "Assignment Hub API is running 🚀" });
});

// API routes.
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 + centralized error handling (must be last).
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
