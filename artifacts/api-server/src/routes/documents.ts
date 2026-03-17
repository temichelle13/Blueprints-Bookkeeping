import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, clientDocumentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import multer from "multer";
import * as ccStorage from "../lib/adobe-cc-storage";
import { Resend } from "resend";
import { isEmailSuppressed } from "../lib/email-suppression";

const router: IRouter = Router();

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS = "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
  "text/csv",
];

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".doc", ".xls", ".jpg", ".jpeg", ".png", ".csv"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = "." + file.originalname.split(".").pop()?.toLowerCase();
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.originalname} (${file.mimetype})`));
    }
  },
});

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

function buildDocumentPath(clientName: string, originalName: string): string {
  const year = new Date().getFullYear();
  const safeName = clientName.replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "_");
  const date = new Date().toISOString().split("T")[0];
  const safeFileName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  return `Blueprints_Bookkeeping/ClientDocuments/${year}/${safeName}/${date}_${uid}_${safeFileName}`;
}

function getMimeTypeForFile(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    doc: "application/msword",
    xls: "application/vnd.ms-excel",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    csv: "text/csv",
  };
  return mimeMap[ext || ""] || "application/octet-stream";
}

async function sendUploadConfirmation(clientName: string, clientEmail: string, fileNames: string[]): Promise<void> {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;

  const suppressed = await isEmailSuppressed(clientEmail);
  if (suppressed) {
    console.warn("[Documents] Skipping upload confirmation email — address is suppressed:", clientEmail);
    return;
  }

  const resend = new Resend(key);
  const fileList = fileNames.map((f) => `<li style="padding:4px 0;">${f}</li>`).join("");

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: clientEmail,
    subject: "Document Upload Confirmation — Blueprints & Bookkeeping",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:linear-gradient(135deg,#6366f1,#818cf8);padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">Documents Received</h1>
        </div>
        <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
          <p>Hi ${clientName},</p>
          <p>We've securely received the following document(s):</p>
          <ul style="margin:16px 0;padding-left:20px;">${fileList}</ul>
          <p>Your files are stored securely and our team will review them shortly. If you have any questions, feel free to reply to this email or contact us directly.</p>
          <p style="margin-top:24px;color:#6b7280;font-size:13px;">— Blueprints & Bookkeeping</p>
        </div>
      </div>`,
  }).catch((err) => {
    console.error("Failed to send upload confirmation email:", err);
  });
}

async function notifyAdminNewUpload(clientName: string, clientEmail: string, fileNames: string[]): Promise<void> {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;

  const resend = new Resend(key);
  const fileList = fileNames.map((f) => `<li style="padding:4px 0;">${f}</li>`).join("");

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: OWNER_EMAIL,
    subject: `New Document Upload from ${clientName}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">New Client Documents</h1>
        </div>
        <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
          <p><strong>${clientName}</strong> (${clientEmail}) has uploaded the following documents:</p>
          <ul style="margin:16px 0;padding-left:20px;">${fileList}</ul>
          <p style="margin-top:16px;">View and download these files from the <a href="https://blueprintsandbookkeeping.com/admin/contracts" style="color:#6366f1;">admin dashboard</a>.</p>
        </div>
      </div>`,
  }).catch((err) => {
    console.error("Failed to send admin upload notification:", err);
  });
}

router.post("/documents/upload", (req: Request, res: Response, next: NextFunction) => {
  upload.array("files", 10)(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).json({ error: "File exceeds the 25MB size limit" });
          return;
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          res.status(400).json({ error: "Maximum 10 files per upload" });
          return;
        }
        res.status(400).json({ error: err.message });
        return;
      }
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(400).json({ error: "File upload error" });
      return;
    }
    next();
  });
}, async (req: Request, res: Response): Promise<void> => {
  const { clientName, clientEmail } = req.body;

  if (!clientName || !clientEmail || !clientEmail.includes("@")) {
    res.status(400).json({ error: "clientName and a valid clientEmail are required" });
    return;
  }

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: "At least one file is required" });
    return;
  }

  const results: Array<{ id: number; fileName: string; storagePath: string }> = [];
  const errors: string[] = [];

  for (const file of files) {
    const storagePath = buildDocumentPath(clientName, file.originalname);

    try {
const fileBytes = new Uint8Array(file.buffer);
const arrayBuffer = fileBytes.buffer;
      const mimeType = file.mimetype || getMimeTypeForFile(file.originalname);
      await ccStorage.uploadToCreativeCloud(storagePath, fileBytes, mimeType);

      const [doc] = await db
        .insert(clientDocumentsTable)
        .values({
          clientName,
          clientEmail,
          fileName: file.originalname,
          originalName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype || getMimeTypeForFile(file.originalname),
          storagePath,
        })
        .returning();

      results.push({ id: doc.id, fileName: file.originalname, storagePath });
    } catch (err) {
      console.error(`Failed to upload ${file.originalname}:`, err);
      errors.push(file.originalname);
    }
  }

  if (results.length === 0) {
    res.status(500).json({ error: "All file uploads failed", failedFiles: errors });
    return;
  }

  const uploadedNames = results.map((r) => r.fileName);
  await Promise.all([
    sendUploadConfirmation(clientName, clientEmail, uploadedNames),
    notifyAdminNewUpload(clientName, clientEmail, uploadedNames),
  ]);

  res.status(201).json({
    success: true,
    message: `${results.length} file(s) uploaded successfully`,
    documents: results,
    failedFiles: errors.length > 0 ? errors : undefined,
  });
});

