import type { Research } from "../../definition/research";
import { HOUSE_EXPAND_ANIMATION } from "../animations/house";

export const EXPANSION_RESEARCH: Research = {
  name: "expansion",
  description: "Settlements have a larger area for harvesting resources.",
  icon: HOUSE_EXPAND_ANIMATION,
  dependency: ["oviculture"],
  cost: 20,
  recommended: 5,
  action: {
    updateHouseCloud: true,
  },
  // forceInDebug: true,
};
