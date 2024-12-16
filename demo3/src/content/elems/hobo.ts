import type { Elem } from "../../definition/elem";

export const HOBO: Elem = {
  definition: "hobo",
  turn: {
    moves: 1,
    attacks: 1,
  },
  owner: 0,
  gameObject: {
    offset: [0, .2] as [number, number],
    size: [1.2, 1.2] as [number, number],
    speed: 0.08,
    pos: [2, 0] as [number, number],
  },
};
