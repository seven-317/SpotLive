import Link from "next/link";
import { SpotLive } from "@/app/components/SpotLive";
import { WEEKND_TRACKS } from "@/lib/weeknd-tracks";

// First track only — for the hero, we want it to stay put (no cycling)
const HERO_TRACK = [WEEKND_TRACKS[0]!];

/* ---- tiny style helpers (inline) ---- */
const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 40px",
};

const section: React.CSSProperties = {
  padding: "100px 0",
  borderBottom: "1px solid var(--rule)",
};

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <header
        className="rwd-hero"
        style={{
          padding: "80px 0 120px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="rwd-stack rwd-container"
          style={{
            ...container,
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 999,
                background: "var(--paper-2)",
                color: "var(--ink-soft)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                boxShadow: "inset 0 0 0 1px var(--rule)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--green)",
                  animation: "pulse 1.6s ease-in-out infinite",
                }}
              />
              v0.1.0 · MIT-licensed · Node ≥ 18
            </span>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(3.4rem, 7vw, 6.4rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.015em",
                margin: "18px 0 24px",
              }}
            >
              Your{" "}
              <em style={{ color: "var(--green-deep)" }}>now&nbsp;playing</em>
              <br />
              belongs on
              <br />
              your website.
            </h1>

            <p
              style={{
                fontSize: "1.18rem",
                color: "var(--ink-soft)",
                maxWidth: 520,
                marginBottom: 32,
              }}
            >
              SpotLive is a drop-in component that streams what you&apos;re
              listening to on Spotify onto your personal site — as a real
              spinning record, or a clean player card. One CLI command, two env
              vars, done.
            </p>

            {/* CTAs */}
            <div
              style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}
            >
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
                Install in 60 seconds
              </Link>
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
                  background: "transparent",
                  color: "var(--ink)",
                  boxShadow: "inset 0 0 0 1px var(--ink)",
                  textDecoration: "none",
                }}
              >
                See the demo
              </Link>
            </div>

            {/* Meta stats */}
            <div
              style={{
                display: "flex",
                gap: 28,
                paddingTop: 24,
                borderTop: "1px solid var(--rule)",
              }}
            >
              {[
                { k: "Bundle size", v: "~12kb" },
                { k: "Dependencies", v: "0" },
                { k: "Frameworks", v: "Next · React" },
              ].map((m) => (
                <div key={m.k}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--ink-mute)",
                      marginBottom: 4,
                    }}
                  >
                    {m.k}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.6rem",
                    }}
                  >
                    {m.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero stage */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 540,
            }}
          >
            <div className="rwd-hero-scale" style={{ transform: "scale(1.5)", transformOrigin: "center" }}>
              <SpotLive variant="vinyl" embedded demoData={HERO_TRACK} />
            </div>

            {/* Price tag */}
            <div
              style={{
                position: "absolute",
                top: 30,
                right: 20,
                background: "var(--paper-2)",
                padding: "14px 18px",
                borderRadius: 4,
                boxShadow: "0 8px 20px -8px rgba(0,0,0,0.2)",
                transform: "rotate(6deg)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "1px dashed var(--ink-soft)",
              }}
            >
              <div>side A · 33 ⅓</div>
              <strong style={{ color: "var(--green-deep)", fontSize: "1.1rem", letterSpacing: 0 }}>
                $0.00
              </strong>
            </div>

            {/* Stamp */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 0,
                transform: "rotate(-12deg)",
                border: "2px solid var(--orange)",
                color: "var(--orange)",
                padding: "8px 14px",
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
                fontSize: "0.74rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              side · A · spotlive
            </div>
          </div>
        </div>
      </header>

      {/* ===== TWO STYLES ===== */}
      <section style={section}>
        <div style={container}>
          {/* Section label */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                margin: 0,
              }}
            >
              Two styles.{" "}
              <em style={{ color: "var(--green-deep)" }}>Same wire.</em>
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
              }}
            >
              01 / styles
            </span>
          </div>

          {/* Grid */}
          <div
            className="rwd-stack"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
            }}
          >
            {/* Vinyl card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 32,
                padding: "48px 32px",
                borderRadius: 18,
                background: "var(--paper-2)",
                boxShadow: "inset 0 0 0 1px var(--rule)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -12,
                  left: 32,
                  background: "var(--ink)",
                  color: "var(--paper)",
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.66rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                variant=&quot;vinyl&quot;
              </span>
              <SpotLive variant="vinyl" embedded demoData={WEEKND_TRACKS} />
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    margin: "0 0 12px",
                  }}
                >
                  The Vinyl
                </h3>
                <p style={{ color: "var(--ink-soft)", margin: 0, maxWidth: 320 }}>
                  A spinning record fixed to the edge of your page — peeks out
                  by a third, slides further on hover. The cover sits at the
                  label, pauses when you pause.
                </p>
              </div>
            </div>

            {/* Player card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 32,
                padding: "48px 32px",
                borderRadius: 18,
                background: "var(--paper-2)",
                boxShadow: "inset 0 0 0 1px var(--rule)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -12,
                  left: 32,
                  background: "var(--ink)",
                  color: "var(--paper)",
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.66rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                variant=&quot;player&quot;
              </span>
              <SpotLive variant="player" demoData={WEEKND_TRACKS} />
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    margin: "0 0 12px",
                  }}
                >
                  The Web Player
                </h3>
                <p style={{ color: "var(--ink-soft)", margin: 0, maxWidth: 320 }}>
                  A compact pill with cover, title, artist, time and a faux
                  control set. Sized to slot into a nav bar or sidebar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INSTALL ===== */}
      <section style={section}>
        <div style={container}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                margin: 0,
              }}
            >
              Three steps.{" "}
              <em style={{ color: "var(--green-deep)" }}>One coffee.</em>
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
              }}
            >
              02 / install
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: 60,
              alignItems: "center",
            }}
          >
            {/* Steps */}
            <div style={{ display: "grid", gap: 22 }}>
              {[
                {
                  n: "1",
                  title: "Run the CLI",
                  body: (
                    <>
                      <code
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.78rem",
                          background: "var(--paper-3)",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        npx spotlive init
                      </code>{" "}
                      detects your Next.js App Router project, writes the
                      component + API route, and runs the OAuth flow for you.
                    </>
                  ),
                },
                {
                  n: "2",
                  title: "Paste your credentials",
                  body: "Grab Client ID and Secret from the Spotify developer console. The CLI opens the auth flow for you.",
                },
                {
                  n: "3",
                  title: "Mount it",
                  body: (
                    <>
                      Import the component, pick a{" "}
                      <code
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.78rem",
                          background: "var(--paper-3)",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        variant
                      </code>
                      , and ship.
                    </>
                  ),
                },
              ].map((step) => (
                <div
                  key={step.n}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    gap: 16,
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--ink)",
                      color: "var(--paper)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        margin: "4px 0 4px",
                      }}
                    >
                      {step.title}
                    </h4>
                    <p style={{ color: "var(--ink-soft)", margin: 0 }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CLI block */}
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
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#e0644a",
                    }}
                  />
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#d8a23a",
                    }}
                  />
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--green)",
                    }}
                  />
                </div>
                <span>terminal — zsh</span>
                <span style={{ width: 48 }} />
              </div>
              <div
                style={{
                  padding: "18px 20px",
                  lineHeight: 1.7,
                }}
              >
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  # inside your project
                </span>
                <br />
                <span style={{ color: "var(--green)" }}>$</span> npx spotlive
                init
                <br />
                <br />
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  ◇ Found a Next.js project (app router).
                </span>
                <br />
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  ◇ Pick a variant:
                </span>
                <br />
                &nbsp;&nbsp;
                <span style={{ color: "var(--ochre)" }}>●</span> vinyl
                <br />
                &nbsp;&nbsp;
                <span style={{ color: "var(--ochre)" }}>○</span> player
                <br />
                <br />
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  ◇ Paste your{" "}
                  <span style={{ color: "var(--ochre)" }}>
                    SPOTIFY_CLIENT_ID
                  </span>
                  :
                </span>
                <br />
                <span style={{ color: "var(--green)" }}>&gt;</span>{" "}
                <span style={{ color: "#e8c486" }}>&quot;••••••••••••••••&quot;</span>
                <br />
                <br />
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  ◇ Paste your{" "}
                  <span style={{ color: "var(--ochre)" }}>
                    SPOTIFY_CLIENT_SECRET
                  </span>
                  :
                </span>
                <br />
                <span style={{ color: "var(--green)" }}>&gt;</span>{" "}
                <span style={{ color: "#e8c486" }}>&quot;••••••••••••••••&quot;</span>
                <br />
                <br />
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  ✓ Wrote .env.local
                </span>
                <br />
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  ✓ Added &lt;SpotLive /&gt; to app/page.tsx
                </span>
                <br />
                <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>
                  ✓ Done. Press play.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={section}>
        <div style={container}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                margin: 0,
              }}
            >
              What you{" "}
              <em style={{ color: "var(--green-deep)" }}>get.</em>
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
              }}
            >
              03 / features
            </span>
          </div>

          <div
            className="rwd-stack-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {[
              {
                n: "01",
                title: "Token refresh, handled.",
                body: "The bundled route handler refreshes your access token on its own schedule. You set it once and forget about it.",
              },
              {
                n: "02",
                title: "Animated progress bar.",
                body: "SpotLive polls every 10s and animates the progress bar client-side between fetches. Smooth and kind to your rate limit.",
              },
              {
                n: "03",
                title: "Two built-in variants.",
                body: 'Switch between variant="vinyl" and variant="player" with one prop. Both are pure Tailwind — no external UI library.',
              },
              {
                n: "04",
                title: "Offline-aware.",
                body: "When nothing's playing, the widget shows the last track with a soft \"off-air\" stamp instead of an empty box.",
              },
              {
                n: "05",
                title: "Zero dependencies.",
                body: "Pure component code. The CLI is the only thing that ships extras, and it's devDependency only.",
              },
              {
                n: "06",
                title: "SSR-safe.",
                body: "The server component fetches the current track; the client component handles the animation. Hydration is clean.",
              },
            ].map((f) => (
              <div
                key={f.n}
                style={{
                  padding: 32,
                  borderRadius: 14,
                  background: "var(--paper-2)",
                  boxShadow: "inset 0 0 0 1px var(--rule)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.6rem",
                    color: "var(--green-deep)",
                    lineHeight: 1,
                  }}
                >
                  {f.n}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    margin: "18px 0 10px",
                    lineHeight: 1.1,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FRAMEWORKS ===== */}
      <section style={{ ...section, borderBottom: "none" }}>
        <div style={container}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                margin: 0,
              }}
            >
              Works with{" "}
              <em style={{ color: "var(--green-deep)" }}>what you have.</em>
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--ink-mute)",
                letterSpacing: "0.18em",
              }}
            >
              04 / frameworks
            </span>
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "Next.js 13 +", muted: false },
              { label: "React 18 +", muted: false },
              { label: "Astro · planned", muted: true },
              { label: "SvelteKit · planned", muted: true },
              { label: "Nuxt · planned", muted: true },
            ].map((fw) => (
              <div
                key={fw.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 22px",
                  borderRadius: 12,
                  background: "var(--paper-2)",
                  boxShadow: "inset 0 0 0 1px var(--rule)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  color: fw.muted ? "var(--ink-mute)" : "var(--ink)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: fw.muted ? "var(--ink-mute)" : "var(--green)",
                    flexShrink: 0,
                  }}
                />
                {fw.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section
        style={{
          background: "var(--record)",
          color: "var(--paper)",
          padding: "100px 40px",
          textAlign: "center",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(63,122,58,0.25), transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(200,84,31,0.18), transparent 50%)
          `,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            margin: "0 0 18px",
            lineHeight: 1,
          }}
        >
          Press <em style={{ color: "var(--green)" }}>play.</em>
        </h2>
        <p
          style={{
            color: "rgba(245,238,222,0.65)",
            maxWidth: 560,
            margin: "0 auto 36px",
            fontSize: "1.08rem",
          }}
        >
          One command, one component, one record spinning quietly on your
          homepage while you sleep.
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
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
              background: "var(--green)",
              color: "var(--record)",
              textDecoration: "none",
            }}
          >
            npx spotlive init
          </Link>
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
              background: "transparent",
              color: "var(--paper)",
              boxShadow: "inset 0 0 0 1px rgba(245,238,222,0.3)",
              textDecoration: "none",
            }}
          >
            Open the demo
          </Link>
        </div>
      </section>
    </>
  );
}
