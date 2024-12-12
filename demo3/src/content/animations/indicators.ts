import type { Anim } from "../../definition/animation";

export const TRIANGLE_ANIMATION: Anim = {
  name: "triangle",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    0, 1, 2, 3,
  ],
};

export const HOVER_ANIMATION: Anim = {
  name: "hover",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    20,
  ],
};

export const INDIC_ANIMATION: Anim = {
  name: "indic",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 3,
  frames: [
    9, 9, 10, 11, 12, 11, 10,
  ],
};

export const BLUE_ANIMATION: Anim = {
  name: "blue",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    13,
  ],
};
