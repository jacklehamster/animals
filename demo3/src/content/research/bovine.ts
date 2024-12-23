import type { Research } from "../../definition/research";
import { COW_ANIMATION, COW_WAIT_ANIMATION } from "../animations/cow";

export const BOVINE_RESEARCH: Research = {
  name: "bovine",
  description: "Cows are your workers.\nUse them to harvest resources.",
  icon: COW_ANIMATION,
  waitIcon: COW_WAIT_ANIMATION,
  dependency: [],
  cost: 5,
  recommended: 1,
  adviseAfterResearch: {
    name: "move-units",
    message: "You are now able to spawn units.\nClick on the settlement, and click to spawn a unit and move it around the world.\nIf you have enough resources, you can spawn more units.",
  },
  resourceReward: {
    wood: 5,
  },
};
