import type { GameObject } from "../game-object";
import type { GameWorld } from "../game-world";
import type { Element } from "../type/element";

export type Processor = {
  priority: Priority;
  init?: (element: Element, gameWorld: GameWorld) => void;
  process?: (
    element: Element,
    gameWorld: GameWorld,
    gameObjs: GameObject[]) => void;
  update?: (
    element: Element,
    gameWorld: GameWorld,
    gameObjs: GameObject[]) => void;
  postUpdate?: (
    element: Element,
    gameWorld: GameWorld,
    gameObjs: GameObject[]) => void;
  refreshHud?: (
    element: Element,
    gameWorld: GameWorld,
  ) => void;
  destroy?: (
    gameWorld: GameWorld,
    gameObjs: GameObject[]) => void;
  action?: (
    action: Record<string, unknown>,
    gameWorld: GameWorld,
    gameObjs: GameObject[],
  ) => void;
}

export enum Priority {
  Creation = 0,
  Process = 1,
  Hud = 2,
}
