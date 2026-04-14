// ! OUTDATED

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "public");
const outputFile = path.join(__dirname, "public", "imagesManifest.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question, placeholder, defaultVal) =>
  new Promise((resolve) =>
    rl.question(question, (answer) =>
      resolve(
        ["", "true"].includes(answer.trim())
          ? answer === "true"
            ? true
            : defaultVal
          : typeof placeholder === "boolean"
            ? false
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
  const existingManifest = await fs
    .readFile(outputFile)
    .then(async (res) => JSON.parse(res.toString()))
    .catch((err) =>
      console.log("No existing image manifest found. Skipping...")
    );

  console.log(typeof existingManifest);

  const dirs = await fs.readdir(publicDir, { withFileTypes: true });

  for (const dirent of dirs) {
    if (!dirent.isDirectory()) continue;

    const id = dirent.name;
    const fullPath = path.join(publicDir, id);
    const files = await fs.readdir(fullPath);
    const images = files.filter(isImage).map(toWebp);

    const existingCurrentManifest =
      existingManifest !== undefined ? existingManifest[id] : null;
    const name = await prompt(
      `Project "${id}" name\nDefault: ${existingCurrentManifest?.name ?? ""}\n`,
      undefined,
      existingCurrentManifest?.name
    );
    const description = await prompt(
      `Project "${id}" description\nDefault: ${existingCurrentManifest?.description ?? ""}\n`,
      undefined,
      existingCurrentManifest?.description
    );
    const youtubeVideo = await prompt(
      `Project "${id}" YouTube video URL\nDefault: ${existingCurrentManifest?.youtubeVideo ?? ""}\n`,
      undefined,
      existingCurrentManifest?.youtubeVideo
    );
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
