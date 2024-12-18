import type { Elem } from "../../definition/elem";

export const SOLDIER_DEFINITION: Elem = {
  name: "soldier",
  type: "unit",
  hitpoints: 15,
  maxHitPoints: 15,
  gameObject: {
    offset: [0, .2] as [number, number],
    size: [1.2, 1.2] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "soldier_blue_center_down_still",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "soldier_blue_center_down_walk",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "soldier_blue_center_down_walk",
    distance: 1,
  },
  shadow: {
    animation: "shadow",
  },
  dynamic: true,
  turn: {
    moves: 1,
    attacks: 1,
  },
  attack: {
    damage: 2,
    defense: 2,
  },
};
