import type { Elem } from "../../definition/elem";

export const CABANA: Elem = {
  name: "cabana",
  type: "house",
  gameObject: {
    offset: [0, .2] as [number, number],
    size: [2, 2] as [number, number],
  },
  animation: {
    name: "cabana",
  },
  condition: {
    tile: "plain",
    noTile: ["lake", "mountain", "tree"],
    zeroUnit: true,
  },
  rewards: [
    { gold: [10, 30] },
    { invention: 1 },
    {
      spawnFoes: {
        count: [1, 3],
        element: {
          // definition: "dog",
        },
      }
    },
    {
      unit: {
        definition: "dog",
      }
    },
  ],
};
