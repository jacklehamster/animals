import type { Research } from "../../definition/research";

export const BULLS_RESEARCH: Research = {
  name: "bulls",
  description: "Bulls are strong fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["bovine"],
};
