import type { Anim } from "../../definition/animation";

export const BEAVER_ANIMATION: Anim = {
  name: "beaver",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    106,
  ],
};

export const BEAVER_WAIT_ANIMATION: Anim = {
  name: "beaver_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    106, 107,
  ],
};

export const BEAVER_JUMP_ANIMATION: Anim = {
  name: "beaver_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 3,
  frames: [
    106, 108, 109, 106,
  ],
  airFrames: [108, 109],
};
