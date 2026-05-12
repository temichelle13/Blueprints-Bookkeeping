import type { Request, Response, NextFunction } from "express";
import { getEnv } from "../config/env";
import { verifyAdminAccessToken } from "../lib/oauth-tokens";

/**
 * Admin authentication middleware
 * Validates the x-admin-token header against the configured ADMIN_TOKEN
 *
 * Usage:
 *   router.use("/admin", adminAuth);
 *   router.get("/admin/some-route", async (req, res) => { ... });
 */
export function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = extractAdminToken(req);
  const env = getEnv();

  // Use constant-time comparison to prevent timing attacks
  if (!token || typeof token !== "string") {
    res.status(401).json({ error: "Unauthorized: Missing admin token" });
    return;
  }

  if (
    !constantTimeCompare(token, env.ADMIN_TOKEN) &&
    !verifyAdminAccessToken(token)
  ) {
    res.status(401).json({ error: "Unauthorized: Invalid admin token" });
    return;
  }

  next();
}

export function extractAdminToken(req: Request): string | null {
  const headerToken = req.headers["x-admin-token"];
  if (typeof headerToken === "string" && headerToken.length > 0) {
    return headerToken;
  }

  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader !== "string") {
    return null;
  }

  const [scheme, value] = authorizationHeader.split(" ", 2);
  if (!value || scheme?.toLowerCase() !== "bearer") {
    return null;
  }

  return value.trim() || null;
}

/**
 * Constant-time string comparison to prevent timing attacks
 * This prevents attackers from determining the correct token character-by-character
 * based on response time differences
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
