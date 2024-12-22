import type { Research } from "../../definition/research";
import { SPACESHIP_ANIMATION } from "../animations/spaceship";

export const SPACESHIP_RESEARCH: Research = {
  name: "spaceship",
  description: "Build a spaceship to leave this planet.",
  icon: SPACESHIP_ANIMATION,
  dependency: ["exploration"],
  cost: 200,
  recommended: 20,
  // forceInDebug: true,
};
