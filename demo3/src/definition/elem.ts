export interface Elem {
  lastUpdate?: number;
  name?: string;
  type?: string;
  group?: {
    grid?: [number, number];
    chance?: number;
  };
  gameObject?: {
    pos: [number, number];
    size?: [number, number];
    hidden?: boolean;
    color?: string;
    speed?: number;
    rotation?: number;
  };
  spread?: {
    animation: string;
    count: [number, number];
    radius?: number;
    behind?: boolean;
  };
  branchOut?: {
    animation: string;
    count: [number, number];
    chance?: number;
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
      scale?: number;
    }
  };
  shadow?: {
    animation: string;
  };
  mouseFollower?: {
    offset?: [number, number];
    snap?: number;
  };
  dynamic?: boolean;
  clearCloud?: boolean;
}
