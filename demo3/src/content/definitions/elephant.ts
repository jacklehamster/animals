import type { Elem } from "../../definition/elem";

export const ELEPHANT_DEFINITION: Elem = {
  name: "elephant",
  emoji: "🐘", //  emoji: "",
  type: "unit",
  hitpoints: 40,
  maxHitPoints: 40,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "elephant",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "elephant_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "elephant_walk",
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
    damage: 4,
    defense: 4,
  },
  medalOnCount: {
    count: 2,
    medal: "Elephants",
  },
};
