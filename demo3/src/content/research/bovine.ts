import type { Research } from "../../definition/research";
import { COW_ANIMATION, COW_WAIT_ANIMATION } from "../animations/cow";

export const BOVINE_RESEARCH: Research = {
  name: "bovine",
  description: "Cows are your workers.\nUse them to harvest resources.",
  icon: COW_ANIMATION,
  waitIcon: COW_WAIT_ANIMATION,
  dependency: [],
  cost: 10,
  recommended: 1,
};
