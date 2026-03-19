import path from "path";
import { existsSync } from "fs";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

const DOWNLOADS_DIR_CANDIDATES = [
  path.resolve(process.cwd(), "artifacts/website/public/downloads"),
  path.resolve(process.cwd(), "../website/public/downloads"),
];

function getDownloadsDir(): string | null {
  for (const candidate of DOWNLOADS_DIR_CANDIDATES) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

router.get("/downloads/:filename", (req, res): void => {
  const { filename } = req.params;

  if (!filename || filename.includes("/") || filename.includes("\\")) {
    res.status(400).json({ error: "Invalid download filename" });
    return;
  }

  const downloadsDir = getDownloadsDir();

  if (!downloadsDir) {
    console.error("[Downloads] Downloads directory not found");
    res.status(500).json({ error: "Downloads are unavailable right now" });
    return;
  }

  const filePath = path.resolve(downloadsDir, filename);

  if (!filePath.startsWith(`${downloadsDir}${path.sep}`) || !existsSync(filePath)) {
    res.status(404).json({ error: "Download not found" });
    return;
  }

  res.download(filePath, filename, (err) => {
    if (err && !res.headersSent) {
      console.error("[Downloads] Failed to send file:", err);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
});

export default router;
