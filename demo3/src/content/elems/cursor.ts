import type { Elem } from "../../definition/elem";

export const CURSOR: Elem = {
  name: "cursor",
  type: "cursor",
  gameObject: {
    pos: [0, 0] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "triangle",
  },
  mouseFollower: {
    snap: 1,
  },
  dynamic: true,
};
