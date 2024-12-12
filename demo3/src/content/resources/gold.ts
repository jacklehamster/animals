import type { ResourceType } from "../../definition/resource-type";

export const GOLD_RESOURCE: ResourceType = {
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [59],
  },
  global: true,
};
