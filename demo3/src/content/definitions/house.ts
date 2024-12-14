import type { Elem } from "../../definition/elem";

export const HOUSE_DEFINITION: Elem = {
  name: "house",
  type: "house",
  level: 1,
  gameObject: {
    offset: [0, .7] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "house",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "house",
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
  },
  resourcesProduced: {
    trade: 1,
  }
};
