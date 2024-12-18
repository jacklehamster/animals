import type { MenuItem } from "../../definition/menu";

export const HOUSE_MENU_DEBUG: MenuItem[] = [
  {
    name: "hobo",
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [94, 95],
    label: "spawn\nhobo",
    disabled: {
    },
    actions: [
      {
        deselect: true,
        create: {
          definition: "hobo",
          selfSelect: true,
        },
      },
    ],
    debug: true,
  },
  {
    name: "soldier",
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [65, 66, 65, 67],
    label: "spawn\nsoldier",
    disabled: {
    },
    actions: [
      {
        deselect: true,
        create: {
          definition: "soldier",
          selfSelect: true,
        },
      },
    ],
    debug: true,
  },
  {
    name: "squirrel",
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [98],
    label: "spawn\nsquirrel",
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
    debug: true,
  },
];
