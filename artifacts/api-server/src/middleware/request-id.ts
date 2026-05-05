import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming =
    typeof req.headers["x-request-id"] === "string"
      ? req.headers["x-request-id"]
      : undefined;
  const id = incoming ?? crypto.randomUUID();
  res.locals["requestId"] = id;
  res.setHeader("X-Request-ID", id);
  next();
}