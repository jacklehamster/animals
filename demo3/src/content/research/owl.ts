import type { Research } from "../../definition/research";

export const OWL_RESEARCH: Research = {
  name: "owl",
  description: "Owls are flying scouts.\nThey hide in trees.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  dependency: ["squirrel"],
  cost: 40,
  recommended: 6,
};
