import type { Animation } from "./animation";
import type { Elem } from "./elem";

export interface Scene {
  scale?: number;
  elems: Elem[];
  animations: Animation[];
  layers?: string[];
}
