import type { Elem } from "../../definition/elem";

export const TURTLE_DEFINITION: Elem = {
  name: "turtle",
  emoji: "🐢",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.03,
  },
  animation: {
    name: "turtle",
  },
  worker: true,
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "turtle_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  harvest: {
    animation: "turtle_sleep",
  },
  move: {
    animation: "turtle_jump",
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
    defense: 4,
  },
  canCrossTerrains: ["lake"],
  medalOnCount: {
    count: 2,
    medal: "Turtles",
  },
};
