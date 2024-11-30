import { EngineObject, TileInfo, vec2, Vector2 } from "littlejsengine";

export class GameObject extends EngineObject {
  tileInfos: TileInfo[] = [];
  mouseFollow?: [number, number];
  mouseFollowSnap?: [number, number];
  animations: Record<string, {
    textureIndex: number;
    spriteSize: Vector2;
    numFrames: number;
    startFrame: number;
  }> = {};
  tileSize: Vector2 = vec2(1, 1);
  gridPos: Vector2 = vec2(0, 0);
  moveable?: boolean;

  registerAnimation(name: string | undefined, index: number, textureIndex: number, spriteSize: Vector2, numFrames: number, startFrame: number) {
    const animation = this.animations[index.toString()] = { textureIndex, spriteSize, numFrames, startFrame };
    if (name) {
      this.animations[name] = animation;
    }
  }

  configureAnimation(textureIndex: number, spriteSize: Vector2, numFrames: number, startFrame: number) {
    this.tileInfos.length = 0;
    for (let i = 0; i < numFrames; i++) {
      this.tileInfos.push(new TileInfo(undefined, spriteSize, textureIndex).frame(i + startFrame));
    }
    this.tileInfo = this.tileInfos[0];
  }

  setAnimation(name: string | number) {
    const anim = this.animations[name.toString()];
    if (anim) {
      this.configureAnimation(anim.textureIndex, anim.spriteSize, anim.numFrames, anim.startFrame);
    }
  }

  moveTo(gPos: Vector2) {
    this.gridPos.set(gPos.x, gPos.y);
  }

  update(): void {
    super.update();
    if (!this.moveable) {
      return;
    }
    const gPos = this.gridPos;
    const dx = gPos.x * this.tileSize.x - this.pos.x;
    const dy = gPos.y * this.tileSize.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      this.pos.set(gPos.x * this.tileSize.x, gPos.y * this.tileSize.y);
    } else {
      this.pos.set(this.pos.x + dx / dist / 10, this.pos.y + dy / dist / 10);
    }
  }
}
