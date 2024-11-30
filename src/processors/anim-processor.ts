import { vec2 } from "littlejsengine";
import type { GameObject } from "../game-object";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";
import { Priority, type Processor } from "./processor";

export class AnimProcessor implements Processor {
  priority = Priority.Process;
  init(element: Element, gameWorld: GameWorld) {
    if (element.world?.animation) {
      element.world.animation.forEach((anim) => {
        const texture = anim.texture;
        if (!gameWorld.textures.includes(texture)) {
          gameWorld.textures.push(texture);
        }
      });
    }
  }

  process(
    element: Element,
    gameWorld: GameWorld,
    gameObjs: GameObject[]) {

    gameObjs.forEach((obj) => {
      if (element.world?.animation) {
        element.world.animation.forEach((anim, index) => {
          const texture = anim.texture;
          if (!gameWorld.textures.includes(texture)) {
            gameWorld.textures.push(texture);
          }
          const textureIndex = gameWorld.textures.indexOf(texture);
          obj.registerAnimation(anim.name, index, textureIndex, vec2(anim.spriteSize[0], anim.spriteSize[1]), anim.frames ?? 1, anim.startFrame ?? 0);
        });
        obj.setAnimation(0);
      }
    });
  }
  update(_element: Element, _gameWorld: GameWorld, gameObjs: GameObject[]) {
    gameObjs.forEach((obj) => {
      if (obj.tileInfos.length) {
        const index = Math.floor(Date.now() / 100) % obj.tileInfos.length;
        obj.tileInfo = obj.tileInfos[index];
      }
    });
  }
  destroy(gameWorld: GameWorld, gameObjs: GameObject[]) {
    gameObjs.forEach((obj) => {
      obj.tileInfos.length = 0;
    });
    gameWorld.textures.length = 0;
  }
}
