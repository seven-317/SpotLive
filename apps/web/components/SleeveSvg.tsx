/* SpotLive — abstract record-sleeve placeholders as React SVG components.
   Original geometric covers, never real album art. */

export function DreamsSleeve() {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="200" height="200" fill="#1a1410" />
      <circle cx="138" cy="78" r="46" fill="#e9c7b4" />
      <circle cx="124" cy="68" r="46" fill="#1a1410" />
      <g fill="#e9c7b4" opacity="0.85">
        <circle cx="40" cy="40" r="1.2" />
        <circle cx="70" cy="20" r="0.8" />
        <circle cx="20" cy="100" r="1" />
        <circle cx="180" cy="160" r="1" />
        <circle cx="60" cy="150" r="0.9" />
        <circle cx="160" cy="40" r="0.7" />
      </g>
      <text
        x="14"
        y="186"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="14"
        fill="#e9c7b4"
      >
        dreams
      </text>
    </svg>
  );
}

export function SirDukeSleeve() {
  const rays = Array.from({ length: 12 }, (_, i) => (
    <rect
      key={i}
      x="-2"
      y="-110"
      width="4"
      height="110"
      fill={i % 2 ? "#ffd54a" : "#2a1d11"}
      transform={`rotate(${i * 30})`}
    />
  ));

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="200" height="200" fill="#d8581f" />
      <g transform="translate(100 100)">{rays}</g>
      <circle cx="100" cy="100" r="40" fill="#ffd54a" />
      <text
        x="100"
        y="106"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="700"
        fill="#2a1d11"
      >
        DUKE
      </text>
    </svg>
  );
}

export function RidersSleeve() {
  // Static rain strokes — deterministic positions to avoid hydration mismatch
  const rainStrokes = [
    [14, 8], [47, 23], [89, 5], [132, 41], [178, 12],
    [6, 55], [62, 78], [103, 33], [155, 67], [191, 29],
    [29, 112], [74, 95], [118, 142], [163, 88], [7, 156],
    [45, 168], [91, 121], [138, 176], [182, 103], [23, 189],
    [58, 34], [96, 167], [141, 52], [175, 145], [33, 72],
    [70, 198], [112, 18], [156, 133], [188, 65], [41, 145],
    [85, 83], [127, 108], [169, 22], [15, 132], [53, 58],
    [98, 92], [144, 178], [186, 48], [37, 105], [79, 161],
  ];

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="rg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1c2a44" />
          <stop offset="1" stopColor="#0c1422" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#rg)" />
      <g stroke="#9bb4d6" strokeWidth="1.2" opacity="0.55">
        {rainStrokes.map(([x, y], i) => (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - 6}
            y2={y + 14}
          />
        ))}
      </g>
      <text
        x="14"
        y="186"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="13"
        fill="#9bb4d6"
      >
        riders
      </text>
    </svg>
  );
}

export function TinyDancerSleeve() {
  const whiteKeys = Array.from({ length: 14 }, (_, i) => (
    <rect
      key={i}
      x={i * 16}
      y="0"
      width="14"
      height="60"
      fill="#fff8ec"
      stroke="#2a1d11"
      strokeWidth="1"
    />
  ));

  // Black keys: skip positions 2, 5, 6 in each octave of 7
  const blackKeys = Array.from({ length: 13 }, (_, i) => {
    const pos = i % 7;
    if (pos === 2 || pos === 5 || pos === 6) return null;
    return (
      <rect
        key={i}
        x={i * 16 + 10}
        y="0"
        width="10"
        height="36"
        fill="#2a1d11"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="200" height="200" fill="#f3d3b5" />
      <circle cx="100" cy="90" r="50" fill="#e8895a" />
      <g transform="translate(0,140)">
        {whiteKeys}
        {blackKeys}
      </g>
    </svg>
  );
}

export function HeartOfGlassSleeve() {
  const checkers = Array.from({ length: 10 }, (_, r) =>
    Array.from({ length: 10 }, (_, c) => {
      if ((r + c) % 2 !== 0) return null;
      const opacity = 0.05 + (Math.abs(r - 5) + Math.abs(c - 5)) * 0.06;
      return (
        <rect
          key={`${r}-${c}`}
          x={c * 20}
          y={r * 20}
          width="20"
          height="20"
          fill="#1a1410"
          opacity={opacity}
        />
      );
    })
  );

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <rect width="200" height="200" fill="#f0a8c0" />
      <g>{checkers}</g>
      <polygon
        points="100,40 120,90 170,90 130,120 145,170 100,140 55,170 70,120 30,90 80,90"
        fill="#1a1410"
      />
    </svg>
  );
}

export const Sleeves = {
  dreams: <DreamsSleeve />,
  sirDuke: <SirDukeSleeve />,
  riders: <RidersSleeve />,
  tinyDancer: <TinyDancerSleeve />,
  heartOfGlass: <HeartOfGlassSleeve />,
};
