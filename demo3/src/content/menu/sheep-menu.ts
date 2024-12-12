import type { Menu } from "../../definition/menu";

export const SHEEP_MENU: Menu = {
  name: "sheep",
  description: "The sheep is your settler.\nUse it to build settlements.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [6, 7],
  },
  items: [
    {
      name: "build",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [27, 28, 29],
      label: "build\nsettlement",
      disabled: {
        proximity: ["house", "Too close to\nanother house"],
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "house",
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
