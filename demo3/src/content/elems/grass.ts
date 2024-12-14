import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const GRASS: Elem = {
  name: "grass",
  type: "tile",
  resourcesProduced: {
    wheat: 2,
  },
  group: {
    grid: [SIZE + 1, SIZE + 1],
  },
  gameObject: {
    pos: [0, 0] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "grassland",
  },
  spread: {
    animation: "grass",
    count: [3, 7] as [number, number],
  },
};
