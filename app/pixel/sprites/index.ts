import type { Sprite } from "../types";

// ─── tiny grid helpers (used to *generate* the geometric sprites) ──────────
type G = string[][];
const grid = (w: number, h: number): G =>
  Array.from({ length: h }, () => Array(w).fill("."));
const put = (g: G, x: number, y: number, c: string) => {
  if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = c;
};
const line = (g: G, x0: number, y0: number, x1: number, y1: number, c: string) => {
  const dx = Math.abs(x1 - x0),
    dy = Math.abs(y1 - y0),
    sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let err = dx - dy,
    x = x0,
    y = y0;
  for (;;) {
    put(g, x, y, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
};
const rect = (g: G, x: number, y: number, w: number, h: number, c: string) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(g, x + i, y + j, c);
};
const ser = (g: G): string[] => g.map((r) => r.join(""));

// ── Tux — the Linux penguin (kernel / Columbia research) ──────────────────
const tux: Sprite = {
  w: 16,
  h: 20,
  palette: { K: "#151515", W: "#f6f7f9", E: "#ffffff", P: "#151515", O: "#f7a21c" },
  shimmer: { W: ["#e9edf3", "#ffffff"], O: ["#e7900f", "#ffb43a"] },
  shimmerSpeed: 0.3,
  frames: [
    [
      ".....KKKKKK.....",
      "...KKKKKKKKKK...",
      "..KKKKKKKKKKKK..",
      "..KKKWWWWWWKKK..",
      "..KKWWWWWWWWKK..",
      "..KKWEEWWEEWKK..",
      "..KKWEPWWEPWKK..",
      "..KKWWWOOWWWKK..",
      "..KKKWOOOOWKKK..",
      "...KKKWWWWKKK...",
      "..KKKKKKKKKKKK..",
      ".KKKKWWWWWWKKKK.",
      "KKKKWWWWWWWWKKKK",
      "KKKKWWWWWWWWKKKK",
      "KKKKWWWWWWWWKKKK",
      "KKKKWWWWWWWWKKKK",
      ".KKKWWWWWWWWKKK.",
      ".KKKKWWWWWWKKKK.",
      "....OOO..OOO....",
      "...OOOO..OOOO...",
    ],
  ],
};

// ── Soumil — pixel avatar ─────────────────────────────────────────────────
const avatar: Sprite = {
  w: 16,
  h: 18,
  palette: {
    H: "#2b2118",
    S: "#e8b48c",
    G: "#1c1c22",
    L: "#bfe3ff",
    M: "#8a4a3a",
    C: "#2f6f6b",
    c: "#245450",
  },
  shimmer: { C: ["#2a625e", "#357c76"], L: ["#a9d6f7", "#d6efff"] },
  shimmerSpeed: 0.25,
  frames: [
    [
      "....HHHHHHHH....",
      "..HHHHHHHHHHHH..",
      ".HHHHHHHHHHHHHH.",
      ".HHSSSSSSSSSSHH.",
      ".HSSSSSSSSSSSSH.",
      ".HSGGSSSSSSGGSH.",
      ".HSGLGSSSSGLGSH.",
      ".HSGGSSSSSSGGSH.",
      ".HSSSSSSSSSSSSH.",
      ".HSSSSSMMSSSSSH.",
      "..SSSSSSSSSSSS..",
      "...CCCCCCCCCC...",
      "..CCCCCCCCCCCC..",
      ".CCCCCCCCCCCCCC.",
      ".CCCCCccccCCCCC.",
      ".CCCCCccccCCCCC.",
      ".CCC........CCC.",
      ".CC..........CC.",
    ],
  ],
};

// ── Cloudflare cloud (Performance Team) ───────────────────────────────────
const cloudflare: Sprite = {
  w: 19,
  h: 11,
  palette: { A: "#f6821f", B: "#fbad41", a: "#e2670a" },
  shimmer: { B: ["#f59a2e", "#ffc169"], A: ["#ef7a17", "#ff9433"] },
  shimmerSpeed: 0.35,
  frames: [
    [
      "......BBBBBBB......",
      ".....BBBBBBBBB.....",
      "...BBBBBBBBBBBBB...",
      "..BBBBBBBBBBBBBBB..",
      ".BBBAAAAAAAAAAABBB.",
      "BBAAAAAAAAAAAAAAABB",
      "AAAAAAAAAAAAAAAAAAA",
      "AAAAAAAAAAAAAAAAAAA",
      "aaaaaaaaaaaaaaaaaaa",
      "..aaa..aaaa..aaa...",
      "...................",
    ].map((r) => r.padEnd(19, ".").slice(0, 19)),
  ],
};

// ── Superfork — copy-on-write process fork (research) ─────────────────────
const superfork: Sprite = {
  w: 22,
  h: 17,
  palette: { N: "#37c98f", n: "#1f8a60", L: "#6f7b8a", C: "#ffd24a", K: "#123521" },
  shimmer: { N: ["#2bb47d", "#57e6a9"], C: ["#f5c22e", "#ffe480"] },
  shimmerSpeed: 0.45,
  frames: [
    [
      ".........KNNK.........",
      "........KNNNNK........",
      "........NNCCNN........",
      "........KNNNNK........",
      ".........KLLK.........",
      ".......LLLLLLLL.......",
      "......L........L......",
      ".....L..........L.....",
      "....KNNK......KNNK....",
      "...KNNNNK....KNNNNK...",
      "...NNCCNN....NNCCNN...",
      "...KNNNNK....KNNNNK...",
      "....KLLK......KLLK....",
      "...LL..LL....LL..LL...",
      "..KNK..KNK..KNK..KNK..",
      "..NNK..KNN..NNK..KNN..",
      "..KNK..KNK..KNK..KNK..",
    ],
  ],
};

// ── ARM CCA — confidential-compute realm shield ───────────────────────────
const armcca: Sprite = {
  w: 18,
  h: 22,
  palette: { S: "#3a4658", s: "#28303d", E: "#6ad0ff", L: "#ffcf4a", K: "#12202b" },
  shimmer: { E: ["#4bb8ef", "#8fe0ff"], L: ["#f0bd30", "#ffe07a"] },
  shimmerSpeed: 0.4,
  frames: [
    [
      "...EEEEEEEEEEEE...",
      "..ESSSSSSSSSSSSE..",
      ".ESSSSSSSSSSSSSSE.",
      "ESSSSSSSSSSSSSSSSE",
      "ESSSSSSSSSSSSSSSSE",
      "ESSSSSSSSSSSSSSSSE",
      "ESSSSSLLLLLLSSSSSE",
      "ESSSSLLLLLLLLSSSSE",
      "ESSSSLLKKKKLLSSSSE",
      "ESSSSLLKKKKLLSSSSE",
      "ESSSSLLKKKKLLSSSSE",
      "ESSSSLLLLLLLLSSSSE",
      ".ESSSLLLLLLLLSSSE.",
      ".ESSSSSSSSSSSSSSE.",
      ".EsSSSSSSSSSSSSsE.",
      "..EsSSSSSSSSSSsE..",
      "..EssSSSSSSSSseE..",
      "...EssSSSSSSseE...",
      "....EssSSSSseE....",
      ".....EsSSSseE.....",
      "......EsSSeE......",
      ".......EssE.......",
    ],
  ],
};

// ── Mars Rover — drives across the bottom (robotics / Rudra) ───────────────
const marsRoverA: string[] = [
  "..............DD..............",
  "..............DD..............",
  ".............ADDA.............",
  ".............DDDD.............",
  ".............MM...............",
  ".....pPpPpPpPMMpPpPpP.........",
  ".....pppppppppppppppp.........",
  "...BBBBBBBBBBBBBBBBBBBB.......",
  "..BBBBBBBBBBBBBBBBBBBBBB......",
  "..BBBbBBBBBBBBBBBBBBbBBB......",
  "..BBBBBBBBBBBBBBBBBBBBBB......",
  "..bbbbbbbbbbbbbbbbbbbbbb......",
  "...D..D....D....D...D.D.......",
  "..WWWW.WWWW...WWWW..WWWW......",
  ".WwHwW.WwHwW.WwHwW.WwHwW......",
  ".WHwHW.WHwHW.WHwHW.WHwHW......",
  ".WwHwW.WwHwW.WwHwW.WwHwW......",
  "..WWWW.WWWW...WWWW..WWWW......",
];
const marsRoverB: string[] = [
  "..............DD..............",
  "..............DD..............",
  ".............ADDA.............",
  ".............DDDD.............",
  ".............MM...............",
  ".....pPpPpPpPMMpPpPpP.........",
  ".....pppppppppppppppp.........",
  "...BBBBBBBBBBBBBBBBBBBB.......",
  "..BBBBBBBBBBBBBBBBBBBBBB......",
  "..BBBbBBBBBBBBBBBBBBbBBB......",
  "..BBBBBBBBBBBBBBBBBBBBBB......",
  "..bbbbbbbbbbbbbbbbbbbbbb......",
  "...D..D....D....D...D.D.......",
  "..WWWW.WWWW...WWWW..WWWW......",
  ".WHwHW.WHwHW.WHwHW.WHwHW......",
  ".WwHwW.WwHwW.WwHwW.WwHwW......",
  ".WHwHW.WHwHW.WHwHW.WHwHW......",
  "..WWWW.WWWW...WWWW..WWWW......",
];
const marsRover: Sprite = {
  w: 30,
  h: 18,
  fps: 6,
  palette: {
    B: "#d9dde3",
    b: "#a7adb8",
    P: "#2b6cc4",
    p: "#1c4e97",
    M: "#7a828e",
    D: "#3a3f47",
    W: "#4a4f57",
    w: "#c9ced6",
    H: "#2a2e34",
    A: "#e8c23a",
  },
  shimmer: { P: ["#255fb0", "#3f82da"], A: ["#d9b12c", "#ffd757"] },
  shimmerSpeed: 0.5,
  frames: [marsRoverA, marsRoverB],
};

// ── Samsung — blue badge with a legible SAMSUNG wordmark (generated) ───────
const FONT5: Record<string, string[]> = {
  S: ["WWWWW", "W....", "WWWWW", "....W", "WWWWW"],
  A: [".WWW.", "W...W", "WWWWW", "W...W", "W...W"],
  M: ["W...W", "WW.WW", "W.W.W", "W...W", "W...W"],
  U: ["W...W", "W...W", "W...W", "W...W", "WWWWW"],
  N: ["W...W", "WW..W", "W.W.W", "W..WW", "W...W"],
  G: ["WWWWW", "W....", "W..WW", "W...W", "WWWWW"],
};
function buildSamsung(): Sprite {
  const word = "SAMSUNG".split("");
  const lw = 5,
    gap = 1;
  const textW = word.length * lw + (word.length - 1) * gap; // 41
  const padX = 5,
    padY = 5;
  const w = textW + padX * 2, // 51
    h = 5 + padY * 2; // 15
  const g = grid(w, h);
  const cx = (w - 1) / 2,
    cy = (h - 1) / 2,
    rx = w / 2 - 0.5,
    ry = h / 2 - 0.5;
  // filled ellipse (two blue shades: lighter rim)
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (d <= 1) put(g, x, y, d > 0.72 ? "b" : "B");
    }
  // wordmark
  let ox = padX;
  const oy = padY;
  for (const ch of word) {
    const m = FONT5[ch];
    for (let j = 0; j < 5; j++)
      for (let i = 0; i < 5; i++) if (m[j][i] === "W") put(g, ox + i, oy + j, "W");
    ox += lw + gap;
  }
  return {
    w,
    h,
    palette: { B: "#1428a0", b: "#2f47c8", W: "#ffffff" },
    shimmer: { b: ["#243bb8", "#3a53d8"] },
    shimmerSpeed: 0.3,
    frames: [ser(g)],
  };
}
const samsung = buildSamsung();

