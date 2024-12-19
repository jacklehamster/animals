import type { Research } from "../../definition/research";
import { BULL_ANIMATION, BULL_WAIT_ANIMATION } from "../animations/bull";

export const TAUROLOGY_RESEARCH: Research = {
  name: "taurology",
  description: "Bulls are strong fighters.",
  icon: BULL_ANIMATION,
  waitIcon: BULL_WAIT_ANIMATION,
  dependency: ["bovine"],
  cost: 40,
  recommended: 7,
  forceInDebug: true,
};
