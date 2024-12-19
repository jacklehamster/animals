import type { Menu } from "../../definition/menu";
import { RABBIT_ANIMATION } from "../animations/rabbit";
import { LAKE_ANIMATION, RIVER_ANIMATION, TREE_ANIMATION } from "../animations/terrain";

export const BEAVER_MENU: Menu = {
  name: "beaver",
  description: "Beavers can build dam, turning rivers into lakes.\nThey can also cut down trees.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [51],
  },
  items: [
    {
      name: "lake",
      ...LAKE_ANIMATION,
      label: "make lake",
      hidden: {
        notOnTile: ["river", "Must be\non a river"],
        onTile: ["lake", "Already a lake"],
      },
      actions: [
        {
          deselect: true,
        },
        {
          create: {
            definition: "lake",
          }
        },
        {
          clearMoves: true,
        },
      ],
    },
    {
      name: "river",
      ...RIVER_ANIMATION,
      label: "produce a river",
      hidden: {
        onTile: ["river", "Already on a river"],
        nonProximity: ["lake", "Must be\nnext to a lake"],
      },
      actions: [
        {
          deselect: true,
        },
        {
          create: {
            definition: "river",
          }
        },
        {
          clearMoves: true,
        },
      ],
    },
    {
      name: "tree",
      ...TREE_ANIMATION,
      label: "cut tree",
      hidden: {
        notOnTile: ["tree", "Must be\non a tree"],
      },
      actions: [
        {
          deselect: true,
        },
        {
          destroy: "tree",
        },
        {
          clearMoves: true,
        },
      ],
    },

    {
      name: "rabbit",
      ...RABBIT_ANIMATION,
      label: "evolve into\nrabbit",
      researchNeeded: ["rabbit"],
      resourceCost: {
        gold: 20,
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "rabbit",
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
