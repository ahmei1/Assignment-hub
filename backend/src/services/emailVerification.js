import crypto from "node:crypto";
import { Resend } from "resend";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
export const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;
export const MAX_VERIFICATION_ATTEMPTS = 5;

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export const createVerificationCode = () =>
  crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

export const hashVerificationCode = (code) =>
  crypto.createHmac("sha256", env.jwtSecret).update(code).digest("hex");

export const verificationData = (code, now = new Date()) => ({
  emailVerificationCode: hashVerificationCode(code),
  emailVerificationExpires: new Date(now.getTime() + VERIFICATION_CODE_TTL_MS),
  emailVerificationSentAt: now,
  emailVerificationAttempts: 0,
});

export const sendVerificationEmail = async ({ email, name, code }) => {
  if (!resend) {
    throw ApiError.serviceUnavailable(
      "Email verification is not configured yet. Please try again later.",
    );
  }

  try {
    const { error } = await resend.emails.send({
      from: env.emailFrom,
      to: email,
      subject: `${code} is your Assignment Hub verification code`,
      text: `Hi ${name},\n\nYour Assignment Hub verification code is ${code}. It expires in 10 minutes.\n\nIf you did not create this account, you can ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#252736">
          <h2>Verify your email</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Enter this code to finish creating your Assignment Hub account:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px 0">${code}</div>
          <p>This code expires in 10 minutes.</p>
          <p style="color:#6b7280;font-size:13px">If you did not create this account, you can ignore this email.</p>
        </div>`,
    });
    if (!error) return;
    console.error("[email] Resend rejected verification email:", error.name);
  } catch (error) {
    console.error("[email] Verification delivery failed:", error.name);
  }

  throw ApiError.serviceUnavailable(
    "We could not send the verification email. Please try again shortly.",
  );
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
