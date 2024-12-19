import type { Anim } from "./animation";

export interface Research {
  name: string;
  description?: string;
  icon: Anim;
  waitIcon?: Anim;
  dependency: string[];
  cost: number;
  recommended?: number;
  forceInDebug?: boolean;
}
