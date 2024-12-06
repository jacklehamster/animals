import type { Animation } from "./animation";
import type { Elem } from "./elem";
import type { Menu } from "./menu";

export interface Scene {
  scale?: number;
  definitions: Elem[];
  elems: Elem[];
  animations: Animation[];
  layers?: Record<string, number>;
  colayers?: Record<string, number>;
  menu?: Menu[];
}
