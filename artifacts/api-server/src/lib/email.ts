import { Resend } from "resend";
import { getEnv } from "../config/env";

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
 * Get the owner email address
 */
export function getOwnerEmail(): string {
  return getEnv().OWNER_EMAIL;
}

/**
 * Standard email sender configuration
 */
export const EMAIL_FROM = {
  default: "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>",
  support: "Blueprints & Bookkeeping <support@blueprintsandbookkeeping.com>",
  notifications: "Blueprints & Bookkeeping <notifications@blueprintsandbookkeeping.com>",
} as const;
