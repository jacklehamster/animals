import type { Elem } from "../../definition/elem";
import { SIZE } from "../constant";

export const CLOUD: Elem = {
  name: "cloud",
  type: "cloud",
  owner: 0,
  gameObject: {
    pos: [0, 0] as [number, number],
    size: [2, 2] as [number, number],
  },
  group: {
    grid: [SIZE + 1, SIZE + 1],
  },
  animation: {
    name: "cloud",
  },
  spread: {
    animation: "cloud",
    count: [4, 5] as [number, number],
    color: "#ffffffaa",
    size: 1.2,
    moving: .1,
  },
};
