import { Router, type IRouter } from "express";
import { mongoose } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  const dbStatus: "ok" | "error" =
    mongoose.connection.readyState === 1 ? "ok" : "error";

  const overallStatus = dbStatus === "ok" ? "ok" : "degraded";
  const payload = {
    status: overallStatus,
    db: dbStatus,
    timestamp: new Date().toISOString(),
  };

  res.status(overallStatus === "ok" ? 200 : 503).json(payload);
});

export default router;
