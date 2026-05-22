import fs from "fs";
import path from "path";
import readline from "readline";
import pc from "picocolors";
import { getSpotLiveTemplate } from "./templates/SpotLive.tsx.tpl.js";
import { getRouteTemplate } from "./templates/route.ts.tpl.js";

// ─── File writing with conflict handling ─────────────────────────────────────

type ConflictAction = "overwrite" | "skip" | "backup";

async function promptConflictAction(filePath: string): Promise<ConflictAction> {
  const rel = path.relative(process.cwd(), filePath);

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    const prompt = () => {
      rl.question(
        `  ${pc.yellow("!")} ${pc.bold(rel)} already exists. [${pc.cyan("O")}]verwrite / [${pc.cyan("S")}]kip / [${pc.cyan("B")}]ackup? `,
        (answer) => {
          const ch = answer.trim().toLowerCase();
          rl.close();
          if (ch === "o" || ch === "overwrite") {
            resolve("overwrite");
          } else if (ch === "s" || ch === "skip") {
            resolve("skip");
          } else if (ch === "b" || ch === "backup") {
            resolve("backup");
          } else {
            // Re-prompt on invalid input
            const rl2 = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
              terminal: true,
            });
            rl2.close();
            prompt();
          }
        }
      );
    };

    prompt();
  });
}

function backupPath(filePath: string): string {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const ts = Date.now();
  return path.join(dir, `${base}.bak.${ts}${ext}`);
}

interface WrittenFile {
  path: string;
  action: "written" | "skipped" | "backed-up";
}

const writtenFiles: WrittenFile[] = [];

export async function writeFile(
  destPath: string,
  content: string,
  options?: { force?: boolean }
): Promise<void> {
  // Ensure parent directory exists
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  if (fs.existsSync(destPath) && !options?.force) {
    const action = await promptConflictAction(destPath);

    if (action === "skip") {
      console.log(`  ${pc.dim("→ skipped")}`);
      writtenFiles.push({ path: destPath, action: "skipped" });
      return;
    }

    if (action === "backup") {
      const bak = backupPath(destPath);
      fs.renameSync(destPath, bak);
      console.log(`  ${pc.dim(`→ backed up to ${path.relative(process.cwd(), bak)}`)}`);
      writtenFiles.push({ path: destPath, action: "backed-up" });
    }
    // "overwrite" falls through to write below
  }

  fs.writeFileSync(destPath, content, "utf8");

  if (!writtenFiles.find((f) => f.path === destPath)) {
    writtenFiles.push({ path: destPath, action: "written" });
  }
}

// ─── Component + route installation ──────────────────────────────────────────

function resolveAlias(hasAlias: boolean): string {
  return hasAlias ? "@" : ".";
}

export async function installComponent(
  rootDir: string,
  hasAlias: boolean
): Promise<void> {
  const alias = resolveAlias(hasAlias);
  const content = getSpotLiveTemplate(alias);

  // Prefer app/components, fall back to components/
  const destDir = fs.existsSync(path.join(rootDir, "app"))
    ? path.join(rootDir, "app", "components")
    : path.join(rootDir, "components");

  const destPath = path.join(destDir, "SpotLive.tsx");
  await writeFile(destPath, content);
}

export async function installApiRoute(
  rootDir: string,
  _hasAlias: boolean
): Promise<void> {
  const content = getRouteTemplate();

  // Always write to app/api/spotify/route.ts for App Router
  const destPath = path.join(rootDir, "app", "api", "spotify", "route.ts");
  await writeFile(destPath, content);
}

// ─── Summary table ────────────────────────────────────────────────────────────

export function printSummary(): void {
  if (writtenFiles.length === 0) return;

  console.log("\n" + pc.bold("Files:"));

  const cwd = process.cwd();

  for (const file of writtenFiles) {
    const rel = path.relative(cwd, file.path);
    const actionLabel =
      file.action === "written"
        ? pc.green("written")
        : file.action === "skipped"
          ? pc.yellow("skipped")
          : pc.cyan("backed up");

    const icon =
      file.action === "written" ? "+" : file.action === "skipped" ? "-" : "~";

    console.log(`  ${pc.dim(icon)} ${rel} ${pc.dim(`[${actionLabel}]`)}`);
  }
}
