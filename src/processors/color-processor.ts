import { randColor } from "littlejsengine";
import type { GameObject } from "../game-object";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";
import { Priority, type Processor } from "./processor";

export class ColorProcessor implements Processor {
  priority = Priority.Process;
  process(
    element: Element,
    _gameWorld: GameWorld,
    gameObjs: GameObject[]) {

    gameObjs.forEach((obj) => {
      if (element.world?.color === "random") {
        obj.color = randColor();
      }
    });
    return gameObjs;
  }
}
