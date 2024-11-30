import { mousePos, mouseWasPressed, vec2 } from "littlejsengine";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";
import { Priority, type Processor } from "./processor";
import type { GameObject } from "../game-object";

export class DataProcessor implements Processor {
  priority: Priority = Priority.Hud;

  update(element: Element, gameWorld: GameWorld, gameObjs: GameObject[]): void {
    if (element.data?.nextOnClick) {
      if (mouseWasPressed(0)) {
        gameWorld.changeScene?.(index => index + 1);
      }
    }
    if (element.data?.moveOnClick) {
      if (mouseWasPressed(0)) {
        let px = Math.round(mousePos.x / 2);
        let py = Math.round(mousePos.y / 2);

        gameObjs.forEach(obj => {
          obj.moveTo(vec2(px, py));
        });
      }
    }
  }
}
