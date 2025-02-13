import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const TREE: Elem = {
  definition: "tree",
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: 0.5,
    farFromCenter: 4,
  },
};
