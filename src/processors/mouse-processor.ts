import { mousePos } from "littlejsengine";
import type { GameObject } from "../game-object";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";
import { type Processor, Priority } from "./processor";

export class MouseProcessor implements Processor {
  priority = Priority.Process;
  process(
    element: Element,
    _gameWorld: GameWorld,
    gameObjs: GameObject[]) {

    const offset = element.world?.mouseFollow?.offset ?? [0, 0];
    const snap = element.world?.mouseFollow?.snap;
    gameObjs.forEach((obj) => {
      if (element.world?.mouseFollow) {
        obj.mouseFollow = offset;
        obj.mouseFollowSnap = snap;
      }
    });
    return gameObjs;
  }
  update(_element: Element, _gameWorld: GameWorld, gameObjs: GameObject[]) {
    gameObjs.forEach((obj) => {
      if (obj.mouseFollow) {
        let px = (mousePos.x + obj.mouseFollow[0]);
        let py = (mousePos.y + obj.mouseFollow[1]);
        if (obj.mouseFollowSnap?.[0]) {
          px = Math.round(px / obj.mouseFollowSnap[0]) * obj.mouseFollowSnap[0];
        }
        if (obj.mouseFollowSnap?.[1]) {
          py = Math.round(py / obj.mouseFollowSnap[1]) * obj.mouseFollowSnap[1];
        }
        obj.pos.set(px, py);
      }
    });
  }
}
