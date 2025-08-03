import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve("public");
const outputBaseDir = path.resolve("public/optimized"); // <--- updated here

const maxWidth = 1280; // max width of resized images

function isDirectory(source) {
  return fs.lstatSync(source).isDirectory();
}

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
          console.log(`✅ Resized and optimized ${projectId}/${file}`);
        })
        .catch((err) => {
          console.error(`❌ Error processing ${projectId}/${file}:`, err);
        });
    }
  });
}
