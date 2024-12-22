import type { Elem } from "../../definition/elem";

export const GOAT_DEFINITION: Elem = {
  name: "goat",
  emoji: "🐐", //  emoji: "",
  type: "unit",
  hitpoints: 15,
  maxHitPoints: 15,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.06,
  },
  animation: {
    name: "goat",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "goat_wait",
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
    animation: "goat_jump",
    distance: 1,
    disabled: {
      harvesting: true,
    },
  },
  harvest: {
    animation: "goat_sleep",
  },
  shadow: {
    animation: "shadow",
  },
  worker: true,
  turn: {
    moves: 1,
    attacks: 1,
    actions: 1,
  },
  attack: {
    damage: 2,
    defense: 1,
  },
  advise: {
    name: "goat",
    message: "Goats can climb on mountains."
  },
  canCrossTerrains: ["mountain"],
  medalOnCount: {
    count: 2,
    medal: "Goats",
  },
};
