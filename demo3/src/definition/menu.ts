import type { Elem } from "./elem";

export interface Condition {
  levelBelowEqual?: [number, string];
  occupied?: [string, string];
}

export type Action = {
  deselect?: boolean;
  create?: Elem;
  [key: string]: any;
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
}

export interface Menu {
  name: string;
  icon: {
    imageSource: string;
    spriteSize: [number, number];
    padding?: [number, number];
    frames: number[];
  };
  items: MenuItem[];
}
