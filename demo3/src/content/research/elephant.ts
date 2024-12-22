import type { Research } from "../../definition/research";
import { ELEPHANT_ANIMATION, ELEPHANT_WAIT_ANIMATION } from "../animations/elephant";

export const ELEPHANT_RESEARCH: Research = {
  name: "elephant",
  description: "Elephants can trample enemies.",
  icon: ELEPHANT_ANIMATION,
  waitIcon: ELEPHANT_WAIT_ANIMATION,
  dependency: ["pig"],
  cost: 80,
  recommended: 8,
};
