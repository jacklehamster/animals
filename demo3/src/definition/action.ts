import type { Elem } from "./elem";


export type Action = {
  deselect?: boolean;
  create?: Elem;
  harvest?: boolean;
  stopHarvest?: boolean;
  selfDestroy?: boolean;
  destroy?: string;
  level?: number;
  clearMoves?: boolean;
  clearFogOfWar?: boolean;
  updateHouseCloud?: boolean;
  spaceship?: boolean;
  heal?: number;
};
