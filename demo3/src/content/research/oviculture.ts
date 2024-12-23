import type { Research } from "../../definition/research";
import { SHEEP_ANIMATION, SHEEP_WAIT_ANIMATION } from "../animations/sheep";

export const OVICULTURE_RESEARCH: Research = {
  name: "oviculture",
  description: "You can spawn more sheeps, which build settlements.",
  icon: SHEEP_ANIMATION,
  waitIcon: SHEEP_WAIT_ANIMATION,
  dependency: [],
  cost: 10,
  recommended: 3,
  adviseAfterResearch: {
    name: "move-units",
    message: "You are now able to spawn units.\nClick on the settlement, and click to spawn a unit and move it around the world.\nOnce you have enough resources, you can spawn more units.",
  },
  resourceReward: {
    wood: 10,
  }
};
