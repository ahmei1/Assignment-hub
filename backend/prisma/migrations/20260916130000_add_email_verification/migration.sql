ALTER TABLE "User"
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN "emailVerificationCode" TEXT,
ADD COLUMN "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN "emailVerificationSentAt" TIMESTAMP(3),
ADD COLUMN "emailVerificationAttempts" INTEGER NOT NULL DEFAULT 0;

-- Accounts created before verification was introduced remain usable.
UPDATE "User" SET "emailVerifiedAt" = CURRENT_TIMESTAMP;
