#!/usr/bin/env node

import { Command } from "commander";
import pc from "picocolors";
import { detectNextJsProject } from "./detect.js";
import { promptCredentials, runOAuthFlow, updateEnvLocal } from "./auth.js";
import {
  installApiRoute,
  installComponent,
  printSummary,
} from "./installer.js";

// ─── Package metadata ─────────────────────────────────────────────────────────

// Loaded via require since tsup bundles to CJS
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require("../package.json") as { version: string };

// ─── Banner ────────────────────────────────────────────────────────────────────

function printBanner() {
  console.log(
    "\n" +
      pc.bold(pc.green("SpotLive")) +
      " " +
      pc.dim(`v${pkg.version}`) +
      "\n"
  );
}

// ─── init command ─────────────────────────────────────────────────────────────

async function runInit() {
  printBanner();

  // 1. Detect Next.js project
  const project = detectNextJsProject();

  if (!project) {
    console.error(
      pc.red("✗") +
        " Could not find a Next.js project (next.config.* not found).\n" +
        "  Run " +
        pc.cyan("spotlive init") +
        " from your project root."
    );
    process.exit(1);
  }

  console.log(pc.bold("Detected project:") + " " + pc.dim(project.rootDir));
  console.log(
    `  App Router   ${project.hasAppRouter ? pc.green("✓") : pc.red("✗ (pages router not supported)")}`
  );
  console.log(
    `  Tailwind CSS ${project.hasTailwind ? pc.green("✓") : pc.yellow("✗ (not found)")}`
  );
  console.log(
    `  @/* alias    ${project.hasAlias ? pc.green("✓") : pc.dim("✗ (will use relative paths)")}`
  );

  if (!project.hasAppRouter) {
    console.error(
      "\n" +
        pc.red("✗") +
        " SpotLive requires the Next.js App Router (app/ directory)."
    );
    process.exit(1);
  }

  if (!project.hasTailwind) {
    console.log(
      "\n" +
        pc.yellow("⚠") +
        " Tailwind CSS not detected. The component uses Tailwind classes — " +
        "make sure it is configured in your project.\n"
    );
  } else {
    console.log();
  }

  // 2. Prompt for Spotify credentials
  console.log(
    pc.bold("Spotify credentials") +
      pc.dim(" — create an app at https://developer.spotify.com/dashboard\n")
  );
  console.log(
    pc.dim(
      "  Set the Redirect URI to: http://localhost:8888/callback\n"
    )
  );

  const { clientId, clientSecret } = await promptCredentials();

  if (!clientId || !clientSecret) {
    console.error(pc.red("\n✗ Client ID and Client Secret are required."));
    process.exit(1);
  }

  // 3. OAuth flow
  console.log();
  let refreshToken: string;
  try {
    refreshToken = await runOAuthFlow(clientId, clientSecret);
  } catch (err) {
    console.error(
      pc.red("\n✗ OAuth flow failed:"),
      err instanceof Error ? err.message : String(err)
    );
    process.exit(1);
  }

  console.log(pc.green("\n✓") + " Authorization successful!\n");

  // 4. Update .env.local
  updateEnvLocal(project.rootDir, {
    SPOTIFY_CLIENT_ID: clientId,
    SPOTIFY_CLIENT_SECRET: clientSecret,
    SPOTIFY_REFRESH_TOKEN: refreshToken,
  });

  console.log(
    pc.green("✓") + " Updated " + pc.cyan(".env.local") + " with Spotify credentials.\n"
  );

  // 5. Write component files
  console.log(pc.bold("Installing files…\n"));

  await installComponent(project.rootDir, project.hasAlias);
  await installApiRoute(project.rootDir, project.hasAlias);

  printSummary();

  // 6. Next steps
  console.log(`
${pc.bold(pc.green("✓ SpotLive installed!"))}

${pc.bold("Next steps:")}

  1. Import and use the component in your layout or any page:

     ${pc.cyan('import { SpotLive } from "@/app/components/SpotLive"')}

     ${pc.cyan('<SpotLive variant="player" />')}
     ${pc.dim("or")}
     ${pc.cyan('<SpotLive variant="vinyl" position="right" />')}

  2. Start your dev server:

     ${pc.cyan("npm run dev")}

  3. Play a song on Spotify and enjoy! 🎵
`);
}

// ─── CLI definition ───────────────────────────────────────────────────────────

const program = new Command();

program
  .name("spotlive")
  .description("Add a Spotify Now Playing widget to your Next.js app")
  .version(pkg.version);

program
  .command("init")
  .description("Initialize SpotLive in your Next.js project")
  .action(() => {
    runInit().catch((err: unknown) => {
      console.error(
        pc.red("\nUnexpected error:"),
        err instanceof Error ? err.message : String(err)
      );
      process.exit(1);
    });
  });

program.parse(process.argv);

// Show help if no subcommand provided
if (process.argv.length < 3) {
  program.help();
}
