import type { ResourceType } from "../../definition/resource-type";

export const TRADE_RESOURCE: ResourceType = {
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [60],
  },
  global: true,
  hidden: true,
};
