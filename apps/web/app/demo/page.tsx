import Link from "next/link";

// ─── Arrows (decorative SVG) ─────────────────────────────────────────────────

function ArrowUp() {
  return (
    <svg
      viewBox="0 0 80 140"
      style={{ width: 80, height: 140, color: "var(--green-deep)" }}
      aria-hidden
    >
      <defs>
        <marker
          id="arrow-head-up"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      {/* Curving up-right path: starts at bottom-left, curves to top-right */}
      <path
        d="M 20 130 Q 20 60 70 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        markerEnd="url(#arrow-head-up)"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 200 100"
      style={{ width: 200, height: 100, color: "var(--green-deep)" }}
      aria-hidden
    >
      <defs>
        <marker
          id="arrow-head-right"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <path
        d="M 10 50 Q 100 20 185 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        markerEnd="url(#arrow-head-right)"
      />
    </svg>
  );
}

// ─── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--record)",
        color: "var(--paper-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
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
          textTransform: "uppercase",
          color: "var(--ink-mute)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e0644a" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d8a23a" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--green)" }} />
        </div>
        <span>{filename}</span>
        <span>tsx</span>
      </div>
      <div style={{ padding: "18px 20px", lineHeight: 1.7, overflowX: "auto" }}>{children}</div>
    </div>
  );
}

