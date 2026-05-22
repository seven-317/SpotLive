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

const REDIRECT_URI = "http://127.0.0.1:8888/callback";

// ─── Credential prompting ────────────────────────────────────────────────────

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
}

function promptLine(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function promptCredentials(): Promise<SpotifyCredentials> {
  const clientId = await promptLine("Spotify Client ID: ");
  const clientSecret = await promptLine("Spotify Client Secret: ");
  return { clientId, clientSecret };
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
      const reqUrl = new URL(req.url ?? "/", "http://127.0.0.1:8888");

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
    server.listen(8888, "127.0.0.1", () => resolve());
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

  const toAppend = Object.entries(vars).filter(([k]) => !updated.has(k));

  if (toAppend.length > 0) {
    if (newLines[newLines.length - 1] !== "") {
      newLines.push("");
    }
    for (const [k, v] of toAppend) {
      newLines.push(`${k}=${v}`);
    }
  }

  let result = newLines.join("\n");
  result = result.replace(/\n+$/, "") + "\n";

  fs.writeFileSync(envPath, result, "utf8");
}
