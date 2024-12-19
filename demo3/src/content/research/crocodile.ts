import type { Research } from "../../definition/research";

export const CROCODILE_RESEARCH: Research = {
  name: "crocodile",
  description: "Crocodiles are ferocious. They can also navigate through lakes.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["tortoise"],
  cost: 40,
  recommended: 6,
};
