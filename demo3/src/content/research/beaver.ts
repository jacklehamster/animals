import type { Research } from "../../definition/research";

export const BEAVER_RESEARCH: Research = {
  name: "beaver",
  description: "Beavers can build dams.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["squirrel"],
};
