import { z } from "zod";

/**
 * Environment variable schema with validation
 * This ensures all required environment variables are present and valid at startup
 */
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().regex(/^\d+$/).transform(Number).default("3001"),

  // Database
  DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),

  // CORS Configuration
  CORS_ORIGIN: z.string().optional(),

  // Site URL
  SITE_URL: z.string().url().optional(),

  // Authentication & Security
  ADMIN_TOKEN: z
    .string()
    .min(32, "ADMIN_TOKEN must be at least 32 characters for security"),

  // Email - Resend
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  RESEND_WEBHOOK_SECRET: z.string().optional(),
  OWNER_EMAIL: z.string().email("OWNER_EMAIL must be a valid email"),
  OWNER_PHONE_NUMBER: z.string().optional(),

  // Adobe Sign
  ADOBE_SIGN_CLIENT_ID: z.string().optional(),
  ADOBE_SIGN_CLIENT_SECRET: z.string().optional(),
  ADOBE_SIGN_REFRESH_TOKEN: z.string().optional(),
  ADOBE_SIGN_REDIRECT_URI: z.string().url().optional(),
  ADOBE_SIGN_BASE_URL: z.string().url().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
  STRIPE_ESSENTIALS_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_ESSENTIALS_ANNUAL_PRICE_ID: z.string().optional(),
  STRIPE_GROWTH_MONTHLY_PRICE_ID: z.string().optional(),
  STRIPE_GROWTH_ANNUAL_PRICE_ID: z.string().optional(),

  // Cal.com / Booking
  CAL_WEBHOOK_SECRET: z.string().optional(),
  BOOKING_WEBHOOK_SECRET: z.string().optional(),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_CHAT_MODEL: z.string().default("gpt-4o-mini"),

  // Apollo.io (optional)
  APOLLO_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Validates and returns environment variables
 * Throws an error if validation fails with detailed error messages
 */
export function validateEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    cachedEnv = envSchema.parse(process.env);
    return cachedEnv;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err: z.ZodIssue) => {
        const path = err.path.join(".");
        return `  - ${path}: ${err.message}`;
      });

      throw new Error(
        `Environment variable validation failed:\n${errorMessages.join("\n")}\n\n` +
          "Please ensure all required environment variables are set correctly.",
      );
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * This is the primary way to access environment variables in the application
 */
export function getEnv(): Env {
  if (!cachedEnv) {
    throw new Error(
      "Environment variables not initialized. Call validateEnv() at application startup.",
    );
  }
  return cachedEnv;
}

/**
 * Check if Adobe Sign is configured
 */
export function isAdobeSignConfigured(): boolean {
  const env = getEnv();
  return !!(
    env.ADOBE_SIGN_CLIENT_ID &&
    env.ADOBE_SIGN_CLIENT_SECRET &&
    env.ADOBE_SIGN_REFRESH_TOKEN
  );
}

/**
 * Get Adobe Sign configuration
 * Throws an error if Adobe Sign is not configured
 */
export function getAdobeSignConfig() {
  const env = getEnv();

  if (!isAdobeSignConfigured()) {
    throw new Error(
      "Adobe Sign is not configured. Please set ADOBE_SIGN_CLIENT_ID, " +
        "ADOBE_SIGN_CLIENT_SECRET, and ADOBE_SIGN_REFRESH_TOKEN environment variables.",
    );
  }

  return {
    clientId: env.ADOBE_SIGN_CLIENT_ID!,
    clientSecret: env.ADOBE_SIGN_CLIENT_SECRET!,
    refreshToken: env.ADOBE_SIGN_REFRESH_TOKEN!,
    redirectUri: env.ADOBE_SIGN_REDIRECT_URI,
  };
}
