import type { Menu } from "../../definition/menu";
import { HOUSE_MENU_DEBUG } from "./house-menu-debug";

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
      resourceCost: {
        wood: 10,
      },
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"],
      },
      disabled: {
        levelBelowEqual: [1, "Settlement\nlevel too low"],
        cannotAct: [true, "wait\nnext turn"],
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
      researchNeeded: ["oviculture"],
    },
    {
      name: "cow",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [51],
      resourceCost: {
        wood: 5,
      },
      label: "spawn\ncow",
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"],
      },
      disabled: {
        unitLimit: ["cow", "Increase settlement level\nto spawn more"],
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
      researchNeeded: ["bovine"],
    },
    {
      name: "dog",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [46],
      label: "spawn\ndog",
      resourceCost: {
        wood: 10,
      },
      hidden: {
        occupied: ["unit", "tile occupied\nby a unit"],
      },
      disabled: {
        cannotAct: [true, "wait\nnext turn"],
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
      researchNeeded: ["canine"],
    },
    {
      name: "squirrel",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [98],
      label: "spawn\nsquirrel",
      resourceCost: {
        wood: 10,
      },
      hidden: {
        occupied: ["unit", "tile occupied\nby a unit"],
      },
      disabled: {
        cannotAct: [true, "wait\nnext turn"],
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "squirrel",
            selfSelect: true,
          },
        },
      ],
      researchNeeded: ["squirrel"],
    },
    ...HOUSE_MENU_DEBUG,
  ],
};
