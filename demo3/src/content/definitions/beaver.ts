import type { Elem } from "../../definition/elem";

export const BEAVER_DEFINITION: Elem = {
  name: "beaver",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "beaver",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "beaver_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "beaver_jump",
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
    animation: "beaver_attack",
    damage: 1,
    defense: 2,
  },
  canCrossTerrains: ["tree", "water"],
};
