import type { Elem } from "../../definition/elem";

export const TREE_DEFINITION: Elem = {
  name: "tree",
  type: "decor",
  resourcesProduced: {
    wood: 1,
  },
  condition: {
    tile: "plain",
    noTile: "lake",
  },
  gameObject: {
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "tree",
  },
  spread: {
    animation: "tree_leaf",
    count: [50, 100] as [number, number],
    radius: .25,
  },
};
