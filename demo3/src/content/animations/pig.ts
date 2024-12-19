import type { Anim } from "../../definition/animation";

export const PIG_ANIMATION: Anim = {
  name: "pig",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    139,
  ],
};

export const PIG_WAIT_ANIMATION: Anim = {
  name: "pig_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    139, 140,
  ],
};

export const PIG_JUMP_ANIMATION: Anim = {
  name: "pig_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 3,
  frames: [
    139, 141, 142,
  ],
  airFrames: [141, 142],
};

export const PIG_SLEEP_ANIMATION: Anim = {
  name: "pig_sleep",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 10,
  frames: [
    143,
  ],
};
