import dotenv from "dotenv";

dotenv.config();

const required = ["DATABASE_URL", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0 && process.env.NODE_ENV === "production") {
  throw new Error(`[env] Missing required environment variables: ${missing.join(", ")}`);
}
for (const key of missing) {
  console.warn(`[env] Missing required environment variable: ${key}`);
}

export const env = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "dev_insecure_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  storageDriver: process.env.STORAGE_DRIVER || "local",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
};

if (env.isProd && env.storageDriver === "supabase") {
  const missingStorage = [
    ["SUPABASE_URL", env.supabaseUrl],
    ["SUPABASE_SERVICE_ROLE_KEY", env.supabaseServiceRoleKey],
  ].filter(([, value]) => !value);
  if (missingStorage.length) {
    throw new Error(`[env] Supabase storage is enabled but missing: ${missingStorage.map(([key]) => key).join(", ")}`);
  }
}
