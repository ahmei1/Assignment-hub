import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { env } from "./env.js";

const UPLOAD_DIR = path.resolve(env.uploadDir);

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".zip",
  ".rar",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".png",
  ".jpg",
  ".jpeg",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not allowed`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024, files: 1, fields: 10 },
});

const AVATAR_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

const avatarFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (AVATAR_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type ${ext} is not allowed for profile pictures. Use ${AVATAR_EXTENSIONS.join(", ")}.`,
      ),
    );
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 3 * 1024 * 1024, files: 1, fields: 5 },
});

export { UPLOAD_DIR };
