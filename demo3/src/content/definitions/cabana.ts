import type { Elem } from "../../definition/elem";

export const CABANA: Elem = {
  name: "cabana",
  type: "house",
  gameObject: {
    offset: [0, .2] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "cabana",
  },
};
