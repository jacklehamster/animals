import type { Scene } from "../definition/scene";
import { CABANA } from "./definitions/cabana";
import { COW } from "./definitions/cow";
import { DOG } from "./definitions/dog";
import { HOUSE } from "./definitions/house";
import { RIVER } from "./definitions/river";
import { SHEEP } from "./definitions/sheep";
import { COW_MENU } from "./menu/cow-menu";
import { HOUSE_MENU } from "./menu/house-menu";
import { SHEEP_MENU } from "./menu/sheep-menu";
import { BEAVER_RESEARCH } from "./research/beaver";
import { BOVINE_RESEARCH } from "./research/bovine";
import { CANINE_RESEARCH } from "./research/canine";
import { ELEPHANT_RESEARCH } from "./research/elephant";
import { EAGLE_RESEARCH } from "./research/eagle";
import { GOAT_RESEARCH } from "./research/goat";
import { HORSE_RESEARCH } from "./research/horse";
import { LAMA_RESEARCH } from "./research/lama";
import { MONKEY_RESEARCH } from "./research/monkey";
import { OWL_RESEARCH } from "./research/owl";
import { PANDA_RESEARCH } from "./research/panda";
import { PIG_RESEARCH } from "./research/pig";
import { SKUNK_RESEARCH } from "./research/skunk";
import { SQUIRREL_RESEARCH } from "./research/squirrel";
import { TORTOISE_RESEARCH } from "./research/tortoise";
import { WOLVES_RESEARCH } from "./research/wolves";
import { BRAIN_RESOURCE } from "./resources/brain";
import { GOLD_RESOURCE } from "./resources/gold";
import { TRADE_RESOURCE } from "./resources/trade";
import { WHEAT_RESOURCE } from "./resources/wheat";
import { WOOD_RESOURCE } from "./resources/wood";
import { RABBIT_RESEARCH } from "./research/rabbit";
import { BLUE_ANIMATION, BLUE_SELECTED_ANIMATION, HOVER_ANIMATION, INDIC_ANIMATION, TRIANGLE_ANIMATION } from "./animations/indicators";
import { SHEEP_ANIMATION, SHEEP_JUMP_ANIMATION, SHEEP_WAIT_ANIMATION } from "./animations/sheep";
import { GRASS_ANIMATION, GRASSLAND_ANIMATION, LAKE_ANIMATION, MOUNTAIN_ANIMATION, PLAIN_ANIMATION, RIVER_ANIMATION, TREE_ANIMATION, TREE_LEAF_ANIMATION, WAVE_ANIMATION } from "./animations/terrain";
import { CLOUD_ANIMATION } from "./animations/cloud";
import { SHADOW_ANIMATION } from "./animations/shadow";
import { CABANA_ANIMATION, HOUSE_ANIMATION } from "./animations/house";
import { DIGITS_ANIMATION } from "./animations/digits";
import { DOG_ANIMATION, DOG_JUMP_ANIMATION, DOG_WAIT_ANIMATION } from "./animations/dog";
import { COW_ANIMATION, COW_JUMP_ANIMATION, COW_SLEEP_ANIMATION, COW_WAIT_ANIMATION } from "./animations/cow";
import { BRAIN_ANIMATION, GOLD_ANIMATION, TRADE_ANIMATION, WHEAT_ANIMATION, WOOD_ANIMATION } from "./animations/resources";

const SIZE = 30;

