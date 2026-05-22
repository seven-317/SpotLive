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

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useSpotify(pollInterval: number): NowPlaying | null {
  const [data, setData] = useState<NowPlaying | null>(null);
  const pollIntervalRef = useRef(pollInterval);
  pollIntervalRef.current = pollInterval;

  useEffect(() => {
    let cancelled = false;

    async function fetchNowPlaying() {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const json = (await res.json()) as NowPlaying;
        if (!cancelled) setData(json.isPlaying ? json : null);
      } catch {
        // Network error — keep previous state
      }
    }

    fetchNowPlaying();

    const id = setInterval(fetchNowPlaying, pollIntervalRef.current);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return data;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VinylDisc({
  albumArt,
  isPlaying,
}: {
  albumArt: string;
  isPlaying: boolean;
}) {
  return (
    <div className="relative w-28 h-28 rounded-full bg-zinc-800">
      {/* Groove rings */}
      <div className="absolute inset-2 rounded-full border border-zinc-700/40" />
      <div className="absolute inset-4 rounded-full border border-zinc-700/40" />
      <div className="absolute inset-6 rounded-full border border-zinc-700/40" />

      {/* Spinning wrapper */}
      <div
        className="absolute inset-0 rounded-full animate-spin [animation-duration:4s] [animation-timing-function:linear]"
        style={{ animationPlayState: isPlaying ? "running" : "paused" }}
      >
        {/* Center album art */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full overflow-hidden">
          {albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={albumArt}
              alt="Album art"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-700" />
          )}
        </div>
      </div>
    </div>
  );
}

function VinylWidget({
  data,
  position,
}: {
  data: NowPlaying | null;
  position: "left" | "right";
}) {
  const posClass = position === "left" ? "left-4" : "right-4";

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${posClass}`}
      aria-label="Now Playing"
      role="complementary"
    >
      <div className="rotate-[-12deg]">
        <div className="w-40 h-48 rounded-2xl bg-zinc-900 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-2 p-3">
          <VinylDisc
            albumArt={data?.albumArt ?? ""}
            isPlaying={data?.isPlaying ?? false}
          />
          <p className="text-xs text-zinc-300 truncate w-full text-center">
            {data?.title ?? "—"}
          </p>
          <p className="text-[10px] text-zinc-500 truncate w-full text-center">
            {data?.artist ?? "Nothing playing"}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlayerWidget({ data }: { data: NowPlaying | null }) {
  if (!data) return null;

  const progressPct =
    data.duration > 0
      ? Math.min(100, (data.progress / data.duration) * 100)
      : 0;

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      aria-label="Now Playing"
      role="complementary"
    >
      <div className="w-72 rounded-xl bg-zinc-900 text-white p-4 shadow-2xl flex gap-3 items-center">
        {/* Album art */}
        <div className="w-14 h-14 rounded-md flex-shrink-0 bg-zinc-800 overflow-hidden">
          {data.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.albumArt}
              alt="Album art"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-700" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{data.title}</p>
          <p className="text-xs text-zinc-400 truncate">{data.artist}</p>

          {/* Progress bar */}
          <div className="relative h-1 bg-zinc-700 rounded-full mt-2">
            <div
              className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Now Playing badge */}
          <div className="flex items-center gap-1 mt-1 text-[10px] text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Now Playing
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface SpotLiveProps {
  variant?: "vinyl" | "player";
  pollInterval?: number;
  position?: "left" | "right";
}

export function SpotLive({
  variant = "player",
  pollInterval = 10_000,
  position = "right",
}: SpotLiveProps) {
  const data = useSpotify(pollInterval);

  useEffect(() => {
    console.log(
      "%c SpotLive %c Powered by SpotLive ",
      "background:#1DB954;color:#000;font-weight:bold;padding:2px 6px;border-radius:4px 0 0 4px",
      "background:#18181b;color:#a1a1aa;padding:2px 6px;border-radius:0 4px 4px 0"
    );
  }, []);

  if (variant === "vinyl") {
    return <VinylWidget data={data} position={position} />;
  }

  return <PlayerWidget data={data} />;
}
