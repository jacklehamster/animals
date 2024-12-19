import type { Research } from "../../definition/research";
import { TURTLE_ANIMATION, TURTLE_WAIT_ANIMATION } from "../animations/turtle";

export const TORTOISE_RESEARCH: Research = {
  name: "tortoise",
  description: "Turtles can carry others on water, and have high defense.",
  icon: TURTLE_ANIMATION,
  waitIcon: TURTLE_WAIT_ANIMATION,
  dependency: [],
  cost: 20,
  recommended: 5,
  // forceInDebug: true,
};
