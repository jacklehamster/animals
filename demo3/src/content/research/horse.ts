import type { Research } from "../../definition/research";

export const HORSE_RESEARCH: Research = {
  name: "horse",
  description: "Horses a fast fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["oviculture"],
  cost: 20,
  recommended: 5,
};
