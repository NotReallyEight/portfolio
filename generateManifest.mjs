#!/usr/bin/env node
// Generates / refreshes public/imagesManifest.json.
//
// Source of truth for *images* is the project folder structure — by default
// the Cloudflare R2 bucket (via `rclone lsjson`), matching how project.tsx
// actually fetches gallery images (CDN_BASE_URL + "/Portfolio/Projects/<id>/<image>").
// Per-project *metadata* (name, description, youtubeVideo, galleryVisible) is
// preserved from the existing manifest unless you explicitly ask to edit it,
// so re-running this after just syncing new photos never clobbers anything.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import process from "node:process";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "public");
const outputFile = path.join(publicDir, "imagesManifest.json");
const backupFile = path.join(publicDir, "imagesManifest.backup.json");

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const flags = {
  source: "r2", // "r2" | "local"
  remote: "r2:photography-drive/Portfolio/Projects",
  dryRun: args.includes("--dry-run"),
  yes: args.includes("--yes") || args.includes("-y"),
  prune: args.includes("--prune"),
  quiet: args.includes("--quiet") || args.includes("-q"),
  verbose: args.includes("--verbose") || args.includes("-v"),
  edit: null,
};

for (const arg of args) {
  if (arg.startsWith("--source=")) flags.source = arg.split("=")[1];
  if (arg.startsWith("--remote=")) flags.remote = arg.split("=")[1];
  if (arg.startsWith("--edit=")) flags.edit = arg.split("=")[1];
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: node generateManifest.mjs [options]

Options:
  --source=r2|local   Where to read project folders/images from.
                      "r2" (default) lists the Cloudflare R2 bucket via rclone.
                      "local" scans ./public/<projectId>/ (legacy/dev mode).
  --remote=<path>     rclone remote:path to list when --source=r2.
                      Default: r2:photography-drive/Portfolio/Projects
  --edit=<projectId>  Re-prompt for metadata (name/description/video/visibility)
                      of an existing project, instead of leaving it untouched.
  --prune             Remove manifest entries whose project folder no longer
                      exists in the source. Without this flag, missing folders
                      are left untouched so metadata is never silently lost.
  --yes, -y           Don't prompt for new projects; fill sensible defaults
                      (name derived from the folder id, empty description,
                      gallery visible). Useful for CI / non-interactive runs.
  --dry-run           Report what would change without writing the file.
  --verbose, -v       Print every added/removed filename per project, not
                      just the counts.
  --quiet, -q         Only print warnings, prompts, and the final summary.
  --help, -h          Show this help.
`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------
const log = (...msg) => {
  if (!flags.quiet) console.log(...msg);
};
const warn = (...msg) => console.log(...msg); // warnings always show, even with --quiet
const verbose = (...msg) => {
  if (flags.verbose) console.log(...msg);
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// Piping exactly N answers from a file/heredoc makes Node auto-close readline
// on EOF right after the last "line" event fires; calling rl.close() again
// afterwards throws ERR_USE_AFTER_CLOSE and would otherwise abort main()
// before the manifest gets written. Make closing idempotent.
const closeReadline = () => {
  try {
    rl.close();
  } catch {
    // already closed — nothing to do
  }
};
const ask = (question) =>
  new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
const askBool = async (question, defaultVal) => {
  const suffix = defaultVal ? "Y/n" : "y/N";
  const answer = (await ask(`${question} (${suffix}) `)).toLowerCase();
  if (answer === "") return defaultVal;
  return answer === "y" || answer === "yes";
};

const IMAGE_RE = /\.(jpe?g|png|webp|gif)$/i;
const isImage = (filename) => IMAGE_RE.test(filename);
const toWebp = (filename) => filename.replace(IMAGE_RE, ".webp");

// Natural sort so DSC0002 < DSC0010; keeps output stable & diff-friendly.
const naturalCompare = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const titleCaseFromId = (id) =>
  id.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ---------------------------------------------------------------------------
// Source listing: R2 (via rclone) or local ./public/<id>/ (legacy/dev)
// Both return Map<projectId, Set<webpFilename>>
// ---------------------------------------------------------------------------

async function listFromR2(remote) {
  let stdout;
  try {
    ({ stdout } = await execFileAsync(
      "rclone",
      ["lsjson", "--recursive", "--files-only", remote],
      { maxBuffer: 1024 * 1024 * 64 }
    ));
  } catch (err) {
    throw new Error(
      `Failed to list "${remote}" with rclone. Make sure rclone is installed, ` +
        `the "r2" remote is configured (see \`rclone config\`), and the path is correct ` +
        `(try \`rclone tree ${remote}\` to sanity check).\n` +
        `Original error: ${err.stderr || err.message}`
    );
  }

  const entries = JSON.parse(stdout);
  const projects = new Map();

  for (const entry of entries) {
    if (entry.IsDir) continue;
    const parts = entry.Path.split("/").filter(Boolean);
    if (parts.length < 2) continue; // stray file at the root, no project folder
    const id = parts[0];
    const filename = parts[parts.length - 1];
    if (!isImage(filename)) continue;

    if (!projects.has(id)) projects.set(id, new Set());
    projects.get(id).add(toWebp(filename));
  }

  return projects;
}

