export interface Anim {
  name: string;
  imageSource?: string;
  spriteSize?: [number, number];
  mul?: number;
  frames?: number[];
  children?: string[];
  airFrames?: number[];
  once?: boolean;
}
