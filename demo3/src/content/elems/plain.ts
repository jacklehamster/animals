import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const PLAIN: Elem = {
  name: "plain",
  type: "tile_overlay",
  resourcesProduced: {
    wood: 1,
    wheat: -1,
  },
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: .9,
  },
  gameObject: {
    pos: [0, 0] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "plain",
  },
  spread: {
    animation: "grass",
    count: [3, 7] as [number, number],
  },
};
