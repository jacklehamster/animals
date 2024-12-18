import type { Anim } from "../../definition/animation";

export const HOBO_ANIMATION: Anim = {
  name: "hobo",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    94,
  ],
};

export const HOBO_WAIT_ANIMATION: Anim = {
  name: "hobo_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 10,
  frames: [
    94, 95,
  ],
};

export const HOBO_JUMP_ANIMATION: Anim = {
  name: "hobo_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    94, 96, 94, 97,
  ],
};
