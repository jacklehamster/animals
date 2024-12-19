import type { Elem } from "../../definition/elem";

export const POTGOLD_DEFINITION: Elem = {
  name: "potgold",
  type: "goodies",
  resourcesProduced: {
    gold: 5,
  },
  condition: {
    tile: "mountain",
  },
  gameObject: {
    size: [1, 1] as [number, number],
  },
  animation: {
    name: "potgold",
  },
};