// ── Oil pump-jack — a nodding donkey that pumps (Maximl) ───────────────────
function buildPumpjack(tilt: number): string[] {
  const w = 24,
    h = 16;
  const g = grid(w, h);
  // ground
  rect(g, 0, 15, w, 1, "G");
  rect(g, 0, 14, w, 1, "g");
  // A-frame (Samson post): apex at (13,4) down to base feet
  const apex = { x: 13, y: 4 };
  line(g, apex.x, apex.y, 9, 13, "B");
  line(g, apex.x, apex.y, 17, 13, "B");
  line(g, apex.x - 1, apex.y + 1, 9, 13, "f");
  rect(g, 8, 13, 3, 1, "f");
  rect(g, 16, 13, 3, 1, "f");
  // walking beam pivots on the apex: left end (horsehead) tilts opposite the right (counterweight)
  const lx = 3,
    rx = 21;
  const ly = apex.y + tilt,
    ry = apex.y - tilt;
  line(g, lx, ly, rx, ry, "B");
  line(g, lx, ly + 1, rx, ry + 1, "b");
  put(g, apex.x, apex.y, "O"); // pivot bolt
  // counterweight crank block at the right/back end
  rect(g, rx - 2, ry - 1, 4, 4, "C");
  // horsehead at the left/front end (a small curved head)
  put(g, lx, ly, "H");
  put(g, lx - 1, ly, "H");
  put(g, lx, ly + 1, "H");
  put(g, lx - 1, ly + 1, "H");
  put(g, lx - 1, ly + 2, "H");
  // polished rod from horsehead straight down into the wellhead (length = the pump stroke)
  for (let y = ly + 2; y < 13; y++) put(g, lx - 1, y, "R");
  // wellhead box at the base of the rod
  rect(g, 1, 12, 4, 2, "W");
  return ser(g);
}
const oilplant: Sprite = {
  w: 24,
  h: 16,
  fps: 3,
  palette: {
    B: "#9aa4b3",
    b: "#5b6472",
    f: "#454d59",
    H: "#c24a3a",
    C: "#3a3f47",
    R: "#c9ced6",
    W: "#2f343b",
    G: "#6b5942",
    g: "#4a3c2c",
    O: "#ffcf4a",
  },
  frames: [
    buildPumpjack(-2),
    buildPumpjack(0),
    buildPumpjack(2),
    buildPumpjack(0),
  ],
};

