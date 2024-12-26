import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const LAKE: Elem = {
  // definition: "lake",
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: .1,
  },


  name: "lake",
  type: "tile_overlay",
  resourcesProduced: {
    wheat: -1,
    trade: 2,
  },
  gameObject: {
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "lake",
  },
  spread: {
    animation: "wave",
    count: [1, 1] as [number, number],
  },
  branchOut: {
    count: [3, 5] as [number, number],
    chance: .3,
    element: {
      definition: "river",
    },
  },
  water: true,
  copy: true,

};
