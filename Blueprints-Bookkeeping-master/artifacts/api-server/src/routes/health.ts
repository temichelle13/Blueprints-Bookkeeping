import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
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
