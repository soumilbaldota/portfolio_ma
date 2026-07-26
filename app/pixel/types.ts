// A sprite is authored as a grid of single characters. Each char maps to a
// palette color; any char not in `palette` (by convention '.') is transparent.
//
// `frames` holds one or more grids (for walk/roll/bob animation). `shimmer`
// makes chosen colors "breathe" — the renderer lerps each listed char between
// two colors on a sine wave, which gives the living, shifting shading.

export type Sprite = {
  w: number;
  h: number;
  palette: Record<string, string>;
  frames: string[][];
  /** char -> [colorLow, colorHigh]; color oscillates between the two. */
  shimmer?: Record<string, [string, string]>;
  /** breaths per second for shimmer (default 0.4). */
  shimmerSpeed?: number;
  /** frames per second for multi-frame animation (default 4). */
  fps?: number;
};
