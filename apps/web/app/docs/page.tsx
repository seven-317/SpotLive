import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs — SpotLive",
  description: "Install guide for SpotLive — the Spotify now-playing component for Next.js.",
};

/* ---- Reusable CLI Block ---- */
function CliBlock({
  filename,
  lang,
  children,
}: {
  filename: string;
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--record)",
        color: "var(--paper-2)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 24px 60px -30px rgba(22,17,8,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
        margin: "20px 0 28px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "var(--record-2)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: "0.7rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: "var(--ink-mute)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#e0644a", "#d8a23a", "var(--green)"].map((bg, i) => (
            <span
              key={i}
              style={{ width: 10, height: 10, borderRadius: "50%", background: bg }}
            />
          ))}
        </div>
        <span>{filename}</span>
        <span style={{ color: "var(--ink-mute)" }}>{lang}</span>
      </div>
      <div style={{ padding: "18px 20px", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

/* ---- Note block ---- */
function Note({
  tag,
  children,
  warn,
}: {
  tag: string;
  children: React.ReactNode;
  warn?: boolean;
}) {
  return (
    <div
      style={{
        margin: "24px 0",
        padding: "18px 22px",
        background: "var(--paper-2)",
        borderLeft: `3px solid ${warn ? "var(--orange)" : "var(--green-deep)"}`,
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.66rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: warn ? "var(--orange)" : "var(--green-deep)",
          marginBottom: 6,
        }}
      >
        {tag}
      </div>
      {children}
    </div>
  );
}

/* ---- Inline code ---- */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
        background: "var(--paper-2)",
        padding: "2px 8px",
        borderRadius: 4,
        border: "1px solid var(--rule)",
      }}
    >
      {children}
    </code>
  );
}

