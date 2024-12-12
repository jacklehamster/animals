import type { Research } from "../../definition/research";

export const ELEPHANT_RESEARCH: Research = {
  name: "elephant",
  description: "Elephants can trample enemies.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["pig"],
};
