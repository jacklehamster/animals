import type { Action } from "./action";
import type { Anim } from "./animation";
import type { Condition } from "./condition";
import type { Resources } from "./resources";

export type MenuIcon = Anim;

export interface MenuItem {
  name: string;
  imageSource?: string;
  spriteSize: [number, number];
  padding?: [number, number];
  frames: number[];
  label?: string;
  actions: Action[];
  disabled?: Condition;
  hidden?: Condition;
  resourceCost?: Resources;
  researchNeeded?: string[];
  debug?: boolean;
}

export interface Menu {
  name: string;
  description?: string;
  icon: Anim;
  items: MenuItem[];
}
