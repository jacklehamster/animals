import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const CABANA: Elem = {
  name: "cabana",
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: 0.02,
  },
  definition: "cabana",
};
