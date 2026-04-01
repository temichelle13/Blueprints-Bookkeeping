import { Resend } from "resend";
import { getEnv } from "../config/env";
import { logger } from "./logger";

let resendInstance: Resend | null = null;

/**
 * Get a singleton Resend client instance
 * This replaces the duplicated getResend() function across multiple files
 */
export function getResend(): Resend {
  if (!resendInstance) {
    const env = getEnv();
    if (!env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured; cannot call getResend(). Set the environment variable to enable email delivery.",
      );
    }
    resendInstance = new Resend(env.RESEND_API_KEY);
  }
  return resendInstance;
}

/**
 * Optional Resend accessor for best-effort email flows.
 */
export function tryGetResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    logger.warn(
      "Transactional email provider unavailable; RESEND_API_KEY missing",
    );
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(key);
  }

  return resendInstance;
}

/**
 * Get the owner email address
 */
export function getOwnerEmail(): string {
  const ownerEmail = getEnv().OWNER_EMAIL;
  if (!ownerEmail) {
    throw new Error(
      "OWNER_EMAIL is not configured; cannot call getOwnerEmail(). Set the environment variable to enable email delivery.",
    );
  }
  return ownerEmail;
}

/**
 * Optional owner email accessor for best-effort email flows.
 */
export function tryGetOwnerEmail(): string | null {
  const ownerEmail = process.env["OWNER_EMAIL"]?.trim();
  if (!ownerEmail) {
    logger.warn(
      "Transactional email recipient unavailable; OWNER_EMAIL missing",
    );
    return null;
  }

  return ownerEmail;
}

/**
 * Standard email sender configuration
 */
export const EMAIL_FROM = {
  default: "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>",
  support: "Blueprints & Bookkeeping <support@blueprintsandbookkeeping.com>",
  notifications:
    "Blueprints & Bookkeeping <notifications@blueprintsandbookkeeping.com>",
} as const;
