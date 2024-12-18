import type { AnimationInfo } from "../../animation/animation-manager";
import { EngineObject } from "../../lib/littlejs";

export class AttackOption extends EngineObject {
  animation?: AnimationInfo;
  constructor(
    readonly px: number,
    readonly py: number,
  ) {
    super();

  }

}
