import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const TREE: Elem = {
  name: "tree",
  type: "decor",
  resourcesProduced: {
    wood: 1,
  },
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: 0.1,
  },
  condition: {
    tile: "plain",
    noTile: "lake",
  },
  gameObject: {
    pos: [0, 0] as [number, number],
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
