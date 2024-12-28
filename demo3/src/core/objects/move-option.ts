import type { AnimationInfo } from "../../animation/animation-manager";
import { Vector2 } from "../../lib/littlejs";
import { BaseObject } from "./base-object";

export class MoveOption extends BaseObject {
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
