import type { Elem } from "../../definition/elem";

export const CABANA_DEFINITION: Elem = {
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
    { gold: [20, 40] },
    // { invention: 1 },
    {
      spawnFoes: {
        count: [1, 2],
        element: {
          definition: "hobo"
        },
      }
    },
    {
      unit: {
        definition: "dog",
        turn: {
          moves: 0,
          attacks: 0,
        }
      }
    },
  ],
};