async function listFromLocal(rootDir) {
  const dirs = await fs.readdir(rootDir, { withFileTypes: true });
  const projects = new Map();

  for (const dirent of dirs) {
    if (!dirent.isDirectory()) continue;
    const id = dirent.name;
    const files = await fs.readdir(path.join(rootDir, id));
    const images = files.filter(isImage).map(toWebp);
    projects.set(id, new Set(images));
  }

  return projects;
}

// ---------------------------------------------------------------------------
// Metadata prompts
// ---------------------------------------------------------------------------

async function promptNewProjectMetadata(id) {
  if (flags.yes) {
    return { name: titleCaseFromId(id), description: "", galleryVisible: true };
  }

  console.log(`\nNew project detected: "${id}"`);
  const name = await ask(`  Name [${titleCaseFromId(id)}]: `);
  const description = await ask(`  Description []: `);
  const youtubeVideo = await ask(`  YouTube embed URL (optional) []: `);
  const galleryVisible = await askBool(`  Show gallery on the project page?`, true);

  const meta = { name: name || titleCaseFromId(id), description, galleryVisible };
  if (youtubeVideo) meta.youtubeVideo = youtubeVideo;
  return meta;
}

async function promptEditProjectMetadata(id, existing) {
  console.log(`\nEditing project: "${id}"`);
  const name = await ask(`  Name [${existing.name ?? ""}]: `);
  const description = await ask(`  Description [${existing.description ?? ""}]: `);
  const youtubeVideo = await ask(
    `  YouTube embed URL [${existing.youtubeVideo ?? ""}] (type "clear" to remove): `
  );
  const galleryVisible = await askBool(
    `  Show gallery on the project page?`,
    existing.galleryVisible ?? true
  );

  const meta = {
    name: name || existing.name,
    description: description || existing.description || "",
    galleryVisible,
  };

  if (youtubeVideo === "clear") {
    // dropped intentionally
  } else if (youtubeVideo) {
    meta.youtubeVideo = youtubeVideo;
  } else if (existing.youtubeVideo) {
    meta.youtubeVideo = existing.youtubeVideo;
  }

  return meta;
}

