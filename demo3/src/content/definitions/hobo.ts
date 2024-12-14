import type { Elem } from "../../definition/elem";

const HOBO: Elem = {
  name: "hobo",
  type: "unit",
  hitpoints: 5,
  maxHitPoints: 5,
  gameObject: {
    size: [1.8, 1.8],
    speed: 0.08,
  },
  animation: {
    name: "hobo",
  },
  move: {
    animation: "hobo_jump",
    distance: 2,
  },
  shadow: {
    animation: "shadow",
  },
  dynamic: true,
  turn: {
    moves: 1,
    attacks: 1,
  },
}
