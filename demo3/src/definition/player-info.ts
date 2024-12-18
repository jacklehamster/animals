import type { Resources } from "./resources";


export interface PlayerInfo {
  resources: Resources;
  tax?: number;
  ai?: boolean;
  research?: Record<string, number>;
  currentResearch?: string;
}
