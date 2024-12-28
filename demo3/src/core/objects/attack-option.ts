import type { AnimationInfo } from "../../animation/animation-manager";
import { BaseObject } from "./base-object";

export class AttackOption extends BaseObject {
  animation?: AnimationInfo;
  constructor(
    readonly px: number,
    readonly py: number,
  ) {
    super();

  }

}
