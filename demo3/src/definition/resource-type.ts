import type { MenuIcon } from "./menu";

export type ResourceType = {
  icon: MenuIcon;
  global?: boolean;
  hidden?: boolean;
  forGrowth?: boolean;
};
