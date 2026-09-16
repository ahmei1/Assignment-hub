import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { env } from "../config/env.js";
import { supabase } from "../lib/supabase.js";
import { buildFileUrl, removeLocalFileUrl, removeUploadedFile } from "../utils/file.js";

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  assignments: "assignment-files",
  submissions: "submissions",
};

const parseStorageRef = (value) => {
  if (!value?.startsWith("supabase://")) return null;
  const withoutScheme = value.slice("supabase://".length);
  const slash = withoutScheme.indexOf("/");
  if (slash < 1) return null;
  return { bucket: withoutScheme.slice(0, slash), objectPath: withoutScheme.slice(slash + 1) };
};

const parsePublicStorageUrl = (value) => {
  if (!value || !env.supabaseUrl || !value.startsWith(env.supabaseUrl)) return null;
  try {
    const marker = "/storage/v1/object/public/";
    const pathname = new URL(value).pathname;
    const start = pathname.indexOf(marker);
    if (start < 0) return null;
    const remainder = decodeURIComponent(pathname.slice(start + marker.length));
    const slash = remainder.indexOf("/");
    return slash > 0
      ? { bucket: remainder.slice(0, slash), objectPath: remainder.slice(slash + 1) }
      : null;
  } catch {
    return null;
  }
};

const uniqueObjectPath = (prefix, file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  return `${prefix}/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
};

export const storeUploadedFile = async (req, file, { bucket, prefix, isPublic = false }) => {
  if (!file) return null;
  if (env.storageDriver !== "supabase") return buildFileUrl(req, file.filename);
  if (!supabase) throw new Error("Supabase storage is not configured.");

  const objectPath = uniqueObjectPath(prefix, file);
  try {
    const body = await fs.readFile(file.path);
    const { error } = await supabase.storage.from(bucket).upload(objectPath, body, {
      contentType: file.mimetype,
      upsert: false,
      cacheControl: isPublic ? "3600" : "0",
    });
    if (error) throw error;

    if (isPublic) {
      return supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
    }
    return `supabase://${bucket}/${objectPath}`;
  } finally {
    await removeUploadedFile(file.path);
  }
};

export const resolveStoredFileUrl = async (value, expiresIn = 300) => {
  const ref = parseStorageRef(value);
  if (!ref) return value ?? null;
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(ref.bucket)
    .createSignedUrl(ref.objectPath, expiresIn);
  if (error) throw error;
  return data.signedUrl;
};

export const deleteStoredFile = async (value) => {
  const ref = parseStorageRef(value) ?? parsePublicStorageUrl(value);
  if (!ref) return removeLocalFileUrl(value);
  if (!supabase) return;
  const { error } = await supabase.storage.from(ref.bucket).remove([ref.objectPath]);
  if (error) throw error;
};
