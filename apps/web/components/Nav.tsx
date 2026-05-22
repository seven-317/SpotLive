"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/demo", label: "Live demo" },
  { href: "/docs", label: "Docs" },
  {
    href: "https://github.com/seven-317/SpotLive",
    label: "GitHub",
    external: true,
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 40px",
        borderBottom: "1px solid var(--rule)",
        background: "var(--paper)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          color: "var(--ink)",
        }}
      >
        {/* Vinyl mark */}
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 50%, var(--paper-2) 0 6px, var(--record) 6px 14px, var(--record-2) 14px 100%)",
            position: "relative",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)",
            flexShrink: 0,
          }}
        >
          {/* Green center dot */}
          <span
            style={{
              position: "absolute",
              inset: 13,
              borderRadius: "50%",
              background: "var(--green)",
            }}
          />
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            letterSpacing: "-0.01em",
          }}
        >
          spot
          <em style={{ fontStyle: "italic", color: "var(--green-deep)" }}>
            live
          </em>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {links.map((link) => {
          const isActive = link.external
            ? false
            : link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

          return link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                fontSize: "0.92rem",
                color: "var(--ink-soft)",
              }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                fontSize: "0.92rem",
                color: isActive ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href="/docs"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "10px 16px",
          borderRadius: 999,
          background: "var(--ink)",
          color: "var(--paper)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: "0.8em" }}>▸</span>
        Get started
      </Link>
    </nav>
  );
}
