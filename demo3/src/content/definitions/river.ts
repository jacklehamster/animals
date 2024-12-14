import type { Elem } from "../../definition/elem";

export const RIVER_DEFINITION: Elem = {
  name: "river",
  type: "road",
  resourcesProduced: {
    wheat: 1,
    trade: 1,
  },
  gameObject: {
    size: [2, 2],
  },
  animation: {
    name: "river",
  },
  condition: {
    noTile: "lake",
  },
};
