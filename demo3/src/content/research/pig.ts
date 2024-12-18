import type { Research } from "../../definition/research";

export const PIG_RESEARCH: Research = {
  name: "pig",
  description: "Pigs can harvest resources faster.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["bovine"],
  cost: 20,
};
