import type { Elem } from "../../definition/elem";

export const PIG_DEFINITION: Elem = {
  name: "pig",
  emoji: "🐷",
  type: "unit",
  hitpoints: 15,
  maxHitPoints: 15,
  worker: true,
  resourcesProduced: {
    wheat: 2,
  },
  gameObject: {
    size: [1.5, 1.5] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "pig",
  },
  harvest: {
    animation: "pig_sleep",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "pig_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "pig_jump",
    distance: 1,
    disabled: {
      harvesting: true,
    },
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
  medalOnCount: {
    count: 2,
    medal: "Pigs",
  },
};
