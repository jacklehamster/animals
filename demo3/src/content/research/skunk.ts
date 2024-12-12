import type { Research } from "../../definition/research";

export const SKUNK_RESEARCH: Research = {
  name: "skunk",
  description: "Skunks can spray enemies.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["squirrel"],
};
