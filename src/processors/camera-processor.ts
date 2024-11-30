import { setCameraPos, setCameraScale, vec2 } from "littlejsengine";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";
import { Priority, type Processor } from "./processor";

export class CameraProcessor implements Processor {
  priority: Priority = Priority.Process;
  init(element: Element, _gameWorld: GameWorld): void {
    if (element.camera) {
      if (element.camera.scale) {
        setCameraScale(element.camera.scale);
      }
      if (element.camera.pos) {
        setCameraPos(vec2(element.camera.pos[0], element.camera.pos[1]));
      }
    }
  }
}
