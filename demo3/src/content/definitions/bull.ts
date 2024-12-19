import type { Elem } from "../../definition/elem";

export const BULL_DEFINITION: Elem = {
  name: "bull",
  type: "unit",
  hitpoints: 15,
  maxHitPoints: 15,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "bull",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "bull_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "bull_jump",
    distance: 2,
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
    damage: 3.5,
    defense: 1,
    attackAfterMove: true,
    attackAfterAttack: true,
  }
};