export default function DocsPage() {
  const h2Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 400,
    fontSize: "2.2rem",
    margin: "80px 0 14px",
    lineHeight: 1.05,
    paddingTop: 8,
  };

  const h3Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 400,
    fontSize: "1.45rem",
    margin: "36px 0 10px",
    lineHeight: 1.2,
  };

  const pStyle: React.CSSProperties = {
    color: "var(--ink)",
    fontSize: "1rem",
    margin: "12px 0 16px",
  };

  return (
    <>
      {/* Header bar */}
      <div
        style={{
          background: "var(--paper-2)",
          padding: "36px 0",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div
          className="rwd-container"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
              margin: 0,
              lineHeight: 1,
              fontWeight: 400,
            }}
          >
            Install{" "}
            <em style={{ color: "var(--green-deep)" }}>guide</em>
          </h1>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: "var(--ink-mute)",
            }}
          >
            <span>v0.1.0</span>
            <span>·</span>
            <span>
              <strong style={{ color: "var(--ink)" }}>MIT</strong> licensed
            </span>
            <span>·</span>
            <span>
              Node <strong style={{ color: "var(--ink)" }}>≥ 18</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Docs shell */}
      <div
        className="rwd-docs-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 240px",
          gap: 60,
          maxWidth: 1320,
          margin: "0 auto",
          padding: "60px 40px 120px",
          alignItems: "start",
        }}
      >
        {/* TOC */}
        <aside className="rwd-docs-aside" style={{ position: "sticky", top: 100 }}>
          <h4
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
              margin: "0 0 14px",
            }}
          >
            On this page
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 4 }}>
            {[
              { href: "#start", label: "Getting started" },
              { href: "#install", label: "Install with CLI" },
              { href: "#spotify", label: "Spotify credentials" },
              { href: "#env", label: "Environment variables" },
              { href: "#use", label: "Using the component" },
              { href: "#props", label: "Props reference" },
              { href: "#api", label: "The API route" },
              { href: "#troubleshoot", label: "Troubleshooting" },
            ].map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: i === 0 ? "var(--ink)" : "var(--ink-soft)",
                    fontSize: "0.92rem",
                    padding: "6px 12px",
                    borderRadius: 6,
                    borderLeft: `2px solid ${i === 0 ? "var(--green-deep)" : "transparent"}`,
                    background: i === 0 ? "var(--paper-2)" : "transparent",
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main>
          {/* ---- Getting started ---- */}
          <section id="start">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(3rem, 5vw, 4.4rem)",
                lineHeight: 1,
                margin: "0 0 8px",
                letterSpacing: "-0.01em",
              }}
            >
              Get it <em style={{ color: "var(--green-deep)" }}>spinning.</em>
            </h1>
            <p
              style={{
                color: "var(--ink-soft)",
                fontSize: "1.1rem",
                maxWidth: 640,
                margin: "0 0 40px",
              }}
            >
              SpotLive is a single component plus a tiny API route that turns
              your Spotify activity into a live widget on your site. This page
              is the entire manual — under five minutes if you have your dev
              console open.
            </p>

            <Note tag="Requirements">
              <strong>Node 18 or later</strong>, a Next.js App Router project,
              and a free Spotify developer account. Pages Router is not
              supported.
            </Note>
          </section>

          {/* ---- 01 Install with CLI ---- */}
          <h2 id="install" style={h2Style}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
                marginRight: 16,
                verticalAlign: "middle",
              }}
            >
              01
            </span>
            Install with CLI
          </h2>
          <p style={pStyle}>
            The fastest path. One command scaffolds the component, the API
            route, and walks you through the OAuth flow.
          </p>

          <CliBlock filename="terminal" lang="zsh">
            <span style={{ color: "var(--green)" }}>$</span> npx spotlive init
          </CliBlock>

          <p style={pStyle}>That single command will:</p>
          <ol style={{ color: "var(--ink)", paddingLeft: 24 }}>
            <li style={{ marginBottom: 8 }}>
              Detect <Code>next</Code> in your <Code>package.json</Code> and
              confirm App Router layout
            </li>
            <li style={{ marginBottom: 8 }}>
              Drop <Code>SpotLive.tsx</Code> into{" "}
              <Code>components/spotlive/</Code>
            </li>
            <li style={{ marginBottom: 8 }}>
              Add a route handler at <Code>app/api/spotify/route.ts</Code>
            </li>
            <li style={{ marginBottom: 8 }}>
              Open your browser for the Spotify OAuth consent flow and write
              the resulting refresh token to <Code>.env.local</Code>
            </li>
          </ol>

          {/* ---- 02 Spotify credentials ---- */}
          <h2 id="spotify" style={h2Style}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
                marginRight: 16,
                verticalAlign: "middle",
              }}
            >
              02
            </span>
            Spotify credentials
          </h2>
          <p style={pStyle}>
            You&apos;ll need three values from the Spotify developer console.
            SpotLive&apos;s CLI opens the right pages automatically, but
            here&apos;s the manual path:
          </p>
          <ol style={{ color: "var(--ink)", paddingLeft: 24 }}>
            <li style={{ marginBottom: 8 }}>
              Go to <Code>developer.spotify.com/dashboard</Code> and create an
              app.
            </li>
            <li style={{ marginBottom: 8 }}>
              Copy the <strong>Client ID</strong> and{" "}
              <strong>Client Secret</strong>.
            </li>
            <li style={{ marginBottom: 8 }}>
              Add{" "}
              <Code>http://127.0.0.1:8888/callback</Code> as a Redirect URI.
            </li>
            <li style={{ marginBottom: 8 }}>
              Run <Code>npx spotlive init</Code> — the CLI opens the browser
              OAuth consent flow and prints your{" "}
              <strong>refresh token</strong>.
            </li>
          </ol>

          <Note tag="Keep secret" warn>
            The client secret and refresh token are server-only. Never expose
            them with a <Code>NEXT_PUBLIC_</Code> prefix or in client-side
            code.
          </Note>

          {/* ---- 03 Env vars ---- */}
          <h2 id="env" style={h2Style}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
                marginRight: 16,
                verticalAlign: "middle",
              }}
            >
              03
            </span>
            Environment variables
          </h2>
          <p style={pStyle}>
            After <Code>npx spotlive init</Code> your <Code>.env.local</Code>{" "}
            will contain:
          </p>

          <CliBlock filename=".env.local" lang="env">
            <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
              # SpotLive
            </span>
            <br />
            <span style={{ color: "var(--ochre)" }}>SPOTIFY_CLIENT_ID</span>=
            <span style={{ color: "#e8c486" }}>a1b2c3d4e5f6...</span>
            <br />
            <span style={{ color: "var(--ochre)" }}>SPOTIFY_CLIENT_SECRET</span>=
            <span style={{ color: "#e8c486" }}>x9y8z7w6v5u4...</span>
            <br />
            <span style={{ color: "var(--ochre)" }}>SPOTIFY_REFRESH_TOKEN</span>=
            <span style={{ color: "#e8c486" }}>AQDxyz...truncated</span>
          </CliBlock>

          <div
            className="rwd-stack"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              margin: "20px 0 28px",
            }}
          >
            {[
              {
                key: "SPOTIFY_CLIENT_ID",
                desc: "From your Spotify app's settings page.",
              },
              {
                key: "SPOTIFY_CLIENT_SECRET",
                desc: "From the same page, behind a \"show client secret\" toggle. Treat it like a password.",
              },
              {
                key: "SPOTIFY_REFRESH_TOKEN",
                desc: "Generated by the CLI's OAuth flow. SpotLive uses it to mint short-lived access tokens.",
              },
            ].map((v) => (
              <div
                key={v.key}
                style={{
                  background: "var(--paper-2)",
                  padding: 18,
                  borderRadius: 10,
                  boxShadow: "inset 0 0 0 1px var(--rule)",
                }}
              >
                <code
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    color: "var(--green-deep)",
                  }}
                >
                  {v.key}
                </code>
                <p
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: "0.86rem",
                    margin: "6px 0 0",
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ---- 04 Using the component ---- */}
          <h2 id="use" style={h2Style}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
                marginRight: 16,
                verticalAlign: "middle",
              }}
            >
              04
            </span>
            Using the component
          </h2>
          <p style={pStyle}>Import it anywhere in your App Router pages:</p>

          <CliBlock filename="app/page.tsx" lang="tsx">
            <span style={{ color: "var(--ochre)" }}>import</span>
            {" { "}
            <span style={{ color: "#e8c486" }}>SpotLive</span>
            {" } "}
            <span style={{ color: "var(--ochre)" }}>from</span>{" "}
            <span style={{ color: "#c7e0a8" }}>
              &quot;@/components/spotlive/SpotLive&quot;
            </span>
            ;
            <br />
            <br />
            <span style={{ color: "var(--ochre)" }}>export default function</span>{" "}
            <span style={{ color: "#e8c486" }}>Home</span>() {"{"}
            <br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>return</span> (
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: "#e8c486" }}>main</span>&gt;
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{/* vinyl variant, fixed to the right */}`}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: "#e8c486" }}>SpotLive</span>{" "}
            <span style={{ color: "var(--ochre)" }}>variant</span>=
            <span style={{ color: "#c7e0a8" }}>&quot;vinyl&quot;</span>{" "}
            <span style={{ color: "var(--ochre)" }}>position</span>=
            <span style={{ color: "#c7e0a8" }}>&quot;right&quot;</span> /&gt;
            <br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{/* player card, inline */}`}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: "#e8c486" }}>SpotLive</span>{" "}
            <span style={{ color: "var(--ochre)" }}>variant</span>=
            <span style={{ color: "#c7e0a8" }}>&quot;player&quot;</span> /&gt;
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span style={{ color: "#e8c486" }}>main</span>&gt;
            <br />
            &nbsp;&nbsp;);
            <br />
            {"}"}
          </CliBlock>

          {/* ---- 05 Props ---- */}
          <h2 id="props" style={h2Style}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
                marginRight: 16,
                verticalAlign: "middle",
              }}
            >
              05
            </span>
            Props reference
          </h2>

          <div style={{ overflowX: "auto", margin: "16px 0 28px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.92rem",
            }}
          >
            <thead>
              <tr>
                {["Prop", "Type", "Default", "Notes"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderBottom: "1px solid var(--ink)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink-mute)",
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  prop: "variant",
                  type: '"vinyl" | "player"',
                  def: '"player"',
                  notes: "Visual style. Vinyl spins; player shows a card.",
                },
                {
                  prop: "pollInterval",
                  type: "number",
                  def: "10000",
                  notes: "Polling interval in ms. Lower = more API calls.",
                },
                {
                  prop: "position",
                  type: '"left" | "right"',
                  def: '"right"',
                  notes: "Fixed position side (vinyl variant only).",
                },
              ].map((row) => (
                <tr key={row.prop}>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid var(--rule)",
                      fontFamily: "var(--font-mono)",
                      color: "var(--green-deep)",
                      whiteSpace: "nowrap",
                      verticalAlign: "top",
                    }}
                  >
                    {row.prop}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid var(--rule)",
                      fontFamily: "var(--font-mono)",
                      color: "var(--ink-mute)",
                      fontSize: "0.82rem",
                      whiteSpace: "nowrap",
                      verticalAlign: "top",
                    }}
                  >
                    {row.type}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid var(--rule)",
                      fontFamily: "var(--font-mono)",
                      color: "var(--ink-mute)",
                      fontSize: "0.82rem",
                      whiteSpace: "nowrap",
                      verticalAlign: "top",
                    }}
                  >
                    {row.def}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid var(--rule)",
                      verticalAlign: "top",
                    }}
                  >
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* ---- 06 API route ---- */}
          <h2 id="api" style={h2Style}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
                marginRight: 16,
                verticalAlign: "middle",
              }}
            >
              06
            </span>
            The API route
          </h2>
          <p style={pStyle}>
            SpotLive ships its own route handler at <Code>/api/spotify</Code>.
            The handler:
          </p>
          <ul style={{ color: "var(--ink)", paddingLeft: 24 }}>
            <li style={{ marginBottom: 8 }}>reads your env vars,</li>
            <li style={{ marginBottom: 8 }}>
              exchanges the refresh token for a short-lived access token (cached
              in memory),
            </li>
            <li style={{ marginBottom: 8 }}>
              calls <Code>/v1/me/player/currently-playing</Code>,
            </li>
            <li style={{ marginBottom: 8 }}>
              normalizes the response into the payload below.
            </li>
          </ul>

          <CliBlock filename="GET /api/spotify" lang="json">
            {"{"}
            <br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;isPlaying&quot;</span>:{" "}
            <span style={{ color: "#9cc4ff" }}>true</span>,
            <br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;title&quot;</span>:{" "}
            <span style={{ color: "#c7e0a8" }}>&quot;Dreams&quot;</span>,
            <br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;artist&quot;</span>:{" "}
            <span style={{ color: "#c7e0a8" }}>&quot;Fleetwood Mac&quot;</span>,
            <br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;albumArt&quot;</span>:{" "}
            <span style={{ color: "#c7e0a8" }}>&quot;https://i.scdn.co/image/…&quot;</span>,
            <br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;progress&quot;</span>:{" "}
            <span style={{ color: "#e8aa6a" }}>42031</span>,
            <br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;duration&quot;</span>:{" "}
            <span style={{ color: "#e8aa6a" }}>254000</span>
            <br />
            {"}"}
          </CliBlock>

          {/* ---- 07 Troubleshooting ---- */}
          <h2 id="troubleshoot" style={h2Style}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
                marginRight: 16,
                verticalAlign: "middle",
              }}
            >
              07
            </span>
            Troubleshooting
          </h2>

          <h3 style={h3Style}>&quot;Failed to refresh access token&quot;</h3>
          <p style={pStyle}>
            Your refresh token is wrong or has been revoked. Re-run{" "}
            <Code>npx spotlive init</Code> to go through the OAuth flow again
            and replace <Code>SPOTIFY_REFRESH_TOKEN</Code> in{" "}
            <Code>.env.local</Code>.
          </p>

          <h3 style={h3Style}>
            The widget shows &quot;off-air&quot; while I&apos;m clearly playing
            music
          </h3>
          <p style={pStyle}>
            Spotify only returns a current track if a device is active. Open
            the Spotify desktop or mobile app — even briefly — and the next
            poll will pick it up.
          </p>

          <h3 style={h3Style}>I deployed and nothing shows up</h3>
          <p style={pStyle}>
            You forgot to set the three env vars in your hosting provider.
            Local <Code>.env.local</Code> doesn&apos;t ship with your bundle.
            Add <Code>SPOTIFY_CLIENT_ID</Code>,{" "}
            <Code>SPOTIFY_CLIENT_SECRET</Code>, and{" "}
            <Code>SPOTIFY_REFRESH_TOKEN</Code> in your provider&apos;s
            environment settings.
          </p>

          <hr style={{ border: "none", borderTop: "1px solid var(--rule)", margin: "60px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ink-mute)",
                  marginBottom: 6,
                }}
              >
                Next
              </div>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "1.45rem" }}>
                <Link
                  href="/demo"
                  style={{ color: "var(--green-deep)", textDecoration: "none" }}
                >
                  See it spinning →
                </Link>
              </h3>
            </div>
            <Link
              href="/demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
              }}
            >
              Open demo
            </Link>
          </div>
        </main>

        {/* Side meta */}
        <aside className="rwd-docs-aside" style={{ position: "sticky", top: 100, display: "grid", gap: 28 }}>
          {/* Package info */}
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: "var(--paper-2)",
              boxShadow: "inset 0 0 0 1px var(--rule)",
            }}
          >
            <h5
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-mute)",
                margin: "0 0 12px",
              }}
            >
              Package
            </h5>
            {[
              ["Version", "0.1.0"],
              ["License", "MIT"],
              ["Node", "≥ 18"],
              ["Deps", "0"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px dashed var(--rule)",
                  fontSize: "0.86rem",
                }}
              >
                <span>{k}</span>
                <span
                  style={{ fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: "var(--paper-2)",
              boxShadow: "inset 0 0 0 1px var(--rule)",
            }}
          >
            <h5
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-mute)",
                margin: "0 0 12px",
              }}
            >
              Quick links
            </h5>
            {[
              ["#install", "CLI install"],
              ["#spotify", "Spotify creds"],
              ["#props", "Props"],
              ["#api", "API route"],
              ["#troubleshoot", "Troubleshooting"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  display: "block",
                  padding: "6px 0",
                  color: "var(--ink)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ color: "var(--green-deep)", marginRight: 8 }}>→</span>
                {label}
              </a>
            ))}
          </div>

          {/* Support */}
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: "var(--paper-2)",
              boxShadow: "inset 0 0 0 1px var(--rule)",
            }}
          >
            <h5
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-mute)",
                margin: "0 0 12px",
              }}
            >
              Support
            </h5>
            <p
              style={{
                fontSize: "0.86rem",
                color: "var(--ink-soft)",
                marginBottom: 12,
              }}
            >
              Found a bug, or wired SpotLive into something cool?
            </p>
            <a
              href="https://github.com/seven-317/SpotLive/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--ink)",
                boxShadow: "inset 0 0 0 1px var(--ink)",
                textDecoration: "none",
              }}
            >
              Open an issue
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
