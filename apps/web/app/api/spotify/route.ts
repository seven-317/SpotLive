import { NextResponse } from "next/server";

// ─── Token cache ──────────────────────────────────────────────────────────────

interface CachedToken {
  accessToken: string;
  expiresAt: number; // Unix ms
}

let tokenCache: CachedToken | null = null;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 30s buffer)
  if (tokenCache && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Spotify credentials. Ensure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN are set in .env.local"
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to refresh Spotify token (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return tokenCache.accessToken;
}

// ─── API route ────────────────────────────────────────────────────────────────

export interface NowPlayingResponse {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  progress?: number;
  duration?: number;
}

export async function GET(): Promise<NextResponse> {
  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );

    // 204 = no content (nothing playing or private session)
    if (res.status === 204 || res.status === 202) {
      return NextResponse.json<NowPlayingResponse>({ isPlaying: false });
    }

    if (!res.ok) {
      // 401 → clear cache so next request re-fetches token
      if (res.status === 401) {
        tokenCache = null;
      }
      return NextResponse.json<NowPlayingResponse>(
        { isPlaying: false },
        { status: res.status }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;

    const isPlaying: boolean = data?.is_playing ?? false;

    if (!isPlaying || !data?.item) {
      return NextResponse.json<NowPlayingResponse>({ isPlaying: false });
    }

    const item = data.item;
    const artists: string = (
      item.artists as Array<{ name: string }>
    )
      .map((a) => a.name)
      .join(", ");

    const albumArt: string =
      (item.album?.images as Array<{ url: string; width: number }> | undefined)
        ?.sort((a, b) => b.width - a.width)[0]?.url ?? "";

    const payload: NowPlayingResponse = {
      isPlaying,
      title: item.name as string,
      artist: artists,
      albumArt,
      progress: (data.progress_ms as number) ?? 0,
      duration: (item.duration_ms as number) ?? 0,
    };

    return NextResponse.json(payload, {
      headers: {
        // Allow short-lived caching to reduce hammering Spotify API
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
      },
    });
  } catch (err) {
    console.error("[SpotLive] Error fetching now playing:", err);
    return NextResponse.json<NowPlayingResponse>(
      { isPlaying: false },
      { status: 500 }
    );
  }
}
