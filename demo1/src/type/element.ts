export interface Element {
  name?: string;
  world?: {
    pos?: [number, number];
    size?: [number, number];
    tileSize?: [number, number];
    color?: string;
    grid?: [number, number];
    animation?: {
      name?: string;
      texture: string;
      spriteSize: [number, number];
      frames?: number;
      startFrame?: number;
    }[],
    mouseFollow?: {
      offset?: [number, number];
      snap?: [number, number];
    };
  };
  data?: {
    nextOnClick?: boolean;
    moveOnClick?: boolean;
    reveal?: number;
    [key: string]: any;
  },
  camera?: {
    scale?: number;
    pos?: [number, number];
  };
  hud?: {
    label: string;
    pos: [number, number];
    size: number;
  };
}
