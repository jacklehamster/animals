import type { Elem } from "../../definition/elem";

export const SQUIRREL_DEFINITION: Elem = {
  name: "squirrel",
  emoji: "🐿️",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "squirrel",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "squirrel_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  harvest: {
    animation: "squirrel_sleep",
  },
  move: {
    animation: "squirrel_jump",
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
    animation: "squirrel_attack",
    range: 2,
    damage: 2,
    defense: 1,
    attackAfterMove: true,
    projectile: "nut",
  },
  worker: true,
  canCrossTerrains: ["tree"],
  advise: {
    name: "squirrel",
    message: "Squirrel can throw nuts and foes, and climb on trees.\nYou can also find some buttons on the bottom left for additional actions.\nHover over them to see what they do.",
  },
};
