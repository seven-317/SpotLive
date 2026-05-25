"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  progress: number;
  duration: number;
}

/** Static demo track — used when `demoData` is provided. */
export interface DemoTrack {
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // ms
}

export interface SpotLiveProps {
  variant?: "vinyl" | "player";
  pollInterval?: number;
  position?: "left" | "right";
  /** Show progress bar (default off — both variants hide it by default). */
  showProgress?: boolean;
  /**
   * If provided, the widget cycles through these tracks every 14 seconds
   * instead of polling /api/spotify. Useful for showcase pages or testing
   * without setting up Spotify credentials.
   */
  demoData?: DemoTrack[];
  /** Cycle length when `demoData` is set. Default 14 000 ms. */
  demoCycleMs?: number;
  /**
   * If true, the vinyl variant renders inline (no fixed positioning, no peek
   * behaviour). Useful for embedding the widget in a showcase grid.
   */
  embedded?: boolean;
}

// ─── Hook: polling + client-side progress interpolation ──────────────────────

const DEFAULT_DEMO_CYCLE = 14_000;

function useSpotify(
  pollInterval: number,
  demoData?: DemoTrack[],
  demoCycleMs: number = DEFAULT_DEMO_CYCLE,
) {
  const [data, setData] = useState<NowPlaying | null>(null);
  const [progressMs, setProgressMs] = useState(0);
  const fetchedAt = useRef(0);
  const dataRef = useRef<NowPlaying | null>(null);
  const rafRef = useRef(0);

  // Real mode: poll API
  useEffect(() => {
    if (demoData && demoData.length > 0) return; // skip when demo

    let cancelled = false;

    async function fetchNow() {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const json = (await res.json()) as NowPlaying;
        if (cancelled) return;
        fetchedAt.current = Date.now();
        dataRef.current = json.isPlaying ? json : null;
        setData(dataRef.current);
        if (dataRef.current) setProgressMs(dataRef.current.progress);
        else setProgressMs(0);
      } catch {
        /* keep previous state */
      }
    }

    fetchNow();
    const id = setInterval(fetchNow, pollInterval);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollInterval, demoData]);

  // Demo mode: cycle through provided tracks via RAF
  useEffect(() => {
    if (!demoData || demoData.length === 0) return;

    let idx = -1;
    let cycleStart = Date.now() - demoCycleMs; // force immediate advance
    let rafId = 0;

    const tick = () => {
      const elapsed = Date.now() - cycleStart;
      if (elapsed >= demoCycleMs) {
        idx = (idx + 1) % demoData.length;
        cycleStart = Date.now();
        const t = demoData[idx]!;
        const trackData: NowPlaying = {
          isPlaying: true,
          title: t.title,
          artist: t.artist,
          albumArt: t.albumArt,
          progress: 0,
          duration: t.duration,
        };
        dataRef.current = trackData;
        setData(trackData);
      }
      const t = demoData[idx]!;
      const mapped = ((Date.now() - cycleStart) / demoCycleMs) * t.duration;
      setProgressMs(Math.min(mapped, t.duration));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [demoData, demoCycleMs]);

  // Real-mode interpolation between polls
  useEffect(() => {
    if (demoData && demoData.length > 0) return; // demo handles its own progress

    function tick() {
      const d = dataRef.current;
      if (d?.isPlaying && d.duration > 0) {
        const elapsed = Date.now() - fetchedAt.current;
        setProgressMs(Math.min(d.progress + elapsed, d.duration));
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [demoData]);

  return { data, progressMs };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}
function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

// ─── Player widget (compact, nav-bar friendly, inline) ────────────────────────

function PlayerWidget({
  data,
  progressMs,
  showProgress,
}: {
  data: NowPlaying | null;
  progressMs: number;
  showProgress: boolean;
}) {
  const isPlaying = data?.isPlaying ?? false;
  const progressPct =
    data && data.duration > 0 ? (progressMs / data.duration) * 100 : 0;

  return (
    <div className="relative inline-flex items-center gap-3 pl-1.5 pr-2.5 py-1.5 rounded-full bg-zinc-900 text-white shadow-lg max-w-sm">
      {/* Thumbnail */}
      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800">
        {data?.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.albumArt}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-700" />
        )}
      </div>

      {/* Title / Artist */}
      <div className="flex-1 min-w-0 leading-tight">
        <div className="text-[11px] font-medium truncate text-white">
          {data?.title ?? "Nothing playing"}
        </div>
        <div className="text-[10px] text-zinc-400 truncate">
          {data?.artist ?? "—"}
        </div>
      </div>

      {/* Time */}
      <div className="text-[10px] text-zinc-500 font-mono tabular-nums leading-tight flex-shrink-0">
        {data ? `${fmt(progressMs)} / ${fmt(data.duration)}` : "0:00 / 0:00"}
      </div>

      {/* Fake controls (UI only) */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          type="button"
          aria-label="Previous"
          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <IconPrev />
        </button>
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          className="p-1.5 text-white hover:text-green-400 transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
        <button
          type="button"
          aria-label="Next"
          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <IconNext />
        </button>
      </div>

      {/* Optional progress bar */}
      {showProgress && (
        <div className="absolute inset-x-3 bottom-0.5 h-0.5 bg-zinc-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Vinyl widget (fixed, right-side peek with hover reveal) ─────────────────

function VinylWidget({
  data,
  progressMs,
  position,
  showProgress,
  embedded,
}: {
  data: NowPlaying | null;
  progressMs: number;
  position: "left" | "right";
  showProgress: boolean;
  embedded: boolean;
}) {
  const isPlaying = data?.isPlaying ?? false;
  const isRight = position === "right";
  const progressPct =
    data && data.duration > 0 ? (progressMs / data.duration) * 100 : 0;

  // Default: peek out ~1/3 (translate 66% of width off-screen)
  // Hover: peek out ~2/3 (translate 33% off-screen)
  const idleTransform = isRight
    ? "rotate(-12deg) translateX(66%)"
    : "rotate(12deg) translateX(-66%)";
  const hoverTransform = isRight
    ? "rotate(-12deg) translateX(33%)"
    : "rotate(12deg) translateX(-33%)";

  const card = (
    <div className="w-56 h-64 rounded-2xl bg-zinc-900 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-3 p-4">
      {/* Disc */}
      <div className="relative w-44 h-44 rounded-full bg-zinc-800">
        <div className="absolute inset-2 rounded-full border border-zinc-700/40" />
        <div className="absolute inset-5 rounded-full border border-zinc-700/40" />
        <div className="absolute inset-8 rounded-full border border-zinc-700/40" />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            animationDuration: "4s",
            animationTimingFunction: "linear",
            animationPlayState: isPlaying ? "running" : "paused",
          }}
        >
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-full overflow-hidden">
            {data?.albumArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.albumArt}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-700" />
            )}
          </div>
        </div>
      </div>

      {/* Track info */}
      <div className="w-full text-center">
        <p className="text-xs font-medium text-zinc-200 truncate">
          {data?.title ?? "Nothing playing"}
        </p>
        <p className="text-[10px] text-zinc-500 truncate">
          {data?.artist ?? "—"}
        </p>
      </div>

      {/* Optional progress bar */}
      {showProgress && data && (
        <div className="w-full">
          <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-zinc-600 font-mono mt-1 tabular-nums">
            <span>{fmt(progressMs)}</span>
            <span>{fmt(data.duration)}</span>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div aria-label="Now Playing" role="complementary">
        {card}
      </div>
    );
  }

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${
        isRight ? "right-0" : "left-0"
      }`}
      aria-label="Now Playing"
      role="complementary"
    >
      <div
        className="transition-transform duration-300 ease-out"
        style={{ transform: idleTransform }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = hoverTransform;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = idleTransform;
        }}
      >
        {card}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function SpotLive({
  variant = "player",
  pollInterval = 10_000,
  position = "right",
  showProgress = false,
  demoData,
  demoCycleMs,
  embedded = false,
}: SpotLiveProps) {
  const { data, progressMs } = useSpotify(pollInterval, demoData, demoCycleMs);

  useEffect(() => {
    console.log(
      "%c SpotLive %c Powered by SpotLive ",
      "background:#1DB954;color:#000;font-weight:bold;padding:2px 6px;border-radius:4px 0 0 4px",
      "background:#18181b;color:#a1a1aa;padding:2px 6px;border-radius:0 4px 4px 0"
    );
  }, []);

  if (variant === "vinyl") {
    return (
      <VinylWidget
        data={data}
        progressMs={progressMs}
        position={position}
        showProgress={showProgress}
        embedded={embedded}
      />
    );
  }

  return (
    <PlayerWidget
      data={data}
      progressMs={progressMs}
      showProgress={showProgress}
    />
  );
}
