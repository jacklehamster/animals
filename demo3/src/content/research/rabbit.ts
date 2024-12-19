import type { Research } from "../../definition/research";
import { RABBIT_ANIMATION, RABBIT_WAIT_ANIMATION } from "../animations/rabbit";

export const RABBIT_RESEARCH: Research = {
  name: "rabbit",
  description: "Rabbits cast magic spells to heal.",
  icon: RABBIT_ANIMATION,
  waitIcon: RABBIT_WAIT_ANIMATION,
  dependency: ["beaver"],
  cost: 40,
  recommended: 7,
};
