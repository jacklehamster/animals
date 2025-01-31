/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

'use strict';

import { cameraPos } from "littlejsengine";
import { AnimationManager } from "./animation/animation-manager";
import { GameObject } from "./core/GameObject";
import { engineInit, vec2 } from "./lib/littlejs";

import { SocketClient } from "napl";

const client = new SocketClient("wss://api.dobuki.net", "sample");
// const definition: Definition = {
//   meta: {
//     app: "",
//     version: "",
//     image: "assets/spincasters.png",
//     format: "",
//     size: {
//       w: 512,
//       h: 512
//     },
//     scale: "",
//     frameTags: [],
//     layers: [],
//     slices: []
//   },
//   frames: {}
// };
// const spriteSheet = new SpriteSheet(definition);
// spriteSheet.load().then(sheet => {
//   console.log(sheet);
// });

client.observe(undefined).onChange((update) => {
  console.log(update.value);
});

const animationManager = new AnimationManager([
  {
    name: "spincasters",
    imageSource: "assets/spincasters.png",
    spriteSize: [512, 512],
    frames: [0],
    mul: 1,
  },
  {
    name: "ogre",
    imageSource: "assets/spincasters.png",
    spriteSize: [512, 512],
    frames: [1],
    mul: 1,
  },
]);

const obj = new GameObject(client, true);

const otherPlayers: GameObject[] = [];
client.observe("clients/{keys}")
  .onElementsAdded((clientIds) => {
    clientIds?.forEach((clientId) => {
      const isSelf = clientId === client.clientId;
      if (!isSelf) {
        otherPlayers.push(new GameObject(client, false, client.state.clients[clientId]));
      }
    });
  })


const keys: Record<string, boolean> = {};
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp" || e.code === "KeyW") {
    obj.jump();
  }
  if (e.code === "ArrowRight" || e.code === "KeyD" || e.code === "ArrowLeft" || e.code === "KeyA") {
    keys[e.code] = true;
    updateMovement();
  }
  if (e.key === "x") {
    obj.spin();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight" || e.code === "KeyD" || e.code === "ArrowLeft" || e.code === "KeyA") {
    keys[e.code] = false;
    updateMovement();
  }
});

function updateMovement() {
  let dx = 0;
  if (keys["ArrowRight"] || keys["KeyD"]) {
    dx += 1;
  }
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    dx += -1;
  }
  obj.moveX(dx);
}

function gameInit() {
  cameraPos.set(0, 10);
  obj.size = vec2(3, 3);
}

function gameUpdate() {
  obj.update();
  obj.tileInfo = animationManager.getInfo("spincasters").tileInfos[0];
  otherPlayers.forEach((player) => {
    player.update();
    player.tileInfo = animationManager.getInfo("ogre").tileInfos[0];
  });
}

function postUpdate() {
}

function render() {

}

function renderPost() {
  obj.render();
  otherPlayers.forEach((player) => {
    player.render();
  });
}

const imageSources: string[] = [
  "assets/spincasters.png",
];

engineInit(
  gameInit,
  gameUpdate,
  postUpdate,
  render,
  renderPost,
  imageSources,
)
