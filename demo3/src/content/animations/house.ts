import type { Anim } from "../../definition/animation";

export const HOUSE_ANIMATION: Anim = {
  name: "house",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    27, 28, 29,
  ],
  mul: 20,
};

export const CABANA_ANIMATION: Anim = {
  name: "cabana",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    61,
  ],
};
