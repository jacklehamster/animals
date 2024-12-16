import type { AI } from "./ai";
import type { Attack } from "./attack";
import type { Condition } from "./condition";
import type { Resources } from "./resources";
import type { Reward } from "./reward";

interface TileCondition {
  tile?: string | string[];
  noTile?: string | string[];
  zeroUnit?: boolean;
}

export interface Elem {
  definition?: string;
  lastUpdate?: number;
  name?: string;
  type?: string;
  level?: number;
  hitpoints?: number;
  maxHitPoints?: number;
  turn?: {
    moves: number;
    attacks: number;
    actions?: number;
  };
  owner?: number;
  home?: [number, number];
  group?: {
    grid?: [number, number];
    chance?: number;
  };
  condition?: TileCondition;
  gameObject?: {
    pos?: [number, number];
    offset?: [number, number];
    size?: [number, number];
    hidden?: boolean;
    color?: string;
    speed?: number;
    rotation?: number;
    noRotation?: boolean;
    lastDx?: number;
  };
  spread?: {
    animation: string;
    count: [number, number];
    radius?: number;
    behind?: boolean;
    color?: string;
    size?: number;
    moving?: boolean;
  };
  branchOut?: {
    count: [number, number];
    chance?: number;
    color?: string;
    element: Elem;
  };
  animation?: {
    name: string;
    loop?: number;
  };
  onHover?: {
    animation?: string;
    hideCursor?: boolean;
    indic?: {
      animation: string;
      scale?: number;
    }
  };
  selected?: {
    animation?: string;
    indic?: {
      animation: string;
      scale?: number;
    };
    moveIndic?: {
      animation: string;
      selectedAnimation: string;
      scale?: number;
    }
  };
  move?: {
    animation: string;
    distance?: number;
    disabled?: Condition;
  };
  harvest?: {
    animation: string;
  };
  shadow?: {
    animation: string;
  };
  mouseFollower?: {
    offset?: [number, number];
    snap?: number;
  };
  worker?: boolean;
  settler?: boolean;
  resourcesProduced?: Resources;
  resourcesAccumulated?: Resources;
  resourcesCapped?: {
    [key in keyof Resources]?: number;
  };
  rewards?: Reward[];
  dynamic?: boolean;
  clearCloud?: boolean;
  water?: boolean;
  harvesting?: boolean;
  building?: boolean;
  closeToHome?: boolean;
  endlessMove?: boolean;
  selfSelect?: boolean;
  savage?: boolean;
  ai?: AI;
  attack?: Attack;
  defenseBonus?: number;
}
