import { EngineObject, vec2, Vector2 } from "../../lib/littlejs";

export class DecorObject extends EngineObject {
  initialPos: Vector2;
  bornTime: number;
  doomTime?: number;
  motionX: number = Math.random();
  motionY: number = Math.random();
  constructor(parent: EngineObject, x: number, y: number) {
    super();

    parent.addChild(this, vec2(x, y));
    this.initialPos = vec2(x, y);
    this.bornTime = Date.now() - Math.random() * 100000;
  }
}
