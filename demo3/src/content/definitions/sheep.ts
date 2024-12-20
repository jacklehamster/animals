import type { Elem } from "../../definition/elem";

export const SHEEP_DEFINITION: Elem = {
  name: "sheep",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    size: [1.8, 1.8] as [number, number],
    speed: 0.08,
  },
  animation: {
    name: "sheep",
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover",
    },
  },
  selected: {
    animation: "sheep_wait",
    indic: {
      animation: "indic",
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected",
    },
  },
  move: {
    animation: "sheep_jump",
  },
  shadow: {
    animation: "shadow",
  },
  clearCloud: true,
  dynamic: true,
  settler: true,
  turn: {
    moves: 1,
    attacks: 1,
  },
  attack: {
    damage: 2,
    defense: 1,
  },
  advise: {
    name: "sheep",
    message: "Welcome great leader!\nYou have been chosen to lead the animal kingdom!\n\nYour sheep is the foundation for your civilization.\nUse them to build settlements.\nFind a good spot with plenty of resources.",
    music: true,
  },
};
