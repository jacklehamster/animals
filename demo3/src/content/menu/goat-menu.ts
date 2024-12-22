

import type { Menu } from "../../definition/menu";
import { GOAT_ANIMATION, GOAT_SLEEP_ANIMATION } from "../animations/goat";
import { PIG_ANIMATION, PIG_SLEEP_ANIMATION, PIG_WAIT_ANIMATION } from "../animations/pig";

export const GOAT_MENU: Menu = {
  name: "goat",
  description: "Goats can climb mountains.",
  icon: PIG_ANIMATION,
  items: [
    {
      name: "harvest",
      ...GOAT_SLEEP_ANIMATION,
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
      ...GOAT_ANIMATION,
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
  ],
};
