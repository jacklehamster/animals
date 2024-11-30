'use strict';

import { GameWorld } from "./game-world";
import { HELLO_WORLD, INTRO } from "./scenes/hello-world";
import { AnimProcessor } from "./processors/anim-processor";
import { ColorProcessor } from "./processors/color-processor";
import { GridProcessor } from "./processors/grid-processor";
import { MouseProcessor } from "./processors/mouse-processor";
import { HudProcessor } from "./processors/hud-processor";
import { CameraProcessor } from "./processors/camera-processor";
import { DEMO } from "./scenes/demo";
import { DataProcessor } from "./processors/data-processor";

const scenes = [
  INTRO,
  HELLO_WORLD,
  DEMO,
];
let sceneIndex = 0;

const world: GameWorld = new GameWorld([
  new GridProcessor(),
  new ColorProcessor(),
  new MouseProcessor(),
  new AnimProcessor(),
  new HudProcessor(),
  new CameraProcessor(),
  new DataProcessor(),
]);

async function changeScene(index: number | ((index: number) => number)) {
  await world.destroy();
  sceneIndex = (typeof (index) === "number" ? index : index(sceneIndex)) % scenes.length;
  world.setScene(
    scenes[sceneIndex],
    changeScene,
  );
}
changeScene(0);
