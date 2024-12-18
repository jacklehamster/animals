import type { Research } from "../../definition/research";
import { BEAVER_ANIMATION, BEAVER_WAIT_ANIMATION } from "../animations/beaver";

export const BEAVER_RESEARCH: Research = {
  name: "beaver",
  description: "Beavers can build dams to turn rivers into lakes.",
  icon: BEAVER_ANIMATION,
  waitIcon: BEAVER_WAIT_ANIMATION,
  dependency: ["squirrel"],
  cost: 30,
};
