import type { Research } from "../../definition/research";

export const MONKEY_RESEARCH: Research = {
  name: "monkey",
  description: "Monkeys throw coconuts.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["squirrel"],
};
