import type { Research } from "../../definition/research";
import { GOAT_ANIMATION } from "../animations/goat";

export const GOAT_RESEARCH: Research = {
  name: "goat",
  description: "Goats can climb mountains.",
  icon: GOAT_ANIMATION,
  dependency: ["oviculture"],
  cost: 20,
  recommended: 5,
  forceInDebug: true,
};
