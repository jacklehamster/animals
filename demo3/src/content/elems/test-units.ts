import type { Elem } from "../../definition/elem";

export const TEST_UNITS: Elem[] = [
  {
    definition: "hobo",
    owner: 0,
    gameObject: {
      offset: [0, .2] as [number, number],
      size: [1.2, 1.2] as [number, number],
      speed: 0.08,
      pos: [2, 0] as [number, number],
    },
    debug: true,
  },
  // {
  //   definition: "squirrel",
  //   owner: 1,
  //   gameObject: {
  //     pos: [-2, 0] as [number, number],
  //   },
  //   debug: true,
  // },
];
