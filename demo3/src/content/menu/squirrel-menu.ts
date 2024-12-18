import type { Menu } from "../../definition/menu";

export const SQUIRREL_MENU: Menu = {
  name: "squirrel",
  description: "Squirrels can climb on trees and throw nuts.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [6, 7],
  },
  items: [
    {
      name: "beaver",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [27, 28, 29],
      label: "evolve into\nbeaver",
      researchNeeded: ["beaver"],
      actions: [
        {
          deselect: true,
          create: {
            definition: "beaver",
            selfSelect: true,
          },
        },
        {
          destroy: true,
        },
      ],
    },
  ],
};
