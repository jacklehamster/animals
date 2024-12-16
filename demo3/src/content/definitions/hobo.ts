import type { Elem } from "../../definition/elem";

export const HOBO_DEFINITION: Elem = {
  name: "hobo",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    offset: [0, .2] as [number, number],
    size: [1.2, 1.2] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "hobo",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "hobo_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "hobo_jump",
    distance: 1,
  },
  shadow: {
    animation: "shadow",
  },
  clearCloud: true,
  dynamic: true,
  turn: {
    moves: 1,
    attacks: 1,
  },
  attack: {
    range: 1,
    damage: 2,
    defense: 2,
  },
};
