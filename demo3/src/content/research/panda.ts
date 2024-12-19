import type { Research } from "../../definition/research";
import { PANDA_ANIMATION, PANDA_WAIT_ANIMATION } from "../animations/panda";

export const PANDA_RESEARCH: Research = {
  name: "panda",
  description: "Pandas are strong fighters.",
  icon: PANDA_ANIMATION,
  waitIcon: PANDA_WAIT_ANIMATION,
  dependency: ["squirrel"],
  cost: 40,
  recommended: 6,
};
