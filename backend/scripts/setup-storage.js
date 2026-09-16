import { env } from "../src/config/env.js";
import { supabase } from "../src/lib/supabase.js";
import { STORAGE_BUCKETS } from "../src/services/storage.js";

if (!supabase || !env.supabaseServiceRoleKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before creating buckets.");
}

const desiredBuckets = [
  { id: STORAGE_BUCKETS.avatars, public: true, fileSizeLimit: 3 * 1024 * 1024 },
  { id: STORAGE_BUCKETS.assignments, public: false, fileSizeLimit: env.maxUploadMb * 1024 * 1024 },
  { id: STORAGE_BUCKETS.submissions, public: false, fileSizeLimit: env.maxUploadMb * 1024 * 1024 },
];

for (const bucket of desiredBuckets) {
  const { error } = await supabase.storage.createBucket(bucket.id, {
    public: bucket.public,
    fileSizeLimit: bucket.fileSizeLimit,
  });
  if (error && !/already exists/i.test(error.message)) throw error;
  console.log(`Storage bucket ready: ${bucket.id} (${bucket.public ? "public" : "private"})`);
}
