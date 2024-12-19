import type { Research } from "../../definition/research";
import { SQUIRREL_ANIMATION, SQUIRREL_WAIT_ANIMATION } from "../animations/squirrel";

export const SQUIRREL_RESEARCH: Research = {
  name: "nutology",
  description: "Squirrels can climb trees and throw nuts.",
  icon: SQUIRREL_ANIMATION,
  waitIcon: SQUIRREL_WAIT_ANIMATION,
  dependency: [],
  cost: 20,
  recommended: 4,
};
