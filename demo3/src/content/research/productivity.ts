import type { Research } from "../../definition/research";
import { WOOD_ANIMATION } from "../animations/resources";

export const PRODUCTIVITY_RESEARCH: Research = {
  name: "productivity",
  description: "Each settlement will produces one unit of production.",
  icon: WOOD_ANIMATION,
  dependency: [],
  cost: 5,
  recommended: 0,
};
