import type { Anim } from "../../definition/animation";

export const TURTLE_ANIMATION: Anim = {
  name: "turtle",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    114,
  ],
};

export const TURTLE_WAIT_ANIMATION: Anim = {
  name: "turtle_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    114, 115,
  ],
};

export const TURTLE_JUMP_ANIMATION: Anim = {
  name: "turtle_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 10,
  frames: [
    114, 115,
  ],
  airFrames: [114],
};

export const TURTLE_SLEEP_ANIMATION: Anim = {
  name: "turtle_sleep",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    127
  ],
};
