import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  let dbStatus: "ok" | "missing" | "error" = pool ? "error" : "missing";
  if (pool) {
    try {
      await pool.query("SELECT 1");
      dbStatus = "ok";
    } catch {
      dbStatus = "error";
    }
  }

  const overallStatus = dbStatus === "error" ? "degraded" : "ok";
  const payload = {
    status: overallStatus,
    db: dbStatus,
    mongodb: process.env["MONGODB_URI"] ? "configured" : "missing",
    timestamp: new Date().toISOString(),
  };

  res.status(overallStatus === "ok" ? 200 : 503).json(payload);
});

export default router;
