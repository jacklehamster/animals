import type { Anim } from "../../definition/animation";

export const COW_ANIMATION: Anim = {
  name: "cow",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    51,
  ],
}

export const COW_WAIT_ANIMATION: Anim = {
  name: "cow_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    51, 52, 51,
  ],
};

export const COW_JUMP_ANIMATION: Anim = {
  name: "cow_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 5,
  frames: [
    51, 53, 54,
  ],
  airFrames: [54],
};

export const COW_SLEEP_ANIMATION: Anim = {
  name: "cow_sleep",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 10,
  frames: [
    55,
  ],
};