// ── CERN — supercollider ring with two beams colliding (GSoC) ─────────────
function buildCern(frame: number, nFrames: number): string[] {
  const w = 26,
    h = 26;
  const g = grid(w, h);
  const cx = 12.5,
    cy = 12.5;
  const rMid = 9.7;
  // ring torus
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d >= 8.4 && d <= 11) put(g, x, y, y < cy - 1 && x < cx ? "r" : "R");
    }
  // two counter-rotating beams (cyan + magenta), 3 dots each
  const t = (frame / nFrames) * Math.PI * 2;
  const beam = (baseAngle: number, dir: number, color: string) => {
    for (let k = 0; k < 3; k++) {
      const a = baseAngle + dir * t + k * 0.5;
      const x = Math.round(cx + rMid * Math.cos(a));
      const y = Math.round(cy + rMid * Math.sin(a));
      put(g, x, y, color);
    }
  };
  beam(0, 1, "c");
  beam(Math.PI, -1, "M");
  // collision flash at the interaction point (right side), pulsing per frame
  const pulse = frame % (nFrames / 2) === 0;
  if (pulse) {
    const fx = 12,
      fy = 12;
    put(g, fx, fy, "C");
    put(g, fx + 1, fy, "Y");
    put(g, fx - 1, fy, "Y");
    put(g, fx, fy + 1, "Y");
    put(g, fx, fy - 1, "Y");
    put(g, fx + 2, fy, "Y");
    put(g, fx - 2, fy, "Y");
    put(g, fx, fy + 2, "Y");
    put(g, fx, fy - 2, "Y");
  } else {
    put(g, 12, 12, "C");
  }
  return ser(g);
}
const CERN_FRAMES = 8;
const cern: Sprite = {
  w: 26,
  h: 26,
  fps: 8,
  palette: {
    R: "#8fa0b3",
    r: "#c3cedb",
    c: "#5ad1ff",
    M: "#ff5ab0",
    Y: "#ffe27a",
    C: "#eafcff",
  },
  shimmer: { C: ["#9fe8ff", "#ffffff"] },
  shimmerSpeed: 1,
  frames: Array.from({ length: CERN_FRAMES }, (_, i) => buildCern(i, CERN_FRAMES)),
};

