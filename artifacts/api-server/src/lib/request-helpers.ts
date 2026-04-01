import type { Request } from "express";

export function getRequestIp(req: Request): string {
  if (Array.isArray(req.ips) && req.ips.length > 0) {
    return req.ips[0] ?? "unknown";
  }
  return req.ip ?? "unknown";
}

export function getUserAgent(req: Request): string {
  return req.get("user-agent") ?? "unknown";
}
