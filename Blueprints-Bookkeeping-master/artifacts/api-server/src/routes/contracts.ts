import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { db, contractsTable, contractTemplatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import * as contractService from "../lib/contract-service";
import * as adobeSign from "../lib/adobe-sign";

const router: IRouter = Router();

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["x-admin-token"];
  const expected = process.env["ADMIN_TOKEN"];

  if (!expected) {
    res.status(503).json({
      error:
        "Admin access not configured. Set ADMIN_TOKEN environment variable.",
    });
    return;
  }

  if (token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

router.post("/contracts/webhooks/booking", async (req, res): Promise<void> => {
  const webhookSecret = process.env["BOOKING_WEBHOOK_SECRET"];
  if (!webhookSecret) {
    res.status(503).json({
      error:
        "Booking webhook not configured. Set BOOKING_WEBHOOK_SECRET environment variable.",
    });
    return;
  }

  const provided =
    req.headers["x-webhook-secret"] ||
    req.headers["x-calendly-webhook-signing-key"];
  if (provided !== webhookSecret) {
    res.status(401).json({ error: "Invalid webhook secret" });
    return;
  }

  const body = req.body;
  if (!body) {
    res.status(400).json({ error: "Empty body" });
    return;
  }

  let clientName: string | undefined;
  let clientEmail: string | undefined;
  let serviceType: string | undefined;

  if (body.event === "invitee.created" && body.payload) {
    const payload = body.payload;
    clientName = payload.name || payload.invitee?.name;
    clientEmail = payload.email || payload.invitee?.email;
    serviceType = payload.event_type?.name || payload.scheduled_event?.name;
  } else if (body.clientName && body.clientEmail) {
    clientName = body.clientName;
    clientEmail = body.clientEmail;
    serviceType = body.serviceType;
  }

  if (!clientName || !clientEmail) {
    res.status(400).json({ error: "clientName and clientEmail are required" });
    return;
  }

  try {
    const results = await contractService.processBooking({
      clientName,
      clientEmail,
      ...(serviceType !== undefined && { serviceType }),
    });
    res.status(201).json({
      success: true,
      message: `${results.length} contract(s) triggered`,
      contracts: results,
    });
  } catch (err) {
    console.error("Booking webhook contract error:", err);
    res.status(500).json({ error: "Failed to process booking contracts" });
  }
});

router.use("/contracts", adminAuth);

router.get("/contracts", async (_req, res): Promise<void> => {
  const contracts = await db
    .select()
    .from(contractsTable)
    .orderBy(desc(contractsTable.createdAt));

  res.json(contracts);
});

router.get("/contracts/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid contract ID" });
    return;
  }

  const results = await db
    .select()
    .from(contractsTable)
    .where(eq(contractsTable.id, id))
    .limit(1);

  if (results.length === 0) {
    res.status(404).json({ error: "Contract not found" });
    return;
  }

  res.json(results[0]);
});

function validateSendContract(body: unknown): {
  clientName: string;
  clientEmail: string;
  contractType: string;
  serviceType?: string;
  pricingTier?: string;
  startDate?: string;
} | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.clientName !== "string" || !b.clientName) return null;
  if (typeof b.clientEmail !== "string" || !b.clientEmail.includes("@"))
    return null;
  if (typeof b.contractType !== "string" || !b.contractType) return null;
  return {
    clientName: b.clientName,
    clientEmail: b.clientEmail,
    contractType: b.contractType,
    ...(typeof b.serviceType === "string" && { serviceType: b.serviceType }),
    ...(typeof b.pricingTier === "string" && { pricingTier: b.pricingTier }),
    ...(typeof b.startDate === "string" && { startDate: b.startDate }),
  };
}

router.post("/contracts/send", async (req, res): Promise<void> => {
  const data = validateSendContract(req.body);
  if (!data) {
    res.status(400).json({
      error: "clientName, clientEmail (valid), and contractType are required",
    });
    return;
  }

  try {
    const result = await contractService.sendContract(data);
    res.status(201).json({
      success: true,
      message: "Contract sent successfully",
      contractId: result.id,
      adobeAgreementId: result.adobeAgreementId,
    });
  } catch (err) {
    console.error("Failed to send contract:", err);
    const message =
      err instanceof Error ? err.message : "Failed to send contract";
    const status = message.includes("not configured")
      ? 503
      : message.includes("No active template")
        ? 422
        : 500;
    res.status(status).json({ error: message });
  }
});

router.post("/contracts/:id/sync", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid contract ID" });
    return;
  }

  try {
    const check = await db
      .select()
      .from(contractsTable)
      .where(eq(contractsTable.id, id))
      .limit(1);

    if (check.length === 0) {
      res.status(404).json({ error: "Contract not found" });
      return;
    }

    await contractService.syncAgreementStatus(id);
    const updated = await db
      .select()
      .from(contractsTable)
      .where(eq(contractsTable.id, id))
      .limit(1);

    res.json(updated[0]);
  } catch (err) {
    console.error("Failed to sync contract:", err);
    res.status(500).json({ error: "Failed to sync contract status" });
  }
});

router.post("/contracts/sync-all", async (_req, res): Promise<void> => {
  try {
    const synced = await contractService.syncAllPendingAgreements();
    res.json({ success: true, synced });
  } catch (err) {
    console.error("Failed to sync contracts:", err);
    res.status(500).json({ error: "Failed to sync contracts" });
  }
});

