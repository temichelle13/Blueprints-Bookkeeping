#!/usr/bin/env tsx
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, basename } from "path";

const imagesDir = join(import.meta.dirname, "../public/images");

async function convertToWebP(pngPath: string): Promise<void> {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");

  try {
    await sharp(pngPath).webp({ quality: 85, effort: 6 }).toFile(webpPath);

    const originalStats = await stat(pngPath);
    const webpStats = await stat(webpPath);
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(
      1,
    );

    console.log(`✓ ${basename(pngPath)}`);
    console.log(
      `  ${(originalStats.size / 1024).toFixed(0)}KB → ${(webpStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`,
    );
  } catch (error) {
    console.error(`✗ Failed to convert ${pngPath}:`, error);
  }
}

async function processDirectory(dir: string): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.png$/i.test(entry.name)) {
      await convertToWebP(fullPath);
    }
  }
}

console.log("Converting PNG images to WebP format...\n");
await processDirectory(imagesDir);
console.log("\n✓ Conversion complete!");
