import type { Element } from "./element";
import type { HudElement } from "./hud-element";

export interface World {
  elements?: Element[];
  hud?: HudElement[];
}
