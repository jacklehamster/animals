import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const LAKE: Elem = {
  name: "lake",
  type: "tile_overlay",
  resourcesProduced: {
    wheat: -1,
    trade: 2,
  },
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: .1,
  },
  gameObject: {
    pos: [0, 0] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "lake",
  },
  spread: {
    animation: "wave",
    count: [3, 7] as [number, number],
  },
  branchOut: {
    count: [1, 5] as [number, number],
    chance: .2,
    element: {
      definition: "river",
    },
  },
  water: true,
};
