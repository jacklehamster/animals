import type { Research } from "../../definition/research";

export const LAMA_RESEARCH: Research = {
  name: "lama",
  description: "Lamas spit at their enemies.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: [],
};
