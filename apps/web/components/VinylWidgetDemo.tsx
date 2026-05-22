import type { ReactNode } from "react";

interface VinylWidgetDemoProps {
  sleeve: ReactNode;
  size?: number;
}

export default function VinylWidgetDemo({
  sleeve,
  size = 380,
}: VinylWidgetDemoProps) {
  return (
    <div style={{ ["--size" as string]: `${size}px`, width: size, position: "relative" }}>
      {/* Stage */}
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Vinyl record */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `
              repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px),
              radial-gradient(circle at 50% 50%, #2a1f12 0 18%, #1a120a 18% 100%)
            `,
            boxShadow: `
              0 30px 60px -20px rgba(22,17,8,0.55),
              inset 0 0 0 1px rgba(255,255,255,0.04),
              inset 0 6px 24px rgba(0,0,0,0.6)
            `,
            animation: "spin 14s linear infinite",
          }}
        >
          {/* Sheen overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.06) 30deg, transparent 60deg, transparent 200deg, rgba(255,255,255,0.04) 230deg, transparent 260deg)",
            }}
          />
        </div>

        {/* Label area — sleeve content */}
        <div
          style={{
            position: "absolute",
            inset: "31%",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow:
              "inset 0 0 0 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {sleeve}
        </div>

        {/* Spindle dot */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "var(--paper-2)",
            boxShadow:
              "0 0 0 2px var(--record), inset 0 0 4px rgba(0,0,0,0.4)",
            zIndex: 3,
          }}
        />

        {/* Tonearm */}
        <div
          style={{
            position: "absolute",
            top: "-8%",
            right: "-10%",
            width: "60%",
            height: "110%",
            transformOrigin: "92% 8%",
            transform: "rotate(-18deg)",
            pointerEvents: "none",
          }}
        >
          {/* Arm */}
          <div
            style={{
              position: "absolute",
              left: "8%",
              top: "6%",
              width: "84%",
              height: 6,
              background:
                "linear-gradient(90deg, var(--paper-2) 0%, var(--paper-3) 50%, var(--paper-2) 100%)",
              borderRadius: 4,
              transformOrigin: "right center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
          {/* Head */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -4,
              width: 32,
              height: 18,
              background: "var(--ink)",
              borderRadius: "4px 0 0 4px",
            }}
          />
          {/* Pivot */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: -8,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--paper-2)",
              boxShadow:
                "inset 0 0 0 2px var(--ink), 0 4px 8px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
