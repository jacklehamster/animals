import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const FRUIT: Elem = {
  definition: "fruit",
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: 0.03,
  },
};
