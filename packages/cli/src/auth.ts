import fs from "fs";
import http from "http";
import path from "path";
import readline from "readline";
import { URL, URLSearchParams } from "url";
import open from "open";

const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
].join(" ");

const REDIRECT_URI = "http://localhost:8888/callback";

// ─── Credential prompting ────────────────────────────────────────────────────

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
}

function maskInput(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const stream = process.stdout;

    process.stdout.write(prompt);

    // Switch stdin to raw mode for masking
    const stdin = process.stdin;
    const wasPaused = stdin.isPaused();
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let input = "";

    const onData = (char: string) => {
      if (char === "\r" || char === "\n") {
        stdin.setRawMode?.(false);
        if (wasPaused) stdin.pause();
        stdin.removeListener("data", onData);
        stream.write("\n");
        resolve(input);
      } else if (char === "") {
        // Ctrl+C
        process.exit(0);
      } else if (char === "" || char === "\b") {
        // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          stream.write("\b \b");
        }
      } else {
        input += char;
        stream.write("*");
      }
    };

    stdin.on("data", onData);

    // Pause the readline interface so it doesn't consume our raw input
    rl.pause();
  });
}

function ask(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.resume();
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

export async function promptCredentials(): Promise<SpotifyCredentials> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  let clientId = "";
  let clientSecret = "";

  try {
    clientId = await ask(rl, "Spotify Client ID: ");
    clientSecret = await maskInput(rl, "Spotify Client Secret: ");
  } finally {
    rl.close();
  }

  return { clientId: clientId.trim(), clientSecret: clientSecret.trim() };
}

// ─── OAuth flow ──────────────────────────────────────────────────────────────

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

function buildAuthorizeUrl(clientId: string): string {
  const state = Math.random().toString(36).slice(2, 10);
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SPOTIFY_SCOPES,
    state,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<TokenResponse> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Token exchange failed (${response.status}): ${text}`
    );
  }

  return response.json() as Promise<TokenResponse>;
}

function waitForCallback(
  server: http.Server
): Promise<{ code: string; error?: string }> {
  return new Promise((resolve, reject) => {
    server.on("request", (req, res) => {
      const reqUrl = new URL(req.url ?? "/", "http://localhost:8888");

      if (reqUrl.pathname !== "/callback") {
        res.writeHead(404).end();
        return;
      }

      const error = reqUrl.searchParams.get("error");
      const code = reqUrl.searchParams.get("code");

      const html = (title: string, body: string) =>
        `<!DOCTYPE html><html><head><title>${title}</title><style>
          body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#18181b;color:#fff}
          .card{background:#27272a;border-radius:12px;padding:2rem 3rem;text-align:center;max-width:400px}
          h2{margin:0 0 .5rem}p{color:#a1a1aa;margin:0}
        </style></head><body><div class="card">${body}</div></body></html>`;

      if (error) {
        res
          .writeHead(400, { "Content-Type": "text/html" })
          .end(
            html(
              "Authorization Failed",
              `<h2>Authorization Failed</h2><p>${error}</p>`
            )
          );
        reject(new Error(`Spotify authorization error: ${error}`));
        return;
      }

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" }).end(
          html("Missing Code", "<h2>Missing Code</h2><p>No code in callback.</p>")
        );
        reject(new Error("No authorization code in callback"));
        return;
      }

      res
        .writeHead(200, { "Content-Type": "text/html" })
        .end(
          html(
            "SpotLive — Authorized!",
            `<h2>✓ Authorized!</h2><p>You can close this tab and return to the terminal.</p>`
          )
        );

      resolve({ code });
    });
  });
}

export async function runOAuthFlow(
  clientId: string,
  clientSecret: string
): Promise<string> {
  const server = http.createServer();

  await new Promise<void>((resolve, reject) => {
    server.listen(8888, "localhost", () => resolve());
    server.on("error", reject);
  });

  const authorizeUrl = buildAuthorizeUrl(clientId);

  console.log(`\nOpening Spotify authorization in your browser…`);
  console.log(`If the browser doesn't open, visit:\n  ${authorizeUrl}\n`);

  await open(authorizeUrl);

  let refreshToken: string;

  try {
    const { code } = await waitForCallback(server);
    const tokens = await exchangeCodeForTokens(code, clientId, clientSecret);
    refreshToken = tokens.refresh_token;
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  return refreshToken;
}

// ─── .env.local management ───────────────────────────────────────────────────

export function updateEnvLocal(
  rootDir: string,
  vars: Record<string, string>
): void {
  const envPath = path.join(rootDir, ".env.local");

  let content = "";
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf8");
  }

  const lines = content.split("\n");
  const updated = new Set<string>();

  // Update existing keys in-place
  const newLines = lines.map((line) => {
    const match = /^([A-Z0-9_]+)=/.exec(line);
    if (match) {
      const key = match[1]!;
      if (key in vars) {
        updated.add(key);
        return `${key}=${vars[key]}`;
      }
    }
    return line;
  });

  // Append keys that didn't exist yet
  const toAppend = Object.entries(vars).filter(([k]) => !updated.has(k));

  if (toAppend.length > 0) {
    // Ensure trailing newline before appending
    if (newLines[newLines.length - 1] !== "") {
      newLines.push("");
    }
    for (const [k, v] of toAppend) {
      newLines.push(`${k}=${v}`);
    }
  }

  // Ensure single trailing newline
  let result = newLines.join("\n");
  result = result.replace(/\n+$/, "") + "\n";

  fs.writeFileSync(envPath, result, "utf8");
}