// Fixed key order matching the existing manifest format exactly.
function buildEntry(id, meta, images) {
  const entry = {
    id,
    name: meta.name,
    description: meta.description ?? "",
    images,
  };
  if (meta.youtubeVideo) entry.youtubeVideo = meta.youtubeVideo;
  entry.galleryVisible = meta.galleryVisible ?? true;
  return entry;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function diffImages(oldImages, newImages) {
  const oldSet = new Set(oldImages ?? []);
  const newSet = new Set(newImages);
  const added = newImages.filter((f) => !oldSet.has(f));
  const removed = (oldImages ?? []).filter((f) => !newSet.has(f));
  return { added, removed };
}

async function main() {
  console.log(`\n📸 generateManifest — source: ${flags.source}${flags.source === "r2" ? ` (${flags.remote})` : ` (${publicDir})`}`);
  if (flags.dryRun) console.log("   mode: dry-run (no files will be written)");
  if (flags.edit) console.log(`   editing metadata for: "${flags.edit}"`);
  if (flags.prune) console.log("   pruning entries missing from source");
  if (flags.yes) console.log("   non-interactive: new projects get default metadata");

  const existingManifest = await fs
    .readFile(outputFile, "utf-8")
    .then((raw) => JSON.parse(raw))
    .catch(() => {
      console.log("No existing imagesManifest.json found — starting fresh.");
      return {};
    });
  log(`   existing manifest: ${Object.keys(existingManifest).length} project(s)`);

  log(`\n🔍 Listing images from ${flags.source === "r2" ? flags.remote : publicDir} ...`);
  const sourceProjects =
    flags.source === "local" ? await listFromLocal(publicDir) : await listFromR2(flags.remote);
  const totalImages = [...sourceProjects.values()].reduce((n, set) => n + set.size, 0);
  log(`   found ${sourceProjects.size} project folder(s), ${totalImages} image(s) total\n`);

  const manifest = {};
  const allIds = new Set([...sourceProjects.keys(), ...Object.keys(existingManifest)]);
  const stats = { unchanged: 0, refreshed: 0, created: 0, edited: 0, keptMissing: 0, pruned: 0 };

  for (const id of [...allIds].sort(naturalCompare)) {
    const existing = existingManifest[id];
    const images = sourceProjects.has(id)
      ? [...sourceProjects.get(id)].sort(naturalCompare)
      : null;

    if (images === null) {
      // Folder no longer present in the source (or never was — e.g. locally
      // bundled thumbnail sets like "optimized"/"coding-project-thumbnails"
      // that intentionally live outside the R2 project bucket).
      if (flags.prune) {
        warn(`🗑  "${id}" — pruned (no longer found in source, had ${existing?.images?.length ?? 0} image(s))`);
        stats.pruned++;
        continue;
      }
      if (existing) {
        warn(`⚠️  "${id}" — not found in source; keeping existing entry unchanged (${existing.images?.length ?? 0} image(s))`);
        manifest[id] = existing;
        stats.keptMissing++;
      }
      continue;
    }

    if (!existing) {
      log(`🆕 "${id}" — new project (${images.length} image(s) found)`);
      const meta = await promptNewProjectMetadata(id);
      manifest[id] = buildEntry(id, meta, images);
      log(`   → created "${meta.name}", gallery ${meta.galleryVisible ? "visible" : "hidden"}`);
      stats.created++;
      continue;
    }

    if (flags.edit === id) {
      log(`✏️  "${id}" — editing metadata`);
      const meta = await promptEditProjectMetadata(id, existing);
      manifest[id] = buildEntry(id, meta, images);
      log(`   → saved "${meta.name}", gallery ${meta.galleryVisible ? "visible" : "hidden"}`);
      stats.edited++;
      continue;
    }

    // Existing project, no --edit requested: preserve metadata verbatim,
    // only refresh the images list (and normalize key order/id).
    const { added, removed } = diffImages(existing.images, images);
    manifest[id] = { ...existing, id, images };

    if (added.length === 0 && removed.length === 0) {
      verbose(`✓  "${id}" — unchanged (${images.length} image(s))`);
      stats.unchanged++;
    } else {
      log(
        `🔄 "${id}" — images refreshed: ${existing.images?.length ?? 0} → ${images.length}` +
          `${added.length ? ` (+${added.length})` : ""}${removed.length ? ` (-${removed.length})` : ""}`
      );
      if (added.length) verbose(`     added:   ${added.join(", ")}`);
      if (removed.length) verbose(`     removed: ${removed.join(", ")}`);
      stats.refreshed++;
    }
  }

  closeReadline();

  const before = JSON.stringify(existingManifest, null, 2);
  const after = JSON.stringify(manifest, null, 2);

  console.log(
    `\n📊 Summary: ${stats.unchanged} unchanged, ${stats.refreshed} refreshed, ${stats.created} new, ` +
      `${stats.edited} edited, ${stats.keptMissing} kept (missing from source), ${stats.pruned} pruned`
  );
  console.log(`   final manifest: ${Object.keys(manifest).length} project(s)`);

  if (before === after) {
    console.log("✅ No changes — imagesManifest.json is already up to date.");
    return;
  }

  if (flags.dryRun) {
    console.log("🔎 Dry run — changes detected above, imagesManifest.json was NOT written.");
    return;
  }

  await fs.writeFile(backupFile, before).catch(() => {});
  await fs.writeFile(outputFile, after + "\n");
  console.log(`✅ Manifest written to ${outputFile}`);
  console.log(`   (previous version backed up to ${path.basename(backupFile)})`);
}

main().catch((err) => {
  console.error("❌", err.message);
  closeReadline();
  process.exit(1);
});
