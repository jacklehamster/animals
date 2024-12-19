import type { Elem } from "../../definition/elem";

export const LAKE_DEFINITION: Elem = {
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
    count: [3, 7] as [number, number],
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
}
