import type { Research } from "../../definition/research";
import { VILLAGE_ANIMATION } from "../animations/house";

export const VILLAGE_RESEARCH: Research = {
  name: "village",
  description: "Your settlements can turn into a village, growing beyond level 6.",
  icon: VILLAGE_ANIMATION,
  dependency: ["oviculture"],
  cost: 30,
  recommended: 5,
  forceInDebug: true,
  adviseAfterResearch: {
    name: "exploration-research",
    message: "Great discovery! I advise you to research exploration when you have the chance.\nThis will then unlock 'spaceship' which will allow you to leave this planet.",
  },
};
