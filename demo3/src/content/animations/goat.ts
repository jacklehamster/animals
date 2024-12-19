import type { Anim } from "../../definition/animation";

export const GOAT_ANIMATION: Anim = {
  name: "goat",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    128,
  ],
};

export const GOAT_WAIT_ANIMATION: Anim = {
  name: "goat_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    128, 129,
  ],
};

export const GOAT_JUMP_ANIMATION: Anim = {
  name: "goat_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    128, 130, 131, 132,
  ],
  airFrames: [130, 131, 132],
};

export const GOAT_SLEEP_ANIMATION: Anim = {
  name: "goat_sleep",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    129
  ],
};