// ── Hard-hat worker holding a phone (Maximl field scene) ──────────────────
const worker: Sprite = {
  w: 14,
  h: 20,
  palette: {
    Y: "#f7c518",
    y: "#c99a10",
    S: "#e8b48c",
    s: "#c98f66",
    V: "#f26b21",
    v: "#c14e12",
    B: "#2a3340",
    P: "#20242b",
    L: "#7fe0ff",
    K: "#1a1a1a",
  },
  shimmer: { L: ["#5fc9f0", "#a6ecff"], Y: ["#eeb90f", "#ffd23a"] },
  shimmerSpeed: 0.5,
  frames: [
    [
      "....YYYYYY....",
      "...YYYYYYYY...",
      "..YYYYYYYYYY..",
      "..yyyyyyyyyy..",
      "....SSSSSS....",
      "....SsSSsS....",
      "....SSSSSS....",
      "...VVVVVVVV...",
      "..VVVVVVVVVV..",
      "..VVVvVVvVVV..",
      "..SVVVVVVVVS..",
      "..SVVVVVVPPP..",
      "..SVVVVVVPLP..",
      "...VVVVVVPPP..",
      "..vVVVVVVVv...",
      "..BBBB.BBBB...",
      "..BBBB.BBBB...",
      "..BBB...BBB...",
      "..KKK...KKK...",
      "..............",
    ],
  ],
};

export const SPRITES: Record<string, Sprite> = {
  tux,
  avatar,
  cloudflare,
  samsung,
  superfork,
  armcca,
  marsRover,
  oilplant,
  cern,
  worker,
};

export type SpriteId = keyof typeof SPRITES;
