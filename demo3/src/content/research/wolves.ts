import type { Research } from "../../definition/research";

export const WOLVES_RESEARCH: Research = {
  name: "wolves",
  description: "Wolves are ferocious fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [46],
  },
  dependency: ["canine"],
  cost: 40,
  recommended: 7,
};
