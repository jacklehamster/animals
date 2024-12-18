import type { AnimationInfo } from "../../animation/animation-manager";
import { EngineObject, Vector2 } from "../../lib/littlejs";

export class MoveOption extends EngineObject {
  animation?: AnimationInfo;
  constructor(
    readonly px: number,
    readonly py: number,
    public from: Vector2,
    public canReveal: number,
    public movePoints: number,
    public distanceTravelled: number,
    readonly canLand: boolean,
  ) {
    super();
  }
}
