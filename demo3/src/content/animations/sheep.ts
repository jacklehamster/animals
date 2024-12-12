import type { Anim } from "../../definition/animation";

export const SHEEP_ANIMATION: Anim = {
  name: "sheep",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    6,
  ],
};

export const SHEEP_WAIT_ANIMATION: Anim = {
  name: "sheep_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    6, 7,
  ],
};

export const SHEEP_JUMP_ANIMATION: Anim = {
  name: "sheep_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    6, 7, 8, 8,
  ],
  airFrames: [8],
};
