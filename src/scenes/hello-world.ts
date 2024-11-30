import type { Scene } from "../type/scene";

export const INTRO: Scene = {
  world: {
    elements: [
      {
        camera: {
          scale: 40,
        },
      },
      {
        world: {
          pos: [-5, -5],
          size: [4, 4],
          grid: [10, 10],
          color: "random",
        },
      },
      {
        hud: {
          label: "click here to continue",
          pos: [0.5, 0.5],
          size: 40,
        },
      },
      {
        data: {
          nextOnClick: true,
        },
      },
    ],
  },
};

export const HELLO_WORLD: Scene = {
  world: {
    elements: [
      {
        camera: {
          scale: 40,
        },
      },
      {
        world: {
          pos: [-10, -10],
          size: [2, 2],
          grid: [20, 20],
          color: "random",
        },
      },
      {
        world: {
          size: [2, 4],
          animation: [
            {
              texture: "assets/dude/dude.png",
              spriteSize: [32, 64],
              frames: 4,
            },
          ],
          mouseFollow: {
            offset: [0, 0],
          },
        },
      },
      {
        hud: {
          label: "Hello World!",
          pos: [0.5, 0.5],
          size: 80,
        },
      },
      {
        data: {
          nextOnClick: true,
        },
      },
    ],
  },
};
