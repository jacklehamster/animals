import type { Anim } from "../../definition/animation";

export const DOG_ANIMATION: Anim = {
  name: "dog",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    46,
  ],
};

export const DOG_WAIT_ANIMATION: Anim = {
  name: "dog_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    46, 47,
  ],
};

export const DOG_JUMP_ANIMATION: Anim = {
  name: "dog_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    47, 48, 49, 49, 50,
  ],
  airFrames: [48, 49],
};
