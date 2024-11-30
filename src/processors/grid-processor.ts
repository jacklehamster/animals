import { vec2 } from "littlejsengine";
import { GameObject } from "../game-object";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";
import { Priority, type Processor } from "./processor";

export class GridProcessor implements Processor {
  priority = Priority.Creation;
  process(
    element: Element,
    _gameWorld: GameWorld,
    gameObjs: GameObject[]) {

    const grid = element.world?.grid ?? (!element.world ? [0, 0] : [1, 1]);
    const size = element.world?.size ?? [1, 1];
    const tileSize = element.world?.tileSize ?? element.world?.size ?? [1, 1];
    for (let y = grid[1] - 1; y >= 0; y--)
      for (let x = 0; x < grid[0]; x++) {
        const posX = x + (element.world?.pos?.[0] ?? 0);
        const posY = y + (element.world?.pos?.[1] ?? 0);
        const obj = new GameObject(vec2(posX * tileSize[0], posY * tileSize[1]), vec2(size[0], size[1]));
        obj.tileSize = vec2(tileSize[0], tileSize[1]);
        obj.gridPos.set(x, y);
        gameObjs.push(obj);
      }
    return gameObjs;
  }
  destroy(_gameWorld: GameWorld, gameObjs: GameObject[]) {
    gameObjs.forEach((obj) => {
      obj.destroy();
    });
    gameObjs.length = 0;
  }
}
