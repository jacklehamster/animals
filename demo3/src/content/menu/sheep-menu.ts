import type { Menu } from "../../definition/menu";
import { GOAT_ANIMATION } from "../animations/goat";
import { SHEEP_ANIMATION } from "../animations/sheep";

export const SHEEP_MENU: Menu = {
  name: "sheep",
  description: "The sheep is your settler.\nUse it to build settlements.",
  icon: SHEEP_ANIMATION,
  items: [
    {
      name: "build",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [27, 28, 29],
      label: "build\nsettlement",
      disabled: {
        occupied: ["house", "Move away from house"],
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
          selfDestroy: true,
        },
      ],
    },
    {
      name: "goat",
      ...GOAT_ANIMATION,
      label: "evolve into\ngoat",
      researchNeeded: ["goat"],
      resourceCost: {
        gold: 10,
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "goat",
            selfSelect: true,
          },
        },
        {
          selfDestroy: true,
        },
      ],
    },
  ],
};
