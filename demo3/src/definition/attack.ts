export interface Attack {
  animation?: string;
  range?: number;
  damage?: number;
  defense?: number;
  attackAfterMove?: boolean;
  attackAfterAttack?: boolean;
  moveAfterAttack?: boolean;
  disabled?: boolean;
  projectile?: string;
}
