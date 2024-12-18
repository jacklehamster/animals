import type { Research } from "../../definition/research";
import { SHEEP_ANIMATION, SHEEP_WAIT_ANIMATION } from "../animations/sheep";

export const OVICULTURE_RESEARCH: Research = {
  name: "oviculture",
  description: "You can spawn more sheeps, which build settlements.",
  icon: SHEEP_ANIMATION,
  waitIcon: SHEEP_WAIT_ANIMATION,
  dependency: [],
  cost: 10,
};
