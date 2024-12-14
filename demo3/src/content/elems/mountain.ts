import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const MOUNTAIN: Elem = {
  name: "mountain",
  type: "decor",
  resourcesProduced: {
    wheat: -2,
  },
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: 0.1,
  },
  condition: {
    tile: "plain",
  },
  gameObject: {
    pos: [0, 0] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "mountain",
  },
  spread: {
    animation: "mountain",
    count: [8, 10] as [number, number],
    radius: .3,
    behind: true,
  },
};