router.get("/documents", adminAuth, async (_req: Request, res: Response): Promise<void> => {
  const documents = await db
    .select()
    .from(clientDocumentsTable)
    .orderBy(desc(clientDocumentsTable.uploadedAt));

  res.json(documents);
});

router.get("/documents/:id/download", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid document ID" });
    return;
  }

  const results = await db
    .select()
    .from(clientDocumentsTable)
    .where(eq(clientDocumentsTable.id, id))
    .limit(1);

  const doc = results[0];
  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  try {
    const token = await getAccessToken();
    const apiKey = process.env["ADOBE_SIGN_CLIENT_ID"];

    const response = await fetch(`https://cc-api-storage.adobe.io/v2/assets/${doc.storagePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": apiKey || "",
      },
    });

    if (!response.ok) {
      throw new Error(`CC Storage download failed: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const safeFileName = doc.originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

    res.setHeader("Content-Type", doc.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeFileName}"`);
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Failed to download document:", err);
    res.status(500).json({ error: "Failed to download document" });
  }
});

async function getAccessToken(): Promise<string> {
  const clientId = process.env["ADOBE_SIGN_CLIENT_ID"];
  const clientSecret = process.env["ADOBE_SIGN_CLIENT_SECRET"];
  const refreshToken = process.env["ADOBE_SIGN_REFRESH_TOKEN"];

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Adobe API credentials not configured");
  }

  const response = await fetch("https://ims-na1.adobelogin.com/ims/token/v3", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Adobe CC token refresh failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

router.post("/documents/send-link", adminAuth, async (req: Request, res: Response): Promise<void> => {
  const { clientName, clientEmail } = req.body;

  if (!clientName || !clientEmail) {
    res.status(400).json({ error: "clientName and clientEmail are required" });
    return;
  }

  const siteOrigin = process.env["SITE_ORIGIN"] || "https://blueprintsandbookkeeping.com";
  const uploadLink = `${siteOrigin}/client-portal?name=${encodeURIComponent(clientName)}&email=${encodeURIComponent(clientEmail)}`;

  const key = process.env["RESEND_API_KEY"];
  if (!key) {
    res.status(503).json({ error: "Email service not configured" });
    return;
  }

  try {
    const suppressed = await isEmailSuppressed(clientEmail);
    if (suppressed) {
      console.warn("[Documents] Skipping upload link email — address is suppressed:", clientEmail);
      res.json({ success: true, message: "Upload link sent" });
      return;
    }

    const resend = new Resend(key);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: clientEmail,
      subject: "Secure Document Upload Link — Blueprints & Bookkeeping",
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
          <div style="background:linear-gradient(135deg,#6366f1,#818cf8);padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">Secure Document Upload</h1>
          </div>
          <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
            <p>Hi ${clientName},</p>
            <p>We've prepared a secure link for you to upload your documents. Click the button below to get started:</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${uploadLink}" style="display:inline-block;background:#6366f1;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Upload Documents</a>
            </div>
            <p style="color:#6b7280;font-size:13px;">Accepted file types: PDF, DOCX, XLSX, JPG, PNG, CSV (up to 25MB each)</p>
            <p style="margin-top:24px;color:#6b7280;font-size:13px;">— Blueprints & Bookkeeping</p>
          </div>
        </div>`,
    });

    res.json({ success: true, message: "Upload link sent" });
  } catch (err) {
    console.error("Failed to send upload link:", err);
    res.status(500).json({ error: "Failed to send upload link email" });
  }
});

export default router;
