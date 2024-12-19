import type { Research } from "../../definition/research";
import { DOG_ANIMATION, DOG_WAIT_ANIMATION } from "../animations/dog";

export const CANINE_RESEARCH: Research = {
  name: "canine",
  description: "Dogs are your scouts.\nUse them to explore the world.",
  icon: DOG_ANIMATION,
  waitIcon: DOG_WAIT_ANIMATION,
  dependency: [],
  cost: 10,
  recommended: 2,
};
