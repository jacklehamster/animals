import type { Anim } from "../../definition/animation";

export const SQUIRREL_ANIMATION: Anim = {
  name: "squirrel",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    98,
  ],
};

export const SQUIRREL_WAIT_ANIMATION: Anim = {
  name: "squirrel_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 20,
  frames: [
    98, 99,
  ],
};

export const SQUIRREL_JUMP_ANIMATION: Anim = {
  name: "squirrel_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 2,
  frames: [
    98, 100, 101, 102,
  ],
  airFrames: [100, 101, 102],
};

export const SQUIRREL_ATTACK_ANIMATION: Anim = {
  name: "squirrel_attack",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  mul: 5,
  frames: [
    103, 104,
  ],
  once: true,
};

export const SQUIRREL_SLEEP_ANIMATION: Anim = {
  name: "squirrel_sleep",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64] as [number, number],
  frames: [
    101,
  ],
};
