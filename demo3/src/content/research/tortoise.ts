import type { Research } from "../../definition/research";

export const TORTOISE_RESEARCH: Research = {
  name: "tortoise",
  description: "Turtles can carry others on water.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: [],
};
