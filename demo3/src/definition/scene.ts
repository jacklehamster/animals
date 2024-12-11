import type { Animation } from "./animation";
import type { Elem } from "./elem";
import type { Menu, MenuIcon } from "./menu";
import type { Resources } from "./resources";

export interface Scene {
  scale?: number;
  definitions: Elem[];
  elems: Elem[];
  animations: Animation[];
  layers: Record<string, number>;
  colayers?: Record<string, number>;
  menu?: Menu[];
  turn?: {
    player: number;
    turn: number;
  };
  players: {
    resources: Resources;
    tax?: number;
  }[];
  resources: {
    [key: string]: {
      icon: MenuIcon;
      global?: boolean;
      hidden?: boolean;
    };
  }
}
