import type { ReactNode } from "react";

interface PlayerWidgetDemoProps {
  title: string;
  artist: string;
  album: string;
  sleeve: ReactNode;
  progressPct: number;
}

export default function PlayerWidgetDemo({
  title,
  artist,
  album,
  sleeve,
  progressPct,
}: PlayerWidgetDemoProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
        background: "var(--record)",
        color: "var(--paper)",
        borderRadius: 18,
        padding: 20,
        display: "grid",
        gridTemplateColumns: "96px 1fr",
        gap: 18,
        alignItems: "center",
        boxShadow:
          "0 30px 60px -30px rgba(22,17,8,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial green glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(800px 200px at 0% 0%, rgba(63,122,58,0.15), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Album art */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 8px 18px rgba(0,0,0,0.5)",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {sleeve}
      </div>

      {/* Body */}
      <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
        {/* Now playing badge */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--green)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "pulse 1.6s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          Now playing
        </div>

        {/* Track title */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>

        {/* Artist · Album */}
        <div
          style={{
            fontSize: "0.82rem",
            color: "rgba(245,238,222,0.6)",
            marginBottom: 12,
          }}
        >
          {artist} · {album}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 4,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "var(--green)",
              borderRadius: 4,
              transition: "width 0.5s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
