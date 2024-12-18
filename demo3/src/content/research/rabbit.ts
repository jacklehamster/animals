import type { Research } from "../../definition/research";

export const RABBIT_RESEARCH: Research = {
  name: "rabbit",
  description: "Rabbits cast magic spells to heal.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["beaver"],
  cost: 30,
};
