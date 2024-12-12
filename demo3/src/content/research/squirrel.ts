import type { Research } from "../../definition/research";

export const SQUIRREL_RESEARCH: Research = {
  name: "squirrel",
  description: "Squirrels can climb trees.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: [],
};