router.post(
  "/contracts/process-reminders",
  async (_req, res): Promise<void> => {
    try {
      const result = await contractService.checkAndSendReminders();
      res.json({ success: true, ...result });
    } catch (err) {
      console.error("Failed to process reminders:", err);
      res.status(500).json({ error: "Failed to process reminders" });
    }
  },
);

router.get("/contracts/templates/list", async (_req, res): Promise<void> => {
  const templates = await db
    .select()
    .from(contractTemplatesTable)
    .orderBy(desc(contractTemplatesTable.createdAt));

  res.json(templates);
});

function validateTemplateBody(body: unknown): {
  name: string;
  contractType: string;
  adobeTemplateId?: string;
  triggerCondition: string;
  description?: string;
  prefillFields?: string[];
  active?: boolean;
} | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.name !== "string" || !b.name) return null;
  if (typeof b.contractType !== "string" || !b.contractType) return null;
  if (typeof b.triggerCondition !== "string" || !b.triggerCondition)
    return null;

  let active: boolean | undefined = undefined;
  if (typeof b.active === "boolean") {
    active = b.active;
  } else if (typeof b.active === "string") {
    active = b.active === "true";
  }

  return {
    name: b.name,
    contractType: b.contractType,
    ...(typeof b.adobeTemplateId === "string" && { adobeTemplateId: b.adobeTemplateId }),
    triggerCondition: b.triggerCondition,
    ...(typeof b.description === "string" && { description: b.description }),
    ...(Array.isArray(b.prefillFields) && { prefillFields: b.prefillFields.filter((f): f is string => typeof f === "string") }),
    ...(active !== undefined && { active }),
  };
}

router.post("/contracts/templates", async (req, res): Promise<void> => {
  const data = validateTemplateBody(req.body);
  if (!data) {
    res
      .status(400)
      .json({ error: "name, contractType, and triggerCondition are required" });
    return;
  }

  const [template] = await db
    .insert(contractTemplatesTable)
    .values({
      name: data.name,
      contractType: data.contractType,
      adobeTemplateId: data.adobeTemplateId ?? null,
      triggerCondition: data.triggerCondition,
      description: data.description ?? null,
      prefillFields: data.prefillFields ?? null,
      active: data.active ?? true,
    })
    .returning();

  res.status(201).json(template);
});

router.put("/contracts/templates/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid template ID" });
    return;
  }

  const data = validateTemplateBody(req.body);
  if (!data) {
    res
      .status(400)
      .json({ error: "name, contractType, and triggerCondition are required" });
    return;
  }

  const [updated] = await db
    .update(contractTemplatesTable)
    .set({
      name: data.name,
      contractType: data.contractType,
      adobeTemplateId: data.adobeTemplateId ?? null,
      triggerCondition: data.triggerCondition,
      description: data.description ?? null,
      prefillFields: data.prefillFields ?? null,
      active: data.active ?? true,
      updatedAt: new Date(),
    })
    .where(eq(contractTemplatesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  res.json(updated);
});

router.delete("/contracts/templates/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid template ID" });
    return;
  }

  const deleted = await db
    .delete(contractTemplatesTable)
    .where(eq(contractTemplatesTable.id, id))
    .returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  res.status(204).send();
});

router.get("/contracts/:id/document", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid contract ID" });
    return;
  }

  const results = await db
    .select()
    .from(contractsTable)
    .where(eq(contractsTable.id, id))
    .limit(1);

  const contract = results[0];
  if (!contract) {
    res.status(404).json({ error: "Contract not found" });
    return;
  }

  if (contract.status !== "signed" || !contract.adobeAgreementId) {
    res.status(404).json({ error: "No signed document available" });
    return;
  }

  if (!adobeSign.isConfigured()) {
    res.status(503).json({ error: "Adobe Sign API not configured" });
    return;
  }

  try {
    const pdfBuffer = await adobeSign.getSignedDocument(
      contract.adobeAgreementId,
    );
    const safeName = contract.clientName
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "_");
    const fileName = `${contract.contractType}_${safeName}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("Failed to retrieve signed document:", err);
    res.status(500).json({ error: "Failed to retrieve signed document" });
  }
});

router.get("/contracts/adobe/status", async (_req, res): Promise<void> => {
  res.json({
    configured: adobeSign.isConfigured(),
    message: adobeSign.isConfigured()
      ? "Adobe Acrobat Sign API is connected"
      : "Adobe Acrobat Sign API credentials not configured. Set ADOBE_SIGN_CLIENT_ID, ADOBE_SIGN_CLIENT_SECRET, and ADOBE_SIGN_REFRESH_TOKEN environment variables.",
  });
});

router.get("/contracts/adobe/templates", async (_req, res): Promise<void> => {
  if (!adobeSign.isConfigured()) {
    res.status(503).json({ error: "Adobe Sign API not configured" });
    return;
  }

  try {
    const docs = await adobeSign.getLibraryDocuments();
    res.json(docs);
  } catch (err) {
    console.error("Failed to fetch Adobe templates:", err);
    res.status(500).json({ error: "Failed to fetch Adobe Sign templates" });
  }
});

export default router;
