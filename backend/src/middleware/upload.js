import path from "path";
import { fileTypeFromFile } from "file-type";
import { ApiError } from "../utils/ApiError.js";
import { removeUploadedFile } from "../utils/file.js";

const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/vnd.rar",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
]);
const AVATAR_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const TEXT_EXTENSIONS = new Set([".txt"]);

const validateFile = (allowedTypes, { allowText = false } = {}) => async (req, res, next) => {
  if (!req.file) return next();

  try {
    const detected = await fileTypeFromFile(req.file.path);
    const extension = path.extname(req.file.originalname).toLowerCase();
    const valid = detected
      ? allowedTypes.has(detected.mime)
      : allowText && TEXT_EXTENSIONS.has(extension) && req.file.mimetype === "text/plain";

    if (!valid) {
      await removeUploadedFile(req.file.path);
      req.file = undefined;
      return next(ApiError.badRequest("The uploaded file content does not match an allowed type."));
    }
    next();
  } catch (error) {
    await removeUploadedFile(req.file?.path);
    next(error);
  }
};

export const validateDocumentUpload = validateFile(DOCUMENT_TYPES, { allowText: true });
export const validateAvatarUpload = validateFile(AVATAR_TYPES);
