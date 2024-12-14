import type { Anim } from "../../definition/animation";

export const DIGITS_ANIMATION: Anim[] = new Array(10)
  .fill(36)
  .map((base, i) => ({
    name: `num_${i}`,
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    frames: [
      base + i,
    ],
  }));
