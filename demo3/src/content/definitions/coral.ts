import type { Elem } from "../../definition/elem";

export const CORAL_DEFINITION: Elem = {
  name: "coral",
  type: "goodies",
  resourcesProduced: {
    wheat: 2,
    brain: 2
  },
  condition: {
    tile: "lake",
  },
  gameObject: {
    size: [1, 1] as [number, number],
  },
  animation: {
    name: "coral",
  },
};
