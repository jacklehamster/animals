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
import { BLUE_ANIMATION, HOVER_ANIMATION, INDIC_ANIMATION, TRIANGLE_ANIMATION } from "./animations/indicators";
import { SHEEP_ANIMATION, SHEEP_JUMP_ANIMATION, SHEEP_WAIT_ANIMATION } from "./animations/sheep";
import { GRASS_ANIMATION, GRASSLAND_ANIMATION, MOUNTAIN_ANIMATION, PLAIN_ANIMATION, TREE_ANIMATION, TREE_LEAF_ANIMATION } from "./animations/terrain";
import { CLOUD_ANIMATION } from "./animations/cloud";

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
    {
      name: "shadow",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        19,
      ],
    },
    {
      name: "blue_selected",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        21, 22, 23, 24, 23, 22, 21,
      ],
      mul: 3,
    },
    {
      name: "lake",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        33,
      ],
    },
    {
      name: "wave",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        34,
      ],
    },
    {
      name: "river",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        32,
      ],
    },
    {
      name: "house",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        27, 28, 29,
      ],
      mul: 20,
    },
    {
      name: "cabana",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        61,
      ],
    },
    ...new Array(10).fill(36).map((base, i) => ({
      name: `num_${i}`,
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        base + i,
      ],
    })),
    {
      name: "dog",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        46,
      ],
    },
    {
      name: "dog_wait",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 20,
      frames: [
        46, 47,
      ],
    },
    {
      name: "dog_jump",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 2,
      frames: [
        47, 48, 49, 49, 50,
      ],
      airFrames: [48, 49],
    },
    {
      name: "cow",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        51,
      ],
    },
    {
      name: "cow_wait",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 20,
      frames: [
        51, 52, 51,
      ],
    },
    {
      name: "cow_jump",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 5,
      frames: [
        51, 53, 54,
      ],
      airFrames: [54],
    },
    {
      name: "cow_sleep",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 10,
      frames: [
        55,
      ],
    },
    {
      name: "wheat",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        56,
      ],
    },
    {
      name: "wood",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        57,
      ],
    },
    {
      name: "brain",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        58,
      ],
    },
    {
      name: "gold",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        59,
      ],
    },
    {
      name: "trade",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        60,
      ],
    },
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
        chance: 0.01,
      },
      condition: {
        tile: "plain",
        noTile: "lake",
        zeroUnit: true,
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
