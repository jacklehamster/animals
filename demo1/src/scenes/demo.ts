import type { Scene } from "../type/scene";

export const DEMO: Scene = {
  world: {
    elements: [
      {
        world: {
          size: [2, 4],
          pos: [-10, -10],
          grid: [20, 20],
          tileSize: [2, 2],
          animation: [
            {
              texture: "assets/world/tiles.png",
              spriteSize: [32, 64],
              startFrame: 5,
            },
          ],
        },
      },
      {
        name: "sheep",
        world: {
          size: [2, 4],
          tileSize: [2, 2],
          animation: [
            {
              texture: "assets/world/tiles.png",
              spriteSize: [32, 64],
              startFrame: 6,
            }
          ],
        },
        data: {
          player: 1,
          reveal: 1,
          moveOnClick: true,
        },
      },
      {
        world: {
          size: [2, 4],
          animation: [
            {
              texture: "assets/world/tiles.png",
              spriteSize: [32, 64],
              frames: 4
            }
          ],
          mouseFollow: {
            offset: [0, 0],
            snap: [2, 2],
          },
        },
      },
    ],
  },
};
