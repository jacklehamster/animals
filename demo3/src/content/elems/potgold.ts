import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const POTGOLD: Elem = {
  definition: "potgold",
  group: {
    grid: [SIZE + 1, SIZE + 1],
    chance: .1,
  },
};
