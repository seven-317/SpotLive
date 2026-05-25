import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "60px 40px 40px",
        background: "var(--record)",
        color: "var(--paper-2)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        letterSpacing: "0.08em",
      }}
    >
      <div
        className="rwd-footer-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.6rem",
              color: "var(--paper)",
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            spot
            <em style={{ fontStyle: "italic", color: "var(--green)" }}>live</em>
          </div>
          <p
            style={{
              color: "var(--ink-mute)",
              margin: 0,
              maxWidth: 320,
              fontFamily: "var(--font-body)",
              letterSpacing: 0,
              fontSize: "0.92rem",
              lineHeight: 1.6,
            }}
          >
            An open-source now-playing component for the personal-website crowd.
            Made with caffeine.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4
            style={{
              color: "var(--paper)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 16px",
            }}
          >
            Product
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 8,
            }}
          >
            {[
              { href: "/", label: "Overview" },
              { href: "/demo", label: "Demo" },
              { href: "/docs", label: "Docs" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  style={{
                    color: "var(--ink-mute)",
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Code */}
        <div>
          <h4
            style={{
              color: "var(--paper)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 16px",
            }}
          >
            Code
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 8,
            }}
          >
            <li>
              <a
                href="https://github.com/seven-317/SpotLive"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--ink-mute)", textDecoration: "none" }}
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/spotlive"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--ink-mute)", textDecoration: "none" }}
              >
                npm
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4
            style={{
              color: "var(--paper)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 16px",
            }}
          >
            Legal
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 8,
            }}
          >
            <li>
              <a
                href="https://github.com/seven-317/SpotLive/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--ink-mute)", textDecoration: "none" }}
              >
                MIT license
              </a>
            </li>
            <li style={{ color: "var(--ink-mute)" }}>
              Not affiliated with Spotify AB.
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          color: "var(--ink-mute)",
          fontSize: "0.7rem",
        }}
      >
        <span>© 2026 SpotLive contributors</span>
        <span>side A · 33⅓ rpm</span>
      </div>
    </footer>
  );
}
