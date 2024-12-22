import type { Elem } from "../../definition/elem";

export const BEAVER_DEFINITION: Elem = {
  name: "beaver",
  emoji: "🦫", //  emoji: "🦫",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    size: [1.5, 1.5] as [number, number],
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
  canCrossTerrains: ["tree", "lake"],
  advise: {
    "name": "beaver",
    "message": "Beavers can cut down trees and turn rivers into lakes.",
  },
  medalOnCount: {
    count: 2,
    medal: "Beavers",
  },
};
