import type { Elem } from "../../definition/elem";

export const VILLAGE_DEFINITION: Elem = {
  name: "village",
  type: "house",
  level: 7,
  gameObject: {
    offset: [0, .7] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "village",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "village",
    indic: {
      animation: "indic",
    },
  },
  dynamic: true,
  settler: true,
  harvesting: true,
  building: true,
  turn: {
    moves: 0,
    attacks: 0,
    actions: 1,
  },
  resourcesProduced: {
    // wood: 1,
    trade: 2,
  },
  rewards: [],
  advise: {
    name: "house",
    message: "Villages hold more population and can produce more resources.",
  },
  clearCloud: true,
};
