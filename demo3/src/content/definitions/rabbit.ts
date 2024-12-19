import type { Elem } from "../../definition/elem";

export const RABBIT_DEFINITION: Elem = {
  name: "rabbit",
  type: "unit",
  hitpoints: 5,
  maxHitPoints: 5,
  gameObject: {
    size: [1.5, 1.5] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "rabbit",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "rabbit_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "rabbit_jump",
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
    damage: 1,
    defense: 1,
  },
  canCrossTerrains: ["tree"],
};
