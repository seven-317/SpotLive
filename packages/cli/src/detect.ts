import fs from "fs";
import path from "path";

export interface NextJsProjectInfo {
  rootDir: string;
  hasAppRouter: boolean;
  hasAlias: boolean;
  hasTailwind: boolean;
}

const NEXT_CONFIG_FILES = [
  "next.config.js",
  "next.config.ts",
  "next.config.mjs",
];

function findNextConfigDir(startDir: string): string | null {
  let current = startDir;

  while (true) {
    for (const configFile of NEXT_CONFIG_FILES) {
      if (fs.existsSync(path.join(current, configFile))) {
        return current;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) {
      // Reached filesystem root
      return null;
    }
    current = parent;
  }
}

function hasAppRouterDir(rootDir: string): boolean {
  return (
    fs.existsSync(path.join(rootDir, "app")) &&
    fs.statSync(path.join(rootDir, "app")).isDirectory()
  );
}

function hasPathAlias(rootDir: string): boolean {
  const tsconfigFiles = ["tsconfig.json", "jsconfig.json"];

  for (const filename of tsconfigFiles) {
    const tsconfigPath = path.join(rootDir, filename);
    if (!fs.existsSync(tsconfigPath)) continue;

    try {
      const raw = fs.readFileSync(tsconfigPath, "utf8");
      // Strip JSON comments for parsing
      const stripped = raw.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
      const parsed = JSON.parse(stripped) as {
        compilerOptions?: { paths?: Record<string, unknown> };
      };
      const paths = parsed?.compilerOptions?.paths ?? {};
      if ("@/*" in paths) return true;
    } catch {
      // Ignore parse errors
    }
  }

  return false;
}

function hasTailwindConfig(rootDir: string): boolean {
  const tailwindConfigFiles = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.mjs",
    "tailwind.config.cjs",
  ];

  for (const filename of tailwindConfigFiles) {
    if (fs.existsSync(path.join(rootDir, filename))) return true;
  }

  // Also check for tailwind in package.json (v4 inline config)
  const pkgPath = path.join(rootDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if ("tailwindcss" in deps) return true;
    } catch {
      // Ignore
    }
  }

  return false;
}

export function detectNextJsProject(): NextJsProjectInfo | null {
  const startDir = process.cwd();
  const rootDir = findNextConfigDir(startDir);

  if (!rootDir) return null;

  return {
    rootDir,
    hasAppRouter: hasAppRouterDir(rootDir),
    hasAlias: hasPathAlias(rootDir),
    hasTailwind: hasTailwindConfig(rootDir),
  };
}
