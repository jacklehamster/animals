import type { Elem } from "./elem";


export type Action = {
  deselect?: boolean;
  create?: Elem;
  harvest?: boolean;
  stopHarvest?: boolean;
  destroy?: boolean;
  [key: string]: any;
};
