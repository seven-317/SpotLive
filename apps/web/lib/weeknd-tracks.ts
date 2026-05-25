/** Demo data for the showcase site — The Weeknd's catalogue. */
export interface DemoTrack {
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // ms
}

export const WEEKND_TRACKS: DemoTrack[] = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumArt: "/sleeves/after-hours.svg",
    duration: 200_000,
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    albumArt: "/sleeves/after-hours.svg",
    duration: 215_000,
  },
  {
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    albumArt: "/sleeves/starboy.svg",
    duration: 230_000,
  },
  {
    title: "The Hills",
    artist: "The Weeknd",
    albumArt: "/sleeves/bbtm.svg",
    duration: 242_000,
  },
  {
    title: "Can't Feel My Face",
    artist: "The Weeknd",
    albumArt: "/sleeves/bbtm.svg",
    duration: 213_000,
  },
];
