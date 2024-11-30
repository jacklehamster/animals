import { drawTextScreen, vec2, mainCanvasSize } from "littlejsengine";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";
import { Priority, type Processor } from "./processor";

export class HudProcessor implements Processor {
  priority = Priority.Hud;

  refreshHud(element: Element, gameWorld: GameWorld): void {
    if (element.hud) {
      drawTextScreen(element.hud.label, vec2(element.hud.pos[0] * mainCanvasSize.x, element.hud.pos[1] * mainCanvasSize.y), element.hud.size);
    }
  }
}
