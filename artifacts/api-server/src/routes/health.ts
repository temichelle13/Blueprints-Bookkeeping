import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

const healthLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

router.get("/healthz", healthLimiter, async (_req, res) => {
  let dbStatus: "ok" | "error" = "error";
  try {
    await pool.query("SELECT 1");
    dbStatus = "ok";
  } catch {
    dbStatus = "error";
  }

  const overallStatus = dbStatus === "ok" ? "ok" : "degraded";
  const payload = {
    status: overallStatus,
    db: dbStatus,
    timestamp: new Date().toISOString(),
  };

  res.status(overallStatus === "ok" ? 200 : 503).json(payload);
});

export default router;
