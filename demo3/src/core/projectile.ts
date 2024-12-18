import { EngineObject, Vector2 } from "../lib/littlejs";

export class Projectile extends EngineObject {
  constructor(start: Vector2, readonly target: Vector2, readonly speed: number) {
    super();
    this.pos.set(start.x, start.y);
    this.size.set(.5, .5);
    this.renderOrder = 10000000;
  }

  move() {
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.speed) {
      this.pos.set(this.target.x, this.target.y);
      return true;
    }
    this.pos.set(this.pos.x + dx / dist * this.speed, this.pos.y + dy / dist * this.speed);
    this.angle += .2;
  }

  landed() {
    return this.pos.x === this.target.x && this.pos.y === this.target.y;
  }
}
