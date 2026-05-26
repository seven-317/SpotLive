[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/seven317)

![badge](https://shieldcn.dev/npm/spotlive.png) ![badge](https://shieldcn.dev/npm/node/spotlive.png) ![badge](https://shieldcn.dev/npm/types/spotlive.png) ![badge](https://shieldcn.dev/npm/dm/spotlive.svg) ![badge](https://shieldcn.dev/npm/license/spotlive.png)

# SpotLive

A drop-in **Spotify "Now Playing"** widget for Next.js — shadcn/ui style. One CLI command copies a `SpotLive.tsx` component and an `/api/spotify` route handler straight into your project. Zero UI dependencies, zero runtime libraries; just React + Tailwind.

```bash
npx spotlive init
```

- **Two variants** — a peek-out spinning vinyl record, or a compact nav-bar pill
- **Real Spotify integration** — secure server-side OAuth refresh-token flow
- **Demo mode** — pass `demoData` to cycle through tracks without setting up Spotify
- **Node 18+**, **Next.js App Router**, **Tailwind CSS**

---

## Requirements

| | |
|---|---|
| Node.js | `>= 18` (native `fetch`) |
| Framework | Next.js App Router (Pages Router not supported) |
| Styling | Tailwind CSS (the component uses Tailwind utility classes) |
| Spotify | A **Spotify Premium** account ([see below](#-important-spotify-api-policy-changes-2026)) |

### ⚠ Important: Spotify API policy changes (2026)

Spotify tightened its Developer Mode policy in February 2026. As of **March 9 2026**, any app in Developer Mode (which is where personal projects like this live until they apply for Extended Quota mode) is subject to:

| Restriction | Detail |
|---|---|
| **Premium required** | The Spotify account that owns the developer app must be on a paid **Premium** subscription. Free accounts can no longer create or maintain Developer Mode apps. |
| **One app per developer** | Each Spotify account is limited to **one** active Client ID. If you've hit the cap, you'll need to delete an existing app before creating a new one. |
| **Five test users per app** | The owner counts as one. The remaining four slots are for users you explicitly add by email — only those accounts can authenticate against your app while it's in Developer Mode. (Down from 25.) |
| **Extended Quota mode** | Lifts the test-user cap, but now requires a registered business, 250 k+ MAU, and an active live service. Not realistic for personal portfolio sites — most SpotLive users will stay in Developer Mode. |

**What this means in practice for SpotLive:**

- ✅ You can ship SpotLive on your personal site if **you** are on Premium.
- ✅ Other Premium accounts you explicitly add as test users will also see their now-playing data (up to 4 of them).
- ❌ A Free-tier Spotify account cannot create the app at all.
- ℹ SpotLive only ever reads **your own** account, so the test-user cap doesn't normally matter — the OAuth flow is run once during `spotlive init`.

Sources:
[TechCrunch — Spotify changes developer mode API](https://techcrunch.com/2026/02/06/spotify-changes-developer-mode-api-to-require-premium-accounts-limits-test-users/) · [Spotify for Developers — Quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) · [Community thread on the 1-app cap](https://community.spotify.com/t5/Spotify-for-Developers/Create-app-Limit-reached-with-1-app/td-p/7359011)

---

## Installation

### 1. Create a Spotify app

> Make sure the Spotify account you're using is on **Premium** and doesn't already have a developer app. See [policy changes](#-important-spotify-api-policy-changes-2026).

1. Go to <https://developer.spotify.com/dashboard> and click **Create app**.
   - If you see `Create app Limit reached`, delete an existing app first — each account gets one.
2. Fill in any name/description. Under **Redirect URIs**, add:
   ```
   http://127.0.0.1:8888/callback
   ```
   > ⚠ Spotify rejects `localhost` in newer dashboards — use `127.0.0.1` exactly.
3. Check **Web API**, save.
4. Copy your **Client ID** and **Client Secret** (the secret sits behind a "View client secret" toggle).

### 2. Run the CLI

Inside your Next.js project root:

```bash
npx spotlive init
```

The CLI will:

1. Detect your Next.js App Router project (and check Tailwind / `@/*` alias)
2. Prompt for your Spotify **Client ID** and **Client Secret**
3. Open `https://accounts.spotify.com/authorize` in your browser
4. Catch the OAuth callback on `http://127.0.0.1:8888/callback`
5. Exchange the code for a **refresh token**
6. Append `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` to `.env.local`
7. Write two files:
   - `app/components/SpotLive.tsx` — the React component
   - `app/api/spotify/route.ts` — the API route handler

If either file already exists you'll be asked: **\[O]verwrite / \[S]kip / \[B]ackup** (backup renames the old file to `*.bak.<timestamp>.tsx`).

### 3. Mount the component

```tsx
// app/layout.tsx
import { SpotLive } from "@/app/components/SpotLive";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <SpotLive variant="vinyl" />
      </body>
    </html>
  );
}
```

Run `npm run dev`, play a song on any Spotify device, and the vinyl appears on the right edge of every page.

---

## Component API

```tsx
<SpotLive
  variant="player" | "vinyl"        // default: "player"
  position="left" | "right"          // vinyl only, default: "right"
  pollInterval={10_000}              // ms, default: 10 000
  showProgress={false}               // opt-in progress bar, default: false
  demoData={[ /* DemoTrack[] */ ]}   // skip API, cycle through these instead
  demoCycleMs={14_000}               // demo rotation speed, default: 14 000
  embedded={false}                   // disables fixed/peek for inline use
/>
```

### `variant="player"`

A compact pill (≈40 px tall) showing thumbnail, title, artist, time and three faux controls (prev / play-pause / next — decorative only). Inline-flowed — drop it into a nav bar or sidebar:

```tsx
<nav>
  <Brand />
  <NavLinks />
  <SpotLive variant="player" />
</nav>
```

### `variant="vinyl"`

A tilted card containing a spinning record. Fixed to the side of the page, peeks out about a third by default, slides further on hover.

```tsx
<SpotLive variant="vinyl" position="right" />
```

The disc pauses when nothing is playing.

### Demo mode

No Spotify account? Pass your own track data:

```tsx
const FAKE = [
  { title: "Blinding Lights", artist: "The Weeknd", albumArt: "/cover.svg", duration: 200_000 },
  // ...
];

<SpotLive variant="player" demoData={FAKE} />
```

The widget cycles through each track every 14 seconds (configurable) and ignores `/api/spotify` entirely.

### Embedded mode

`variant="vinyl"` is fixed-positioned by default. Pass `embedded` to render it inline (e.g. in a showcase grid):

```tsx
<div className="grid grid-cols-2 gap-8">
  <SpotLive variant="vinyl" embedded />
  <SpotLive variant="player" />
</div>
```

---

## Environment variables

After `spotlive init`, your `.env.local` should look like:

```bash
SPOTIFY_CLIENT_ID=a1b2c3...
SPOTIFY_CLIENT_SECRET=x9y8z7...
SPOTIFY_REFRESH_TOKEN=AQDxyz...
```

All three are **server-only**. Never prefix them with `NEXT_PUBLIC_` and never reference them from client code — the bundled `/api/spotify` route handler is the only thing that should touch them.

---

## How the API route works

`app/api/spotify/route.ts` exports a single `GET` handler that:

1. Reads the three env vars
2. Exchanges the refresh token for a short-lived access token (cached in-memory with a 30 s expiry buffer)
3. Calls `GET /v1/me/player/currently-playing`
4. Normalizes the response into:

```json
{
  "isPlaying": true,
  "title": "Blinding Lights",
  "artist": "The Weeknd",
  "albumArt": "https://i.scdn.co/image/…",
  "progress": 42031,
  "duration": 200000
}
```

If nothing is playing (Spotify returns `204`), the response is just `{ "isPlaying": false }`.

A `Cache-Control: public, s-maxage=5, stale-while-revalidate=10` header tames upstream rate-limit pressure.

---

## Deployment

SpotLive is just a regular Next.js component + route — it deploys anywhere Next.js does. The only thing you need to remember is to **set the three env vars in your hosting provider** (your local `.env.local` never ships).

### Vercel

```bash
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET
vercel env add SPOTIFY_REFRESH_TOKEN
vercel --prod
```

Or paste them into **Project Settings → Environment Variables** in the dashboard. Mark all three as **Production / Preview / Development**.

### Netlify

```
Site settings → Environment variables → Add a variable
```

Add `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, then redeploy.

### Self-hosted (Docker, VPS, etc.)

Just expose the three env vars to your Node process:

```bash
SPOTIFY_CLIENT_ID=... \
SPOTIFY_CLIENT_SECRET=... \
SPOTIFY_REFRESH_TOKEN=... \
node .next/standalone/server.js
```

### After deploying

The Spotify dashboard's Redirect URI (`http://127.0.0.1:8888/callback`) only matters for the **initial** `spotlive init` OAuth handshake. Once you have the refresh token, you don't need that URI in production — the deployed app uses the token directly and never opens a browser flow.

---

## Troubleshooting

**`Create app Limit reached` on the Spotify dashboard**
As of 2026, each Spotify account is allowed one developer app. Delete an existing app (Dashboard → app → Settings → Delete) or use a different Premium account.

**The Spotify dashboard refuses to let you create an app**
Your account is probably on the Free tier. Spotify requires **Premium** for Developer Mode apps as of March 9 2026. Upgrade the account or use a different one.

**`Failed to refresh access token`**
The refresh token is wrong or has been revoked. Re-run `npx spotlive init` to mint a new one. Tokens also stop working if the owning account drops off Premium.

**Widget shows nothing while music is playing**
Spotify only returns a track if a **device is active**. Open the Spotify desktop or mobile app, even briefly — the next 10-second poll picks it up.

**`redirect_uri: Not matching configuration`**
The CLI sends `http://127.0.0.1:8888/callback`. Make sure that exact string (no trailing slash, no `https://`, not `localhost`) is in your Spotify app's Redirect URIs.

**Deployed but nothing shows up**
You forgot to set the three env vars in your hosting provider. Local `.env.local` does not ship in the build.

**TypeScript can't find `@/app/components/SpotLive`**
Your `tsconfig.json` doesn't have the `@/*` path alias. Either add one:
```json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```
…or import with a relative path: `from "./components/SpotLive"`.

---

## Local development of this repo

If you're hacking on SpotLive itself (not just consuming it):

```bash
# 1. Build the CLI
cd packages/cli
npm install
npm run build
npm link        # exposes `spotlive` globally

# 2. Test against a real Next.js project
cd ~/some-nextjs-app
spotlive init   # uses your local build

# 3. Run the showcase site
cd apps/web
npm install
npm run dev     # http://localhost:3000

# 4. Tear down
npm unlink -g spotlive
```

Repo layout:

```
SpotLive/
├── packages/cli/        # The npx-installable CLI + templates
│   └── src/
│       ├── index.ts        # commander entry
│       ├── detect.ts       # Next.js project detection
│       ├── auth.ts         # OAuth flow + .env.local writer
│       ├── installer.ts    # File writing with conflict handling
│       └── templates/      # Component + route source (as strings)
└── apps/web/             # Official showcase site (Next.js 16)
    ├── app/
    ├── components/
    └── lib/weeknd-tracks.ts   # Demo data used by the site
```

## License

MIT. Not affiliated with Spotify AB.

## Star History

<a href="https://www.star-history.com/?repos=seven-317%2FSpotLive&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=seven-317/SpotLive&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=seven-317/SpotLive&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=seven-317/SpotLive&type=date&legend=top-left" />
 </picture>
</a>
