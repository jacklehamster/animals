import type { Anim } from "../../definition/animation";

export const RABBIT_ANIMATION: Anim = {
  name: "rabbit",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    136,
  ],
};

export const RABBIT_WAIT_ANIMATION: Anim = {
  name: "rabbit_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    136, 137,
  ],
};

export const RABBIT_JUMP_ANIMATION: Anim = {
  name: "rabbit_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 3,
  frames: [
    136, 137, 138, 137,
  ],
  airFrames: [137, 138],
};
