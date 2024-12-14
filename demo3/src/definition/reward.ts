import type { Elem } from "./elem";

export interface Reward {
  gold?: [number, number];
  invention?: number;
  unit?: Elem;
  spawnFoes?: {
    count: [number, number];
    element: Elem;
  };
}
