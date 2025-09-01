import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "public");
const outputFile = path.join(__dirname, "public", "imagesManifest.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question, placeholder) =>
  new Promise((resolve) =>
    rl.question(question, (answer) =>
      resolve(
        answer.trim() === ""
          ? placeholder
          : typeof placeholder === "boolean"
            ? answer === "true"
            : answer
      )
    )
  );

const isImage = (filename) => /\.(jpe?g|png|webp|gif)$/i.test(filename);

const toWebp = (filename) => {
  return filename.replace(/\.(jpe?g|png|webp|gif)$/i, ".webp");
};

const main = async () => {
  const manifest = {};

  const dirs = await fs.readdir(publicDir, { withFileTypes: true });

  for (const dirent of dirs) {
    if (!dirent.isDirectory()) continue;

    const id = dirent.name;
    const fullPath = path.join(publicDir, id);
    const files = await fs.readdir(fullPath);
    const images = files.filter(isImage).map(toWebp);

    const name = await prompt(`Project "${id}" name: `);
    const description = await prompt(`Project "${id}" description: `);
    const youtubeVideo = await prompt(`Project "${id}" YouTube video URL: `);
    const galleryVisible = await prompt(
      `Should project "${id}"'s gallery be visible? `,
      true
    );

    manifest[id] = {
      id,
      name,
      description,
      images,
      youtubeVideo,
      galleryVisible,
    };
  }

  rl.close();

  await fs.writeFile(outputFile, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest written to ${outputFile}`);
};

main();
