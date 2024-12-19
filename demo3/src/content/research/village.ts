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
};
