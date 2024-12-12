import type { Research } from "../../definition/research";

export const PANDA_RESEARCH: Research = {
  name: "panda",
  description: "Pandas are strong fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["squirrel"],
};
