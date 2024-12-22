import type { Menu } from "../../definition/menu";
import { ELEPHANT_ANIMATION } from "../animations/elephant";
import { PIG_ANIMATION, PIG_SLEEP_ANIMATION, PIG_WAIT_ANIMATION } from "../animations/pig";

export const PIG_MENU: Menu = {
  name: "pig",
  description: "Pigs are cute",
  icon: PIG_ANIMATION,
  items: [
    {
      name: "harvest",
      ...PIG_SLEEP_ANIMATION,
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
      ...PIG_ANIMATION,
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
      name: "elephant",
      ...ELEPHANT_ANIMATION,
      label: "evolve into\nelephant",
      researchNeeded: ["elephant"],
      resourceCost: {
        gold: 40,
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "elephant",
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
