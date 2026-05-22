"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ---- Spotify types ---- */
interface NowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  progress?: number;   // ms
  duration?: number;   // ms
}

const POLL_MS = 10_000;

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

/* ---- Vinyl disc ---- */
function VinylDisc({ albumArt, isPlaying }: { albumArt?: string; isPlaying: boolean }) {
  return (
    <div style={{ position: "relative", width: 380, height: 380 }}>
      {/* Record */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px), radial-gradient(circle at 50% 50%, #2a1f12 0 18%, #1a120a 18% 100%)",
          boxShadow:
            "0 30px 60px -20px rgba(22,17,8,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "vinyl-spin 14s linear infinite",
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      />
      {/* Label area */}
      <div
        style={{
          position: "absolute",
          inset: "31%",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.4)",
        }}
      >
        {albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={albumArt} alt="Album art" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#3f7a3a" }} />
        )}
      </div>
      {/* Spindle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#ebe0cc",
          boxShadow: "0 0 0 2px #161108, inset 0 0 4px rgba(0,0,0,0.4)",
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
        <div
          style={{
            position: "absolute",
            left: "8%",
            top: "6%",
            width: "84%",
            height: 6,
            background: "linear-gradient(90deg, #ebe0cc 0%, #e0d2b6 50%, #ebe0cc 100%)",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: -8,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#ebe0cc",
            boxShadow: "inset 0 0 0 2px #2a1d11",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -4,
            width: 32,
            height: 18,
            background: "#2a1d11",
            borderRadius: "4px 0 0 4px",
          }}
        />
      </div>
    </div>
  );
}

/* ---- Player card ---- */
function PlayerCard({ data, progressPct }: { data: NowPlaying | null; progressPct: number }) {
  return (
    <div
      style={{
        background: "var(--record)",
        color: "var(--paper)",
        borderRadius: 18,
        padding: 20,
        display: "grid",
        gridTemplateColumns: "96px 1fr",
        gap: 18,
        alignItems: "center",
        boxShadow: "0 30px 60px -30px rgba(22,17,8,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(800px 200px at 0% 0%, rgba(63,122,58,0.15), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      {/* Album art */}
      <div style={{ width: 96, height: 96, borderRadius: 10, overflow: "hidden", background: "#2a1d11", position: "relative", zIndex: 1 }}>
        {data?.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.albumArt} alt="Album art" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#3f7a3a", opacity: 0.4 }} />
        )}
      </div>
      {/* Info */}
      <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: data?.isPlaying ? "pulse 1.6s infinite" : "none" }} />
          {data?.isPlaying ? "Now playing" : "Off air"}
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {data?.title ?? "—"}
        </div>
        <div style={{ fontSize: "0.82rem", color: "rgba(245,238,222,0.6)", marginBottom: 12 }}>
          {data?.artist ?? "Nothing playing"}
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "var(--green)", borderRadius: 4, width: `${progressPct}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(245,238,222,0.5)", marginTop: 6, letterSpacing: "0.06em" }}>
          <span>{data?.duration ? fmt((progressPct / 100) * data.duration) : "0:00"}</span>
          <span>{data?.duration != null ? fmt(data.duration) : "0:00"}</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Main ---- */
export default function DemoPage() {
  const [data, setData] = useState<NowPlaying | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const fetchedAt = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const dataRef = useRef<NowPlaying | null>(null);

  const fetchNow = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify");
      if (!res.ok) { setStatus("error"); return; }
      const json = (await res.json()) as NowPlaying;
      fetchedAt.current = Date.now();
      dataRef.current = json;
      // Set the correct starting position immediately — don't wait for RAF
      if (json.isPlaying && json.progress != null && json.duration && json.duration > 0) {
        setProgressPct((json.progress / json.duration) * 100);
      }
      setData(json);
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }, []);

  // Poll every 10s
  useEffect(() => {
    fetchNow();
    const id = setInterval(fetchNow, POLL_MS);
    return () => clearInterval(id);
  }, [fetchNow]);

  // Interpolate progress client-side between polls
  useEffect(() => {
    function tick() {
      const d = dataRef.current;
      if (d?.isPlaying && d.progress != null && d.duration && d.duration > 0) {
        const elapsed = Date.now() - fetchedAt.current;
        const current = Math.min(d.progress + elapsed, d.duration);
        setProgressPct((current / d.duration) * 100);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const progressMs = data?.isPlaying && data.progress != null
    ? Math.min(data.progress + (Date.now() - fetchedAt.current), data.duration ?? 0)
    : 0;

  return (
    <>
      <style>{`@keyframes vinyl-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <section style={{ padding: "60px 0 40px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 18 }}>
            <Link href="/" style={{ color: "var(--ink-mute)", textDecoration: "none" }}>SpotLive</Link>
            <span>/</span>
            <span style={{ color: "var(--ink)" }}>Live Demo</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.8rem, 5vw, 4.2rem)", margin: "0 0 14px", lineHeight: 1, letterSpacing: "-0.01em" }}>
            Both styles, <em style={{ color: "var(--green-deep)" }}>live.</em>
          </h1>
          <p style={{ color: "var(--ink-soft)", maxWidth: 640, fontSize: "1.08rem", margin: 0 }}>
            Connected to the real <code style={{ fontFamily: "var(--font-mono)", background: "var(--paper-2)", padding: "2px 6px", borderRadius: 4 }}>/api/spotify</code> endpoint — polling every 10s. Play something on Spotify and watch it appear.
          </p>
        </div>
      </section>

      {/* Stage */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, padding: "60px 40px 80px", maxWidth: 1280, margin: "0 auto", alignItems: "start" }}>

        {/* Vinyl */}
        <div style={{ background: "var(--paper-2)", borderRadius: 18, padding: 40, boxShadow: "inset 0 0 0 1px var(--rule)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 36, minHeight: 640, justifyContent: "center" }}>
          <span style={{ position: "absolute", top: -12, left: 32, background: "var(--green-deep)", color: "var(--paper)", padding: "6px 14px", borderRadius: 999, fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            variant=&quot;vinyl&quot;
          </span>

          <VinylDisc albumArt={data?.albumArt} isPlaying={data?.isPlaying ?? false} />

          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green-deep)", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: data?.isPlaying ? "pulse 1.6s ease-in-out infinite" : "none" }} />
              {status === "loading" ? "Connecting…" : data?.isPlaying ? "Now playing" : "Nothing playing"}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", lineHeight: 1.05, margin: "0 0 4px" }}>
              {data?.title ?? "—"}
            </h2>
            <div style={{ color: "var(--ink-soft)", fontSize: "1rem", marginBottom: 12 }}>
              {data?.artist ?? (status === "loading" ? "Loading…" : "Open Spotify and play a track")}
            </div>
          </div>

          {/* Progress */}
          <div style={{ width: "80%", maxWidth: 360 }}>
            <div style={{ height: 3, background: "rgba(42,29,17,0.12)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", background: "var(--green-deep)", borderRadius: 4, width: `${progressPct}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.08em", color: "var(--ink-mute)" }}>
              <span>{fmt(progressMs)}</span>
              <span>{data?.duration ? fmt(data.duration) : "0:00"}</span>
            </div>
          </div>
        </div>

        {/* Player */}
        <div style={{ background: "var(--paper-2)", borderRadius: 18, padding: 40, boxShadow: "inset 0 0 0 1px var(--rule)", position: "relative", display: "flex", flexDirection: "column", gap: 28, minHeight: 640 }}>
          <span style={{ position: "absolute", top: -12, left: 32, background: "var(--ink)", color: "var(--paper)", padding: "6px 14px", borderRadius: 999, fontFamily: "var(--font-mono)", fontSize: "0.66rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            variant=&quot;player&quot;
          </span>

          <PlayerCard data={data} progressPct={progressPct} />

          {/* Code snippet */}
          <div style={{ background: "var(--record)", color: "var(--paper-2)", borderRadius: 14, overflow: "hidden", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--record-2)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e0644a" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d8a23a" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--green)" }} />
              </div>
              <span>your-site/app/page.tsx</span>
              <span>tsx</span>
            </div>
            <div style={{ padding: "18px 20px", lineHeight: 1.7 }}>
              <span style={{ color: "var(--ink-mute)", fontStyle: "italic" }}>{`// the entire integration`}</span><br />
              <span style={{ color: "var(--ochre)" }}>import</span>{" { "}<span style={{ color: "#e8c486" }}>SpotLive</span>{" } "}<span style={{ color: "var(--ochre)" }}>from</span>{" "}<span style={{ color: "#c7e0a8" }}>&quot;@/components/spotlive/SpotLive&quot;</span>;<br /><br />
              <span style={{ color: "var(--ochre)" }}>export default function</span>{" "}<span style={{ color: "#e8c486" }}>Page</span>() {"{"}<br />
              &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>return</span> &lt;<span style={{ color: "#e8c486" }}>SpotLive</span> <span style={{ color: "var(--ochre)" }}>variant</span>=<span style={{ color: "#c7e0a8" }}>&quot;vinyl&quot;</span> /&gt;;<br />
              {"}"}
            </div>
          </div>
        </div>
      </div>

      {/* Live payload */}
      <div style={{ maxWidth: 1280, margin: "0 auto 80px", padding: "0 40px" }}>
        <div style={{ background: "var(--record)", color: "var(--paper-2)", borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "var(--record-2)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Live payload — GET /api/spotify
            </span>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink-mute)" }}>
              <span>{status === "ok" ? "200 OK" : status === "error" ? "Error" : "…"}</span>
              <span style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(63,122,58,0.18)", color: "var(--green)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
                {status === "loading" ? "Connecting" : "Live"}
              </span>
            </div>
          </div>
          <div style={{ padding: "24px 28px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", lineHeight: 1.7, overflowX: "auto" }}>
            <span style={{ color: "var(--ink-mute)" }}>{`// polled every 10s`}</span><br />
            {"{"}<br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;isPlaying&quot;</span>:{" "}<span style={{ color: "#9cc4ff" }}>{String(data?.isPlaying ?? false)}</span>,<br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;title&quot;</span>:{" "}<span style={{ color: "#c7e0a8" }}>&quot;{data?.title ?? ""}&quot;</span>,<br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;artist&quot;</span>:{" "}<span style={{ color: "#c7e0a8" }}>&quot;{data?.artist ?? ""}&quot;</span>,<br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;albumArt&quot;</span>:{" "}<span style={{ color: "#c7e0a8" }}>&quot;{data?.albumArt ? data.albumArt.slice(0, 40) + "…" : ""}&quot;</span>,<br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;progress&quot;</span>:{" "}<span style={{ color: "#e8aa6a" }}>{Math.floor(progressMs)}</span>,<br />
            &nbsp;&nbsp;<span style={{ color: "var(--ochre)" }}>&quot;duration&quot;</span>:{" "}<span style={{ color: "#e8aa6a" }}>{data?.duration ?? 0}</span><br />
            {"}"}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section style={{ borderTop: "1px solid var(--rule)", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5vw, 3.6rem)", margin: "0 0 16px", fontWeight: 400 }}>
          Liked what you saw?
        </h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: 520, margin: "0 auto 32px" }}>
          The install is shorter than this paragraph.
        </p>
        <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 22px", borderRadius: 999, fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", background: "var(--ink)", color: "var(--paper)", textDecoration: "none" }}>
          Read the docs
        </Link>
      </section>
    </>
  );
}
