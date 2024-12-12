import type { Elem } from "../../definition/elem";

export const SHEEP: Elem = {
  name: "sheep",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    pos: [0, 0] as [number, number],
    size: [1.8, 1.8] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "sheep",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "sheep_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "sheep_jump",
  },
  shadow: {
    animation: "shadow",
  },
  clearCloud: true,
  dynamic: true,
  settler: true,
  turn: {
    moves: 1,
    attacks: 1,
  },
};
