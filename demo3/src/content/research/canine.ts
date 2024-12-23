import type { Research } from "../../definition/research";
import { DOG_ANIMATION, DOG_WAIT_ANIMATION } from "../animations/dog";

export const CANINE_RESEARCH: Research = {
  name: "canine",
  description: "Dogs are your scouts.\nUse them to explore the world.",
  icon: DOG_ANIMATION,
  waitIcon: DOG_WAIT_ANIMATION,
  dependency: [],
  cost: 5,
  recommended: 2,
  adviseAfterResearch: {
    name: "move-units",
    message: "You are now able to spawn units.\nClick on the settlement, and click to spawn a unit and move it around the world.\nIf you have enough resources, you can spawn more units.",
  },
  resourceReward: {
    wood: 10,
  }
};
