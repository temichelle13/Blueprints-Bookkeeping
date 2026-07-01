import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  const mongodbStatus = process.env.MONGODB_URI ? "configured" : "missing";
  const legacyPostgresStatus = process.env.DATABASE_URL
    ? "configured"
    : "not_configured";

  const overallStatus = mongodbStatus === "configured" ? "ok" : "degraded";

  const payload = {
    status: overallStatus,
    database: {
      target: "mongodb",
      mongodb: mongodbStatus,
      legacyPostgres: legacyPostgresStatus,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(overallStatus === "ok" ? 200 : 503).json(payload);
});

export default router;
