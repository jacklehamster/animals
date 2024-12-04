import type { Scene } from "../definition/scene";

const SIZE = 30;

export const worldData: Scene = {
  scale: 64,
  layers: ["tile", "tile_overlay", "water", "river", "unit", "decor", "cloud", "cursor"],
  animations: [
    {
      name: "triangle",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 2,
      frames: [
        0, 1, 2, 3,
      ],
    },
    {
      name: "sheep",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        6,
      ],
    },
    {
      name: "sheep_jump",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 2,
      frames: [
        6, 7, 8, 8,
      ],
      airFrames: [8],
    },
    {
      name: "hover",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        20,
      ],
    },
    {
      name: "indic",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 3,
      frames: [
        9, 9, 10, 11, 12, 11, 10,
      ],
    },
    {
      name: "blue",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        13,
      ],
    },
    {
      name: "grassland",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        14,
      ],
    },
    {
      name: "plain",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        30,
      ],
    },
    {
      name: "grass",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        15,
      ],
    },
    {
      name: "tree",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        16,
      ],
    },
    {
      name: "tree_leaf",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        17,
      ],
    },
    {
      name: "mountain",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        25,
      ],
    },
    {
      name: "cloud",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        18,
      ],
    },
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
        count: [8, 10] as [number, number],
      },
    },
    {
      name: "sheep",
      type: "unit",
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [2, 2] as [number, number],
        speed: 0.1,
      },
      animation: {
        name: "sheep",
      },
      onHover: {
        hideCursor: true,
        indic: {
          animation: "hover",
        },
      },
      selected: {
        animation: "sheep_jump",
        indic: {
          animation: "indic",
        },
        moveIndic: {
          animation: "blue",
        },
      },
      shadow: {
        animation: "shadow",
      },
      clearCloud: true,
      dynamic: true,
    },
    {
      name: "grass",
      type: "tile",
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
      type: "water",
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
        animation: "river",
        count: [1, 5] as [number, number],
        chance: .2,
      }
    },
    {
      name: "tree",
      type: "decor",
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.1,
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
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.1,
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
  ],
};

(window as any).worldData = worldData;
