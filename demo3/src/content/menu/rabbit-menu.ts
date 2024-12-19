import type { Menu } from "../../definition/menu";
import { GOAT_ANIMATION } from "../animations/goat";

export const RABBIT_MENU: Menu = {
  name: "rabbit",
  description: "Rabbits can heal.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [6, 7],
  },
  items: [
    {
      name: "heal",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [27, 28, 29],
      label: "heal",
      disabled: {
        nonProximity: ["unit", "Need a unit\nnearby to heal"],
      },
      actions: [
        {
          deselect: true,
          heal: 10,
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
