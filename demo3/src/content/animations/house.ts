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

export const HOUSE_EXPAND_ANIMATION: Anim = {
  name: "house_expand",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    120,
  ],
};

export const VILLAGE_ANIMATION: Anim = {
  name: "village",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    121, 122, 123,
  ],
  mul: 20,
}
