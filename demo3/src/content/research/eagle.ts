import type { Research } from "../../definition/research";

export const EAGLE_RESEARCH: Research = {
  name: "eagle",
  description: "Eagles are airborn fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["owl"],
};
