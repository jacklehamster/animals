import type { Anim } from "../../definition/animation";

export const BULL_ANIMATION: Anim = {
  name: "bull",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    112,
  ],
};

export const BULL_WAIT_ANIMATION: Anim = {
  name: "bull_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    112, 113,
  ],
};

export const BULL_JUMP_ANIMATION: Anim = {
  name: "bull_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    112, 113,
  ],
};
