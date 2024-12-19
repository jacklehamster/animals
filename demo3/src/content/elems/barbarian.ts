import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const HOBO: Elem = {
  definition: "hobo",
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: 0.05,
    farFromCenter: 7,
  },
};
