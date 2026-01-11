import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import process from "node:process";

const publicDir = path.resolve("public");
const outputBaseDir = path.resolve("public/optimized");

const maxWidth = 1280; // Max width of resized images

const isDirectory = (source) => {
  return fs.lstatSync(source).isDirectory();
};

const projectFolders = fs
  .readdirSync(publicDir)
  .map((name) => path.join(publicDir, name))
  .filter(isDirectory);

for (const projectFolder of projectFolders) {
  const projectId = path.basename(projectFolder);
  const outputProjectFolder = path.join(outputBaseDir, projectId);

  if (!fs.existsSync(outputProjectFolder)) {
    fs.mkdirSync(outputProjectFolder, { recursive: true });
  }

  const files = fs.readdirSync(projectFolder);

  files.forEach((file) => {
    const inputPath = path.join(projectFolder, file);
    const ext = path.extname(file).toLowerCase();

    if ([".jpg", ".jpeg", ".png", ".webp", ".tiff"].includes(ext)) {
      const outputPath = path.join(
        outputProjectFolder,
        path.parse(file).name + ".webp"
      );

      sharp(inputPath)
        .resize({ width: maxWidth })
        .webp({ quality: 75 })
        .toFile(outputPath)
        .then(() => {
          if (
            typeof process.stdout.clearLine === "function" &&
            typeof process.stdout.write === "function"
          ) {
            process.stdout.clearLine();
            process.stdout.write(
              `\r✅ Resized and optimized ${projectId}/${file}`
            );
          }
        })
        .catch((err) => {
          console.error(`❌ Error processing ${projectId}/${file}:`, err);
        });
    }
  });
}
