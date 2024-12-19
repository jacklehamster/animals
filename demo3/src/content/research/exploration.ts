import type { Research } from "../../definition/research";
import { GLOBE_ANIMATION } from "../animations/globe";

export const EXPLORATION: Research = {
  name: "exploration",
  description: "Exploration lets you view the entire map.",
  icon: GLOBE_ANIMATION,
  dependency: ["village"],// ["eagle"],
  cost: 100,
  recommended: 10,
  action: {
    clearFogOfWar: true,
  },
  // forceInDebug: true,
};
