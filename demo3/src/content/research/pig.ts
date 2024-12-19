import type { Research } from "../../definition/research";
import { PIG_ANIMATION, PIG_WAIT_ANIMATION } from "../animations/pig";

export const PIG_RESEARCH: Research = {
  name: "pig",
  description: "Pigs are just pigs.",
  icon: PIG_ANIMATION,
  waitIcon: PIG_WAIT_ANIMATION,
  dependency: ["bovine"],
  cost: 20,
  recommended: 5,
};