const C = {
  key: { color: "var(--ochre)" },
  str: { color: "#c7e0a8" },
  sym: { color: "#e8c486" },
  cmt: { color: "var(--ink-mute)", fontStyle: "italic" as const },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  return (
    <>
      {/* Header */}
      <section style={{ padding: "60px 0 40px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
              marginBottom: 18,
            }}
          >
            <Link href="/" style={{ color: "var(--ink-mute)", textDecoration: "none" }}>
              SpotLive
            </Link>
            <span>/</span>
            <span style={{ color: "var(--ink)" }}>Demo</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              margin: "0 0 14px",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Already <em style={{ color: "var(--green-deep)" }}>running.</em>
          </h1>
          <p
            style={{
              color: "var(--ink-soft)",
              maxWidth: 640,
              fontSize: "1.08rem",
              margin: "0 0 20px",
            }}
          >
            Both widgets are already mounted on this page — cycling through The Weeknd&apos;s
            catalogue as a stand-in for what your own Spotify activity will look like.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: "var(--paper-2)",
              borderLeft: "3px solid var(--ochre)",
              fontSize: "0.84rem",
              color: "var(--ink-soft)",
              maxWidth: 640,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ochre)",
                fontWeight: 500,
              }}
            >
              Note
            </span>
            <span>
              This is mocked data — each track is fast-forwarded to play through in
              14 seconds so you can see several covers without waiting. Real
              playback runs at normal speed.
            </span>
          </div>

          {/* Mobile-only notice */}
          <div
            className="rwd-show-md"
            style={{
              marginTop: 16,
              padding: "14px 18px",
              borderRadius: 8,
              background: "var(--paper-2)",
              borderLeft: "3px solid var(--green-deep)",
              fontSize: "0.92rem",
              color: "var(--ink-soft)",
              lineHeight: 1.55,
              maxWidth: 640,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--green-deep)",
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Heads up
            </div>
            The live widgets — the player in the nav bar and the vinyl peeking
            from the right edge — are hidden on small screens to keep the
            layout readable. Please open this site on a desktop browser to see
            them in action.
          </div>
        </div>
      </section>

      {/* Tour cards */}
      <section
        className="rwd-stack rwd-container"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 40px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* Player callout — points UP to the nav */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <div style={{ marginLeft: "auto", marginRight: 24 }}>
            <ArrowUp />
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--ink)",
                color: "var(--paper)",
                padding: "6px 14px",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              variant=&quot;player&quot;
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                margin: "0 0 10px",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              That pill in the nav bar.
            </h2>
            <p style={{ color: "var(--ink-soft)", margin: "0 0 20px" }}>
              Compact enough to slot into any header — shows the current track, artist,
              elapsed time, and a fake set of media controls (decorative only).
            </p>
          </div>
          <CodeBlock filename="app/layout.tsx">
            <span style={C.cmt}>{`// inside your <header> or nav`}</span>
            <br />
            <span style={C.key}>import</span>
            {" { "}
            <span style={C.sym}>SpotLive</span>
            {" } "}
            <span style={C.key}>from</span>{" "}
            <span style={C.str}>&quot;@/app/components/SpotLive&quot;</span>;
            <br />
            <br />
            &lt;<span style={C.sym}>SpotLive</span>{" "}
            <span style={C.key}>variant</span>=
            <span style={C.str}>&quot;player&quot;</span> /&gt;
          </CodeBlock>
        </div>

        {/* Vinyl callout — points RIGHT to the page edge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <div style={{ marginLeft: "auto", marginRight: -20 }}>
            <ArrowRight />
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--green-deep)",
                color: "var(--paper)",
                padding: "6px 14px",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              variant=&quot;vinyl&quot;
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                margin: "0 0 10px",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              That record on the right.
            </h2>
            <p style={{ color: "var(--ink-soft)", margin: "0 0 20px" }}>
              Fixed to the page edge, tilted, peeking out about a third. Hover anywhere
              over the card and it slides out to reveal the spinning disc.
            </p>
          </div>
          <CodeBlock filename="app/layout.tsx">
            <span style={C.cmt}>{`// drop once in your root layout`}</span>
            <br />
            <span style={C.key}>import</span>
            {" { "}
            <span style={C.sym}>SpotLive</span>
            {" } "}
            <span style={C.key}>from</span>{" "}
            <span style={C.str}>&quot;@/app/components/SpotLive&quot;</span>;
            <br />
            <br />
            &lt;<span style={C.sym}>SpotLive</span>{" "}
            <span style={C.key}>variant</span>=
            <span style={C.str}>&quot;vinyl&quot;</span>{" "}
            <span style={C.key}>position</span>=
            <span style={C.str}>&quot;right&quot;</span> /&gt;
          </CodeBlock>
        </div>
      </section>

      {/* Sample payload */}
      <div style={{ maxWidth: 1200, margin: "60px auto 80px", padding: "0 40px" }}>
        <h3
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
            margin: "0 0 16px",
          }}
        >
          Sample payload — what the route handler returns
        </h3>
        <div
          style={{
            background: "var(--record)",
            color: "var(--paper-2)",
            borderRadius: 14,
            padding: "24px 28px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            lineHeight: 1.7,
            overflowX: "auto",
          }}
        >
          <span style={{ color: "var(--ink-mute)" }}>{`// GET /api/spotify`}</span>
          <br />
          {"{"}
          <br />
          &nbsp;&nbsp;<span style={C.key}>&quot;isPlaying&quot;</span>:{" "}
          <span style={{ color: "#9cc4ff" }}>true</span>,
          <br />
          &nbsp;&nbsp;<span style={C.key}>&quot;title&quot;</span>:{" "}
          <span style={C.str}>&quot;Blinding Lights&quot;</span>,
          <br />
          &nbsp;&nbsp;<span style={C.key}>&quot;artist&quot;</span>:{" "}
          <span style={C.str}>&quot;The Weeknd&quot;</span>,
          <br />
          &nbsp;&nbsp;<span style={C.key}>&quot;albumArt&quot;</span>:{" "}
          <span style={C.str}>&quot;https://i.scdn.co/image/…&quot;</span>,
          <br />
          &nbsp;&nbsp;<span style={C.key}>&quot;progress&quot;</span>:{" "}
          <span style={{ color: "#e8aa6a" }}>42031</span>,
          <br />
          &nbsp;&nbsp;<span style={C.key}>&quot;duration&quot;</span>:{" "}
          <span style={{ color: "#e8aa6a" }}>200000</span>
          <br />
          {"}"}
        </div>
      </div>

      {/* CTA */}
      <section
        style={{
          borderTop: "1px solid var(--rule)",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
            margin: "0 0 16px",
            fontWeight: 400,
          }}
        >
          Wire it up.
        </h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: 520, margin: "0 auto 32px" }}>
          One CLI command, two env vars, a Spotify app — and these widgets show your
          actual music instead of The Weeknd&apos;s.
        </p>
        <Link
          href="/docs"
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
          Read the docs
        </Link>
      </section>
    </>
  );
}
