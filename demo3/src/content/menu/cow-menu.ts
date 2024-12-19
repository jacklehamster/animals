import type { Menu } from "../../definition/menu";
import { BULL_ANIMATION } from "../animations/bull";

export const COW_MENU: Menu = {
  name: "cow",
  description: "Cows are your workers.\nUse them to harvest resources.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  items: [
    {
      name: "harvest",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [55],
      label: "harvest",
      hidden: {
        occupied: ["house", "No harvest on house"],
        harvesting: true,
      },
      disabled: {
        // nonProximity: ["house", "Must be\nnext to a house"],
        proximity: ["foe", "Nearby foes,\ntoo dangerous."],
      },
      actions: [
        {
          deselect: true,
        },
        {
          harvest: true,
        },
        {
          clearMoves: true,
        },
      ],
    },
    {
      name: "stopHarvest",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      padding: [2, 2],
      frames: [51],
      label: "stop harvest",
      hidden: {
        notHarvesting: true,
      },
      actions: [
        {
          deselect: true,
        },
        {
          stopHarvest: true,
        },
      ],
    },
    {
      name: "bull",
      ...BULL_ANIMATION,
      label: "evolve into\nbull",
      researchNeeded: ["taurology"],
      resourceCost: {
        gold: 30,
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "bull",
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
