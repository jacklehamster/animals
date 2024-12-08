import type { Scene } from "../definition/scene";

const SIZE = 30;

export const worldData: Scene = {
  scale: 64,
  layers: {
    "tile": 0,
    "tile_overlay": 1,
    "water": 2,
    "river": 3,
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
    {
      name: "sheep",
      type: "unit",
      hitpoints: 10,
      gameObject: {
        pos: [0, 0] as [number, number],
        size: [1.8, 1.8] as [number, number],
        speed: 0.08,
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
        animation: "sheep_wait",
        indic: {
          animation: "indic",
        },
        moveIndic: {
          animation: "blue",
        },
      },
      move: {
        animation: "sheep_jump",
      },
      shadow: {
        animation: "shadow",
      },
      clearCloud: true,
      dynamic: true,
    },
    {
      name: "dog",
      type: "unit",
      hitpoints: 10,
      gameObject: {
        size: [1.8, 1.8] as [number, number],
        speed: 0.08,
      },
      animation: {
        name: "dog",
      },
      onHover: {
        hideCursor: true,
        indic: {
          animation: "hover",
        },
      },
      selected: {
        animation: "dog_wait",
        indic: {
          animation: "indic",
        },
        moveIndic: {
          animation: "blue",
        },
      },
      move: {
        animation: "dog_jump",
        distance: 2,
      },
      shadow: {
        animation: "shadow",
      },
      clearCloud: true,
      dynamic: true,
    },
    {
      name: "cow",
      type: "unit",
      hitpoints: 15,
      gameObject: {
        size: [1.8, 1.8] as [number, number],
        speed: 0.05,
      },
      animation: {
        name: "cow",
      },
      onHover: {
        hideCursor: true,
        indic: {
          animation: "hover",
        },
      },
      selected: {
        animation: "cow_wait",
        indic: {
          animation: "indic",
        },
        moveIndic: {
          animation: "blue",
        },
      },
      move: {
        animation: "cow_jump",
      },
      shadow: {
        animation: "shadow",
      },
      clearCloud: true,
    },
  ],
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
      name: "sheep_wait",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      mul: 20,
      frames: [
        6, 7,
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
    {
      name: "house",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        27, 28, 29,
      ],
      mul: 20,
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
      mul: 10,
      frames: [
        51, 53, 54,
      ],
      airFrames: [54],
    },
    {
      name: "wheat",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        55,
      ],
    },
    {
      name: "wood",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        56,
      ],
    },
    {
      name: "brain",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64] as [number, number],
      frames: [
        57,
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
      definition: "sheep",
      owner: 1,
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
  menu: [
    {
      name: "sheep",
      icon: {
        imageSource: "./assets/tiles.png",
        spriteSize: [64, 64] as [number, number],
        padding: [1, 1],
        frames: [6, 7],
      },
      items: [
        {
          name: "build",
          imageSource: "./assets/tiles.png",
          spriteSize: [64, 64] as [number, number],
          padding: [1, 1],
          frames: [27, 28, 29],
          label: "build\nsettlement",
          actions: [
            {
              deselect: true,
              create: {
                name: "house",
                type: "house",
                level: 10,
                gameObject: {
                  offset: [0, .7] as [number, number],
                  size: [2, 2] as [number, number],
                },
                animation: {
                  name: "house",
                },
                onHover: {
                  hideCursor: true,
                  indic: {
                    animation: "hover",
                  },
                },
                selected: {
                  animation: "house",
                  indic: {
                    animation: "indic",
                  },
                },
                dynamic: true,
              },
            },
            {
              destroy: true,
            },
          ],
        },
      ],
    },
    {
      name: "house",
      icon: {
        imageSource: "./assets/tiles.png",
        spriteSize: [64, 64] as [number, number],
        padding: [1, 1],
        frames: [27, 28, 29],
      },
      items: [
        {
          name: "sheep",
          imageSource: "./assets/tiles.png",
          spriteSize: [64, 64] as [number, number],
          padding: [1, 1],
          frames: [6],
          label: "spawn\nsheep",
          hidden: {
            occupied: ["unit", "Tile occupied\nby a unit"],
          },
          disabled: {
            levelBelowEqual: [1, "Level\ntoo low"],
          },
          actions: [
            {
              deselect: true,
              level: -1,
              create: {
                definition: "sheep",
              },
            },
          ],
        },
        {
          name: "dog",
          imageSource: "./assets/tiles.png",
          spriteSize: [64, 64] as [number, number],
          padding: [1, 1],
          frames: [46],
          label: "spawn\ndog",
          hidden: {
            occupied: ["unit", "Tile occupied\nby a unit"],
          },
          actions: [
            {
              deselect: true,
              create: {
                definition: "dog",
              },
            },
          ],
        },
        {
          name: "cow",
          imageSource: "./assets/tiles.png",
          spriteSize: [64, 64] as [number, number],
          padding: [1, 1],
          frames: [51],
          label: "spawn\ncow",
          hidden: {
            occupied: ["unit", "Tile occupied\nby a unit"],
          },
          actions: [
            {
              deselect: true,
              create: {
                definition: "cow",
              },
            },
          ],
        },
      ],
    },
  ],
};

(window as any).worldData = worldData;
