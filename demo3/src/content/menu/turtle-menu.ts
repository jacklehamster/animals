import type { Menu } from "../../definition/menu";
import { BEAVER_ANIMATION } from "../animations/beaver";
import { SQUIRREL_ANIMATION, SQUIRREL_SLEEP_ANIMATION } from "../animations/squirrel";
import { TURTLE_ANIMATION, TURTLE_SLEEP_ANIMATION } from "../animations/turtle";

export const TURTLE_MENU: Menu = {
  name: "turtle",
  description: "Turtle can swim in the lake.",
  icon: TURTLE_ANIMATION,
  items: [
    {
      name: "harvest",
      ...TURTLE_SLEEP_ANIMATION,
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
      ...TURTLE_ANIMATION,
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