export const worldData: Scene = {
  scale: 80,
  players: [
    {
      tax: 50,
      resources: {
        brain: 0,
        gold: 0,
      },
    },
  ],
  layers: {
    "tile": 0,
    "tile_overlay": 1,
    "road": 3,
    "house": 4,
    "unit": 4,
    "decor": 4,
    "cloud": 6,
    "cursor": 7,
  },
  colayers: {
    "house": 1,
    "decor": 2,
    "unit": 3,
  },
  definitions: [
    SHEEP,
    DOG,
    COW,
    RIVER,
    HOUSE,
    CABANA,
  ],
  animations: [
    TRIANGLE_ANIMATION,
    SHEEP_ANIMATION,
    SHEEP_WAIT_ANIMATION,
    SHEEP_JUMP_ANIMATION,
    HOVER_ANIMATION,
    INDIC_ANIMATION,
    BLUE_ANIMATION,
    GRASSLAND_ANIMATION,
    PLAIN_ANIMATION,
    GRASS_ANIMATION,
    TREE_ANIMATION,
    TREE_LEAF_ANIMATION,
    MOUNTAIN_ANIMATION,
    CLOUD_ANIMATION,
    SHADOW_ANIMATION,
    BLUE_SELECTED_ANIMATION,
    LAKE_ANIMATION,
    WAVE_ANIMATION,
    RIVER_ANIMATION,
    HOUSE_ANIMATION,
    CABANA_ANIMATION,
    ...DIGITS_ANIMATION,
    DOG_ANIMATION,
    DOG_WAIT_ANIMATION,
    DOG_JUMP_ANIMATION,
    COW_ANIMATION,
    COW_WAIT_ANIMATION,
    COW_JUMP_ANIMATION,
    COW_SLEEP_ANIMATION,
    WHEAT_ANIMATION,
    WOOD_ANIMATION,
    BRAIN_ANIMATION,
    GOLD_ANIMATION,
    TRADE_ANIMATION,
  ],
  elems: [
    {
      name: "cursor",
      type: "cursor",
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
      },
      animation: {
        name: "triangle",
      },
      mouseFollower: {
        snap: 1,
      },
      dynamic: true,
    },
    {
      name: "cloud",
      type: "cloud",
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
      },
      animation: {
        name: "cloud",
      },
      spread: {
        animation: "cloud",
        count: [4, 5] as [number, number],
        color: "#ffffffaa",
        size: 1.2,
      },
    },
    {
      definition: "sheep",
      owner: 1,
      turn: {
        moves: 1,
        attacks: 1,
      },
    },
    {
      name: "grass",
      type: "tile",
      resourcesProduced: {
        wheat: 2,
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
      },
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
      },
      animation: {
        name: "grassland",
      },
      spread: {
        animation: "grass",
        count: [3, 7] as [number, number],
      },
    },
    {
      name: "plain",
      type: "tile_overlay",
      resourcesProduced: {
        wood: 1,
        wheat: -1,
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: .9,
      },
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
      },
      animation: {
        name: "plain",
      },
      spread: {
        animation: "grass",
        count: [3, 7] as [number, number],
      },
    },
    {
      name: "lake",
      type: "tile_overlay",
      resourcesProduced: {
        wheat: -1,
        trade: 2,
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: .1,
      },
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
      },
      animation: {
        name: "lake",
      },
      spread: {
        animation: "wave",
        count: [3, 7] as [number, number],
      },
      branchOut: {
        count: [1, 5] as [number, number],
        chance: .2,
        element: {
          definition: "river",
        },
      },
      water: true,
    },
    {
      name: "tree",
      type: "decor",
      resourcesProduced: {
        wood: 1,
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.1,
      },
      condition: {
        tile: "plain",
        noTile: "lake",
      },
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
      },
      animation: {
        name: "tree",
      },
      spread: {
        animation: "tree_leaf",
        count: [50, 100] as [number, number],
        radius: .25,
      },
    },
    {
      name: "mountain",
      type: "decor",
      resourcesProduced: {
        wheat: -2,
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.1,
      },
      condition: {
        tile: "plain",
      },
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
      },
      animation: {
        name: "mountain",
      },
      spread: {
        animation: "mountain",
        count: [8, 10] as [number, number],
        radius: .3,
        behind: true,
      },
    },
    {
      name: "cabana",
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.02,
      },
      definition: "cabana",
    },
  ],
  menu: [
    SHEEP_MENU,
    HOUSE_MENU,
    COW_MENU,
  ],
  resources: {
    wheat: WHEAT_RESOURCE,
    wood: WOOD_RESOURCE,
    brain: BRAIN_RESOURCE,
    gold: GOLD_RESOURCE,
    trade: TRADE_RESOURCE,
  },
  research: [
    CANINE_RESEARCH,
    BOVINE_RESEARCH,
    WOLVES_RESEARCH,
    BOVINE_RESEARCH,
    TORTOISE_RESEARCH,
    GOAT_RESEARCH,
    SQUIRREL_RESEARCH,
    SKUNK_RESEARCH,
    HORSE_RESEARCH,
    MONKEY_RESEARCH,
    PANDA_RESEARCH,
    PIG_RESEARCH,
    ELEPHANT_RESEARCH,
    BEAVER_RESEARCH,
    OWL_RESEARCH,
    LAMA_RESEARCH,
    EAGLE_RESEARCH,
    RABBIT_RESEARCH,
  ],
};

(window as any).worldData = worldData;
