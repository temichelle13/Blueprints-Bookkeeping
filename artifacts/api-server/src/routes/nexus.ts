import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { db, stateNexusRulesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  getNexusSummary,
  runNexusCheck,
  getNotificationLog,
} from "../lib/nexus-service";

const router: IRouter = Router();

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["x-admin-token"];
  const expected = process.env["ADMIN_TOKEN"];

  if (!expected) {
    res.status(503).json({ error: "Admin access not configured." });
    return;
  }

  if (token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

router.use("/admin/nexus", adminAuth);

router.get("/admin/nexus/summary", async (_req, res): Promise<void> => {
  try {
    const summary = await getNexusSummary();
    res.json(summary);
  } catch (err) {
    console.error("Failed to get nexus summary:", err);
    res.status(500).json({ error: "Failed to retrieve nexus summary" });
  }
});

router.get("/admin/nexus/rules", async (_req, res): Promise<void> => {
  try {
    const rules = await db
      .select()
      .from(stateNexusRulesTable)
      .orderBy(stateNexusRulesTable.stateName);
    res.json(rules);
  } catch (err) {
    console.error("Failed to get nexus rules:", err);
    res.status(500).json({ error: "Failed to retrieve nexus rules" });
  }
});

router.patch(
  "/admin/nexus/rules/:stateCode",
  async (req, res): Promise<void> => {
    const { stateCode } = req.params;
    const {
      foreignQualificationThreshold,
      warningThresholdPercent,
      bookkeepingLicenseRequired,
      notes,
      authorityUrl,
    } = req.body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (foreignQualificationThreshold !== undefined) {
      const val = parseInt(foreignQualificationThreshold, 10);
      if (isNaN(val) || val < 1) {
        res.status(400).json({
          error: "foreignQualificationThreshold must be a positive integer",
        });
        return;
      }
      updates.foreignQualificationThreshold = val;
    }

    if (warningThresholdPercent !== undefined) {
      const val = parseInt(warningThresholdPercent, 10);
      if (isNaN(val) || val < 1 || val > 99) {
        res
          .status(400)
          .json({ error: "warningThresholdPercent must be between 1 and 99" });
        return;
      }
      updates.warningThresholdPercent = val;
    }

    if (bookkeepingLicenseRequired !== undefined) {
      updates.bookkeepingLicenseRequired = !!bookkeepingLicenseRequired;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (authorityUrl !== undefined) {
      updates.authorityUrl = authorityUrl;
    }

    try {
      const [updated] = await db
        .update(stateNexusRulesTable)
        .set(updates)
        .where(eq(stateNexusRulesTable.stateCode, stateCode.toUpperCase()))
        .returning();

      if (!updated) {
        res.status(404).json({ error: "State not found" });
        return;
      }

      res.json(updated);
    } catch (err) {
      console.error("Failed to update nexus rule:", err);
      res.status(500).json({ error: "Failed to update nexus rule" });
    }
  },
);

router.post("/admin/nexus/check", async (_req, res): Promise<void> => {
  try {
    const result = await runNexusCheck();
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("Failed to run nexus check:", err);
    res.status(500).json({ error: "Failed to run nexus check" });
  }
});

router.get("/admin/nexus/notifications", async (_req, res): Promise<void> => {
  try {
    const log = await getNotificationLog();
    res.json(log);
  } catch (err) {
    console.error("Failed to get notification log:", err);
    res.status(500).json({ error: "Failed to retrieve notification log" });
  }
});

export default router;
