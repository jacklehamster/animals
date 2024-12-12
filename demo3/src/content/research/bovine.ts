import type { Research } from "../../definition/research";

export const BOVINE_RESEARCH: Research = {
  name: "bovine",
  description: "Cows are your workers.\nUse them to harvest resources.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: [],
};
