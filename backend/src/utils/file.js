// Builds an absolute, publicly reachable URL for an uploaded file.
export const buildFileUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

export const removeUploadedFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

export const removeLocalFileUrl = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    const filename = path.basename(new URL(fileUrl).pathname);
    await removeUploadedFile(path.join(UPLOAD_DIR, filename));
  } catch {
    // Ignore non-local/legacy URLs; cloud storage adapters handle their own keys.
  }
};
import fs from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "../config/multer.js";
