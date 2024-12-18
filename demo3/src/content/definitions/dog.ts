import type { Elem } from "../../definition/elem";

export const DOG_DEFINITION: Elem = {
  name: "dog",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "dog",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "dog_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "dog_jump",
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
    damage: 2,
    defense: 1,
    moveAfterAttack: true,
    attackAfterMove: true,
  }
};
