import type { Elem } from "../../definition/elem";

export const COW_DEFINITION: Elem = {
  name: "cow",
  type: "unit",
  hitpoints: 15,
  maxHitPoints: 15,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.06,
  },
  animation: {
    name: "cow",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "cow_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  clearCloud: true,
  move: {
    animation: "cow_jump",
    distance: 2,
    disabled: {
      harvesting: true,
    },
  },
  harvest: {
    animation: "cow_sleep",
  },
  shadow: {
    animation: "shadow",
  },
  worker: true,
  turn: {
    moves: 1,
    attacks: 0,
    actions: 1,
  },
  closeToHome: true,
  endlessMove: true,
  attack: {
    damage: 2,
    defense: 1,
    disabled: true,
  }
};
