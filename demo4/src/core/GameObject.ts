import type { SocketClient } from "napl";
import { EngineObject, vec2, Vector2 } from "../lib/littlejs";

const EDGES = [-25, 25];

const GROUND = 0;

export class GameObject extends EngineObject {
  mov: Vector2 = vec2(0, 0);
  acc: Vector2 = vec2(0, -.01);
  grounded = false;
  spins = 1;
  desiredMove = 0;
  goalPos = vec2(0, 0);

  constructor(readonly socketClient: SocketClient, public isPlayer: boolean, readonly data: Record<string, any> = {}) {
    super();
    this.angleDamping = 0.99;
    this.size = vec2(3, 3);
  }

  refreshFromSocket() {
    if (!this.data.pos) {
      return;
    }
    if (this.data.pos.x !== this.goalPos.x || this.data.pos.y !== this.goalPos.y) {
      this.goalPos.set(this.data.pos.x, this.data.pos.y);
    }
    this.pos.x += (this.goalPos.x - this.pos.x) * .1;
    this.pos.y += (this.goalPos.y - this.pos.y) * .1;
    this.size.x = this.data.size?.x || this.size.x;
    this.size.y = this.data.size?.y || this.size.y;
  }

  shareUpdate() {
    if (!this.isPlayer) {
      return;
    }
    const selfState = this.socketClient.self.state;
    if (selfState.pos?.x !== this.pos.x || selfState.pos?.y !== this.pos.y) {
      this.socketClient.self.setData("pos", this.pos);
    }
    if (selfState.size?.x !== this.size.x || selfState.size?.y !== this.size.y) {
      this.socketClient.self.setData("size", this.size);
    }
  }

  spin() {
    if (this.spins) {
      this.angleVelocity = this.size.x < 0 ? -.5 : .5;
      this.mov.y = 0;
      this.acc.y = 0;
      this.mov.x = Math.sign(this.size.x) * .5;
      this.spins--;
      this.pos.y = Math.max(this.pos.y, GROUND + 1);
      this.grounded = false;
      this.shareUpdate();
    }
  }

  jump() {
    //    if (this.spins) {
    this.mov.y = -1;
    this.shareUpdate();
    if (!this.grounded) {
      return;
      // this.spin();
      // this.mov.y -= .2;
      // this.spins--;
    }
    //    }
  }

  moveX(val: number) {
    if (this.angleVelocity) {
      return;
    }
    if (this.size.x * val < 0) {
      this.size.x *= -1;
    }
    this.desiredMove = val;
    if (this.grounded) {
      if (this.mov.x !== val * .1) {
        this.mov.x = val * .1;
        this.shareUpdate();
      }
    }
  }

  update() {
    super.update();
    if (!this.isPlayer) {
      this.refreshFromSocket();
      return;
    }
    this.mov = this.mov.add(vec2(this.acc.x, this.mov.y < 0 ? this.acc.y * 2 : this.acc.y));
    this.pos = this.pos.add(vec2(this.mov.x * (this.angleVelocity ? 1.5 : 1), this.mov.y));
    this.mov.multiply(vec2(.99, .99));
    if (this.pos.y < GROUND) {
      this.pos.y = GROUND;
      this.mov.y = Math.abs(this.mov.y * .4);
      if (this.mov.y < .4) {
        this.angleVelocity = 0;
        this.angle = 0;
        this.grounded = true;
        this.spins = 1;
        this.mov.x = this.desiredMove * .1;
      } else {
        this.grounded = false;
      }
    }
    if (this.pos.x < EDGES[0]) {
      this.pos.x = EDGES[0];
      this.mov.x = Math.abs(this.mov.x * .1);
      if (!this.grounded) {
        this.mov.y = .3;
        this.acc.y = -.01;
      }
      //      this.size.x *= -1;
    } else if (this.pos.x > EDGES[1]) {
      this.pos.x = EDGES[1];
      this.mov.x = -Math.abs(this.mov.x * .1);
      if (!this.grounded) {
        this.mov.y = .3;
        this.acc.y = -.01;
      }
      //      this.size.x *= -1;
    }
    this.shareUpdate();
  }
}
