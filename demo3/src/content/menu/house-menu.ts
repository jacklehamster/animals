import type { Menu } from "../../definition/menu";
import { COW_ANIMATION } from "../animations/cow";
import { DOG_ANIMATION } from "../animations/dog";
import { HOUSE_ANIMATION, VILLAGE_ANIMATION } from "../animations/house";
import { SHEEP_ANIMATION } from "../animations/sheep";
import { SQUIRREL_ANIMATION } from "../animations/squirrel";
import { TURTLE_ANIMATION } from "../animations/turtle";
import { HOUSE_MENU_DEBUG } from "./house-menu-debug";

export const HOUSE_MENU: Menu = {
  name: "house",
  description: "Use settlements to grow your animal kingdom.",
  icon: HOUSE_ANIMATION,
  items: [
    {
      name: "sheep",
      imageSource: "./assets/tiles.png",
      ...SHEEP_ANIMATION,
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
      ...COW_ANIMATION,
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
      ...DOG_ANIMATION,
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
      ...SQUIRREL_ANIMATION,
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
      researchNeeded: ["nutology"],
    },
    {
      name: "turtle",
      ...TURTLE_ANIMATION,
      label: "spawn\nturtle",
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
            definition: "turtle",
            selfSelect: true,
          },
        },
      ],
      researchNeeded: ["tortoise"],
    },
    {
      name: "village",
      ...VILLAGE_ANIMATION,
      label: "upgrade to\nvillage",
      disabled: {
        levelBelowEqual: [5, "You need to level up\nyour settlement first"],
      },
      resourceCost: {
        wood: 60,
      },
      researchNeeded: ["village"],
      actions: [
        {
          selfDestroy: true,
        },
        {
          create: {
            definition: "village",
            selfSelect: true,
          },
        },
      ]
    },
    ...HOUSE_MENU_DEBUG,
  ],
};
