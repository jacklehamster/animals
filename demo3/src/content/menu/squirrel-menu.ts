import type { Menu } from "../../definition/menu";
import { BEAVER_ANIMATION } from "../animations/beaver";
import { SQUIRREL_ANIMATION } from "../animations/squirrel";

export const SQUIRREL_MENU: Menu = {
  name: "squirrel",
  description: "Squirrels can climb on trees and throw nuts.",
  icon: SQUIRREL_ANIMATION,
  items: [
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
  ],
};
