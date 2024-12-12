import type { Research } from "../../definition/research";

export const CANINE_RESEARCH: Research = {
  name: "canine",
  description: "Dogs are your scouts.\nUse them to explore the world.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [46],
  },
  dependency: [],
};
