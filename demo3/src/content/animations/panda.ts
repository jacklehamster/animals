import type { Anim } from "../../definition/animation";

export const PANDA_ANIMATION: Anim = {
  name: "panda",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    133,
  ],
};

export const PANDA_WAIT_ANIMATION: Anim = {
  name: "panda_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 10,
  frames: [
    133, 133, 134,
  ],
};

export const PANDA_JUMP_ANIMATION: Anim = {
  name: "panda_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    133, 135,
  ],
  airFrames: [135],
};
