import type { Action } from "./action";
import type { Condition } from "./condition";

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
