import type { Action } from "./action";
import type { Condition } from "./condition";
import type { Resources } from "./resources";

export interface MenuIcon {
  imageSource: string;
  spriteSize: [number, number];
  padding?: [number, number];
  frames: number[];
}

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
}

export interface Menu {
  name: string;
  description?: string;
  icon: {
    imageSource: string;
    spriteSize: [number, number];
    padding?: [number, number];
    frames: number[];
  };
  items: MenuItem[];
}
