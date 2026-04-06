import type { Request, Response, NextFunction } from "express";
import { getEnv } from "../config/env";

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
  const token = req.headers["x-admin-token"];
  const env = getEnv();

  // Use constant-time comparison to prevent timing attacks
  if (!token || typeof token !== "string") {
    res.status(401).json({ error: "Unauthorized: Missing admin token" });
    return;
  }

  if (!constantTimeCompare(token, env.ADMIN_TOKEN)) {
    res.status(401).json({ error: "Unauthorized: Invalid admin token" });
    return;
  }

  next();
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
