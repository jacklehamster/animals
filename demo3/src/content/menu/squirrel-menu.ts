import type { Menu } from "../../definition/menu";
import { BEAVER_ANIMATION } from "../animations/beaver";
import { PANDA_ANIMATION } from "../animations/panda";
import { SQUIRREL_ANIMATION, SQUIRREL_SLEEP_ANIMATION } from "../animations/squirrel";

export const SQUIRREL_MENU: Menu = {
  name: "squirrel",
  description: "Squirrels can climb on trees to harvest, and throw nuts.",
  icon: SQUIRREL_ANIMATION,
  items: [
    {
      name: "harvest",
      ...SQUIRREL_SLEEP_ANIMATION,
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
      ...SQUIRREL_ANIMATION,
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
      name: "beaver",
      ...BEAVER_ANIMATION,
      label: "evolve into\nbeaver",
      researchNeeded: ["beaver"],
      resourceCost: {
        gold: 10,
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "beaver",
            selfSelect: true,
          },
        },
        {
          selfDestroy: true,
        },
      ],
    },

    {
      name: "panda",
      ...PANDA_ANIMATION,
      label: "evolve into\npanda",
      researchNeeded: ["panda"],
      resourceCost: {
        gold: 20,
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "panda",
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
