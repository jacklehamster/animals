
export interface Condition {
  levelBelowEqual?: [number, string];
  occupied?: [string, string];
  proximity?: [string, string];
  nonProximity?: [string, string];
  harvesting?: boolean;
  notHarvesting?: boolean;
  cannotAct?: [boolean, string];
  unitLimit?: [string, string];
}
