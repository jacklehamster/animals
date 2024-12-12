import type { Menu } from "../../definition/menu";

export const HOUSE_MENU: Menu = {
  name: "house",
  description: "Use settlements to grow your animal kingdom.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [27, 28, 29],
  },
  items: [
    {
      name: "sheep",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [6],
      label: "spawn\nsheep",
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"],
      },
      disabled: {
        levelBelowEqual: [1, "Settlement\nlevel too low"],
        cannotAct: [true, "Wait next turn"],
      },
      actions: [
        {
          deselect: true,
          level: -1,
          create: {
            definition: "sheep",
            selfSelect: true,
          },
        },
      ],
    },
    {
      name: "dog",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [46],
      label: "spawn\ndog",
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"],
      },
      disabled: {
        cannotAct: [true, "Wait next turn"],
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "dog",
            selfSelect: true,
          },
        },
      ],
    },
    {
      name: "cow",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [51],
      label: "spawn\ncow",
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"],
        unitLimit: ["cow", "Increase level\nto spawn more"],
      },
      disabled: {
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "cow",
            selfSelect: true,
          },
        },
      ],
    },
  ],
};
