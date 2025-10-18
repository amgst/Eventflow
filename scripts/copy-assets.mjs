import fs from "fs";
import path from "path";

const src = path.resolve("attached_assets", "generated_images");
const dest = path.resolve("dist", "public", "generated_images");

try {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  if (!fs.existsSync(src)) {
    console.log("No generated_images found; skipping copy.");
    process.exit(0);
  }

  for (const file of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
  }
  console.log("Copied generated_images to dist/public");
} catch (e) {
  console.error("Failed to copy generated images:", e);
  process.exit(1);
}