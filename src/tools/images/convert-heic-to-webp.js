import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = path.resolve("src/tools/images/input");
const outputDir = path.resolve("src/tools/images/output");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const exts = new Set([".jpg", ".jpeg", ".png", ".heic", ".heif", ".JPG", ".JPEG", ".PNG", ".HEIC", ".HEIF"]);

const files = fs.readdirSync(inputDir).filter((f) => exts.has(path.extname(f)));

if (files.length === 0) {
  console.log("No images found in:", inputDir);
  process.exit(0);
}

for (const file of files) {
  const inPath = path.join(inputDir, file);
  const outName = path.parse(file).name + ".webp";
  const outPath = path.join(outputDir, outName);

  try {
    await sharp(inPath)
      .rotate()
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outPath);

    console.log("✅ Converted:", file, "->", outName);
  } catch (err) {
    console.error("❌ Failed:", file, err?.message || err);
  }
}