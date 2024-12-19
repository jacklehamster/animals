import type { Elem } from "../../definition/elem";

export const FRUIT_DEFINITION: Elem = {
  name: "fruit",
  type: "goodies",
  resourcesProduced: {
    wheat: 2,
  },
  condition: {
    noTile: ["lake", "mountain"],
  },
  gameObject: {
    size: [1, 1] as [number, number],
  },
  animation: {
    name: "fruit",
  },
};
