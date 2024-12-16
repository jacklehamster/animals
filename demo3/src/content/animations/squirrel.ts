import type { Anim } from "../../definition/animation";

export const SQUIRREL_ANIMATION: Anim = {
  name: "squirrel",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    90,
  ],
};

export const SQUIRREL_WAIT_ANIMATION: Anim = {
  name: "squirrel_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    90, 91,
  ],
};

export const SQUIRREL_JUMP_ANIMATION: Anim = {
  name: "squirrel_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    90, 92, 93, 94,
  ],
  airFrames: [92, 93, 94],
};

export const SQUIRREL_ATTACK_ANIMATION: Anim = {
  name: "squirrel_attack",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 5,
  frames: [
    95, 96,
  ],
  once: true,
};
