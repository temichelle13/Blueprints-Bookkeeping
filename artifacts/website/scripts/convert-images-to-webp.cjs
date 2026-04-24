const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

async function convertToWebP(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');

  try {
    await sharp(pngPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);

    const originalStats = fs.statSync(pngPath);
    const webpStats = fs.statSync(webpPath);
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

    console.log(`✓ ${path.basename(pngPath)}`);
    console.log(`  ${(originalStats.size / 1024).toFixed(0)}KB → ${(webpStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`);
  } catch (error) {
    console.error(`✗ Failed to convert ${pngPath}:`, error.message);
  }
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.png$/i.test(entry.name)) {
      await convertToWebP(fullPath);
    }
  }
}

console.log('Converting PNG images to WebP format...\n');
processDirectory(imagesDir).then(() => {
  console.log('\n✓ Conversion complete!');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
