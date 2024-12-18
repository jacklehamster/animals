import type { Anim } from "./animation";
import type { Elem } from "./elem";
import type { Menu } from "./menu";
import type { PlayerInfo } from "./player-info";
import type { Research } from "./research";
import type { ResourceType } from "./resource-type";
import type { Resources } from "./resources";


export interface Scene {
  scale?: number;
  definitions: Elem[];
  elems: Elem[];
  animations: Anim[];
  layers: Record<string, number>;
  colayers?: Record<string, number>;
  menu?: Menu[];
  turn: {
    player: number;
    turn: number;
  };
  players: PlayerInfo[];
  resources: {
    [key in keyof Resources]: ResourceType;
  };
  research: Research[];
  clearFogOfWar?: boolean;
}
