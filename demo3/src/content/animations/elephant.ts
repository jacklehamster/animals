import type { Anim } from "../../definition/animation";

export const ELEPHANT_ANIMATION: Anim = {
  name: "elephant",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    145,
  ],
};

export const ELEPHANT_WAIT_ANIMATION: Anim = {
  name: "elephant_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    145, 146,
  ],
};

export const ELEPHANT_WALK_ANIMATION: Anim = {
  name: "elephant_walk",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    145, 147, 145, 148,
  ],
};
