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
  return getEnv().OWNER_EMAIL;
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
