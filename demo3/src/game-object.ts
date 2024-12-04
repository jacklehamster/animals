import { Color, EngineObject, mouseIsDown, mousePos, mouseWasPressed, mouseWasReleased, randColor, TileInfo, vec2, Vector2 } from "littlejsengine";
import type { Elem } from "./definition/elem";
import type { Manager } from "./manager";
import type { AnimationInfo } from "./animation/animation-manager";

export class GameObject extends EngineObject {
  animationInfo?: AnimationInfo;
  hoveredAnimationInfo?: AnimationInfo;
  selectedAnimationInfo?: AnimationInfo;
  shadowAnimationInfo?: AnimationInfo;
  frameRate: number = 60;
  mouseFollower?: { offset: Vector2; snap?: number };
  px: number = 0; py: number = 0;
  type?: string;
  onHoverHideCursor?: boolean;
  visible: boolean = true;
  elem?: Elem;
  hovered: boolean = false;
  decors: EngineObject[] = [];
  shadow?: EngineObject;
  updated?: boolean = false;
  moveOptions?: EngineObject[];
  clearedCloud?: boolean;
  lastDx: number = 1;

  constructor(public manager: Manager, private gridShift: Vector2 = vec2(0, 0)) {
    super();
  }

  refresh(elem: Elem) {
    this.elem = elem;
    const config = elem.gameObject;
    if (config) {
      this.type = elem.type;
      this.visible = !config.hidden;
      if (this.type === "cursor") {
        this.manager.cursor = this;
      }
      const px = this.gridShift.x + config.pos[0];
      const py = this.gridShift.y + config.pos[1];
      this.setPosition(px, py, true);
      this.pos.set(px, py);
      this.size.set(
        this.visible ? config.size?.[0] : 0,
        this.visible ? config.size?.[1] : 0,
      );
      if (config.rotation) {
        this.angle = config.rotation;
      }
      if (config.color) {
        if (config.color === "random") {
          this.color = randColor();
        } else {
          this.color = new Color().setHex(config.color);
        }
      }
      if (elem.animation) {
        this.animationInfo = this.manager.animation.getInfo(elem.animation.name);
      }
      if (elem.onHover) {
        if (elem.onHover.animation) {
          this.hoveredAnimationInfo = this.manager.animation.getInfo(elem.onHover.animation);
        }
        this.onHoverHideCursor = elem.onHover.hideCursor;
      }
      if (elem.selected) {
        if (elem.selected.animation) {
          this.selectedAnimationInfo = this.manager.animation.getInfo(elem.selected.animation);
        }
      }
      if (elem.shadow) {
        if (elem.shadow.animation) {
          this.shadowAnimationInfo = this.manager.animation.getInfo(elem.shadow.animation);
          if (!this.shadow) {
            this.shadow = new EngineObject();
            this.shadow.size.set(this.size.x, this.size.y);
            this.shadow.tileInfo = this.getTileInfoAnimate(this.shadowAnimationInfo);
            this.addChild(this.shadow);
          }
        }
      }
      if (elem.mouseFollower) {
        this.mouseFollower = {
          offset: vec2(elem.mouseFollower.offset?.[0] ?? 0, elem.mouseFollower.offset?.[1] ?? 0),
          snap: elem.mouseFollower.snap,
        };
      }
      if (elem.spread) {
        const { animation, count, radius } = elem.spread;
        const animInfo = this.manager.animation.getInfo(animation);
        const actualCount = count[0] + Math.floor(Math.random() * (count[1] - count[0]));
        for (let i = 0; i < actualCount; i++) {
          const x = Math.random() - 1 / 2;
          const y = Math.random() - 1 / 2;
          if (radius && x * x + y * y > radius * radius) {
            continue;
          }
          const decor = new EngineObject();
          decor.tileInfo = this.getTileInfoAnimate(animInfo);
          this.addChild(decor, vec2(x, y));
          this.decors.push(decor);
        }
        if (elem.branchOut) {
          if (Math.random() <= (elem.branchOut.chance ?? 1)) {
            const { animation, count } = elem.branchOut;
            const actualCount = count[0] + Math.floor(Math.random() * (count[1] - count[0]));
            let pos = vec2(this.pos.x, this.pos.y);
            const directions: [number, number][] = [[-1, 0], [0, -1], [1, 0], [0, 1]];
            let lastDir: [number, number] | undefined;
            for (let i = 0; i < actualCount; i++) {
              const oppositeDirIndex = lastDir ? (directions.indexOf(lastDir) + 2) % 4 : undefined;
              const filteredDirections = directions.filter((_dir, index) => index !== oppositeDirIndex);
              const dir = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
              const rot = Math.atan2(-dir[1], dir[0]);

              this.manager.scene.elems.push({
                name: "river",
                type: "river",
                gameObject: {
                  pos: [pos.x, pos.y],
                  size: [2, 2],
                  rotation: rot,
                },
                animation: {
                  name: animation,
                },
              });
              pos = pos.add(vec2(dir[0], dir[1]));
              lastDir = dir;
            }
          }
        }
      }
    } else {
      if (this.manager.grid[this.getTag()] === this) {
        delete this.manager.grid[this.getTag()];
      }
      this.destroy();
    }
  }

  private getTag() {
    return `${this.type}_${this.px}_${this.py}`;
  }

  setPosition(px: number, py: number, force?: boolean) {
    if (this.px === px && this.py === py && !force) return;
    if (this.manager.grid[this.getTag()] === this) {
      delete this.manager.grid[this.getTag()];
    }
    if (this.px !== px) {
      const config = this.elem?.gameObject;
      this.lastDx = Math.sign(px - this.px);
      this.size.set(
        (this.visible ? (config?.size?.[0] ?? 0) : 0) * this.lastDx,
        this.visible ? (config?.size?.[1] ?? 0) : 0,
      );
    }

    this.px = px;
    this.py = py;

    if (this.manager.grid[this.getTag()] !== this) {
      this.manager.grid[this.getTag()]?.destroy();
      this.manager.grid[this.getTag()] = this;
    }

    if (this.type === "cursor") {
      this.manager.onCursorMove(px, py);
    }
    if (this.type === "cloud") {
      this.manager.revealed.delete(this.getTag());
    }
    this.clearedCloud = false;
    this.updated = false;
  }

  canMove(px: number, py: number) {
    const dx = px - this.px;
    const dy = py - this.py;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      return false;
    }
    if (this.manager.grid[`decor_${px}_${py}`]) {
      return false;
    }
    if (this.manager.grid[`water_${px}_${py}`]) {
      return false
    }
    return true;
  }

  hide() {
    if (this.visible) {
      this.visible = false;
      this.size.set(0, 0);
    }
  }

  show() {
    if (!this.visible) {
      this.visible = true;
      const config = this.elem?.gameObject;
      this.size.set(
        (this.visible ? (config?.size?.[0] ?? 0) : 0) * this.lastDx,
        this.visible ? (config?.size?.[1] ?? 0) : 0,
      );
    }
  }

  hoverIndic?: EngineObject;

  onHoverChange() {
    if (this.manager.shifting) {
      return;
    }
    if (this.onHoverHideCursor) {
      if (this.manager.hovered(this)) {
        this.manager.cursor?.hide();
        if (this.elem?.onHover?.indic && !this.hoverIndic) {
          this.hoverIndic = new EngineObject();
          const scale = this.elem.onHover.indic.scale ?? 1;
          this.hoverIndic.size.set(this.size.x * scale, this.size.y * scale);
          this.hoverIndic.tileInfo = this.manager.animation.getInfo(this.elem.onHover.indic.animation).tileInfos[0];
          this.hoverIndic.pos.set(this.pos.x, this.pos.y);
          this.addChild(this.hoverIndic);
          this.updated = false;
        }
      } else {
        if (this.elem?.onHover?.indic && this.hoverIndic) {
          this.removeChild(this.hoverIndic);
          this.hoverIndic.destroy();
          this.hoverIndic = undefined;
          this.manager.cursor?.show();
        }
      }
    }
  }

  selectIndic?: EngineObject;

  onSelectChange() {
    if (this.manager.selected === this) {
      if (this.elem?.selected?.indic && !this.selectIndic) {
        this.selectIndic = new EngineObject();
        const scale = this.elem.selected.indic.scale ?? 1;
        this.selectIndic.size.set(this.size.x * scale, this.size.y * scale);
        this.selectIndic.renderOrder = this.renderOrder - 1;
        this.selectIndic.tileInfo = this.manager.animation.getInfo(this.elem.selected.indic.animation).tileInfos[0];
        this.selectIndic.pos.set(this.pos.x, this.pos.y);
        this.addChild(this.selectIndic);

        //  show move options
        for (let y = -1; y <= 1; y++) {
          for (let x = -1; x <= 1; x++) {
            this.addMoveOption(x, y);
          }
        }

      }
    } else {
      if (this.elem?.selected?.indic && this.selectIndic) {
        this.selectIndic.destroy();
        this.selectIndic = undefined;
      }
      this.moveOptions?.forEach((moveOption) => moveOption.destroy());
      for (let k in this.manager.moveOptions) {
        delete this.manager.moveOptions[k];
      }
      delete this.moveOptions;
    }
  }

  addMoveOption(x: number, y: number) {
    if (!this.canMove(this.px + x, this.py + y)) {
      return;
    }

    const obj = new EngineObject();
    obj.size.set(this.size.x, this.size.y);
    if (this.elem?.selected?.moveIndic) {
      obj.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.selected.moveIndic.animation));
    } else {
      obj.color = new Color(0, 0, 0, .3);
      obj.tileInfo = this.tileInfo;
    }
    obj.pos.set(this.pos.x, this.pos.y);
    this.addChild(obj, vec2(x, y));
    if (!this.moveOptions) {
      this.moveOptions = [];
    }
    this.moveOptions.push(obj);
    this.manager.moveOptions[`${x}_${y}`] = obj;
    this.updated = false;
  }

  getFrame(animInfo?: AnimationInfo) {
    return !animInfo ? 0 : Math.floor(Date.now() / (1000 / this.frameRate)) % animInfo.tileInfos.length;
  }

  getTileInfoAnimate(animInfo: AnimationInfo) {
    const t = this.getFrame(animInfo);
    return animInfo.tileInfos[t];
  }

  update() {
    super.update();
    if (this.updated && !this.elem?.dynamic && !this.doomed) {
      return;
    }
    const nowHoverered = this.manager.hovered(this);
    if (this.hovered !== nowHoverered) {
      this.hovered = nowHoverered;
      this.onHoverChange();
    }
    if (this.hoverIndic && this.elem?.onHover?.indic) {
      this.hoverIndic.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.onHover.indic.animation));
    }
    if (this.selectIndic && this.elem?.selected?.indic) {
      this.selectIndic.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.selected.indic.animation));
    }
    if (this.mouseFollower) {
      let px = mousePos.x + this.mouseFollower.offset.x;
      let py = mousePos.y + this.mouseFollower.offset.y;
      if (this.mouseFollower.snap) {
        px = Math.round(px / this.mouseFollower.snap) * this.mouseFollower.snap;
        py = Math.round(py / this.mouseFollower.snap) * this.mouseFollower.snap;
      }
      this.setPosition(px, py);
    }
    const dx = this.px - this.pos.x;
    const dy = this.py - this.pos.y;
    const animInfo = this.selectedAnimationInfo && (this.manager.selected === this || dx || dy) ? this.selectedAnimationInfo : this.hoveredAnimationInfo && this.manager.hovered(this) ? this.hoveredAnimationInfo : this.animationInfo;
    if (animInfo) {
      this.tileInfo = this.getTileInfoAnimate(animInfo);
    }

    if (dx || dy) {
      const doMove = !animInfo?.airFramesSet || animInfo.airFramesSet?.has(this.getFrame(animInfo));
      if (doMove) {
        if (dx * dx + dy * dy > .001) {
          const dist = this.elem?.gameObject?.speed ? Math.sqrt(dx * dx + dy * dy) : 1;
          const speed = Math.min(dist, this.elem?.gameObject?.speed ?? .5);
          this.pos.set(this.pos.x + dx / dist * speed, this.pos.y + dy / dist * speed);
        } else {
          this.pos.set(this.px, this.py);
        }
      }
    }

    if (this.type === "cursor") {
      if (mouseWasPressed(0)) {
        this.manager.onTap(this.px, this.py, mousePos.x, mousePos.y);
      }
      if (mouseWasReleased(0)) {
        this.manager.mousePosDown = undefined;
      }
    }


    const renderOrder = -Math.round(this.pos.y) + this.manager.layers?.indexOf(this.type ?? "") * 10000;
    if (this.renderOrder !== renderOrder || !this.updated) {
      this.renderOrder = renderOrder;
      this.decors.forEach((decor) => {
        decor.renderOrder = this.renderOrder + (this.elem?.spread?.behind ? -1 : 1);
      });
      this.moveOptions?.forEach(moveOption => moveOption.renderOrder = this.renderOrder - 1);

      if (this.shadow) {
        this.shadow.renderOrder = this.renderOrder - .1;
      }
      if (this.hoverIndic) {
        this.hoverIndic.renderOrder = this.renderOrder - 1;
      }
    }
    if (this.elem?.clearCloud && !this.clearedCloud) {
      const SIZE = 1, LIMIT = 2;
      for (let y = -SIZE; y <= SIZE; y++) {
        for (let x = -SIZE; x <= SIZE; x++) {
          if (Math.abs(x * y) < LIMIT * LIMIT) {
            this.manager.clearCloud(this.px + x, this.py + y);
          }
        }
      }

      this.clearedCloud = true;
    }

    this.updated = true;

    if (this.doomed) {
      this.decors.forEach((decor: any) => {
        const time = Date.now() - decor.doomTime;
        if (time > 0) {
          decor.size.set(decor.size.x * .9, decor.size.y * .9);
        }
      });
    }
  }

  doomed?: boolean = false;
  doom() {
    this.doomed = true;
    this.size.set(0, 0);
    const DURATION = 300;
    setTimeout(() => {
      if (this.manager.grid[this.getTag()] === this) {
        delete this.manager.grid[this.getTag()];
      }
      this.destroy();
      this.decors.forEach((decor) => {
        decor.destroy();
      });
    }, DURATION * 2);
    this.decors.forEach((decor) => {
      (decor as any).doomTime = Date.now() + DURATION * Math.random();
    });
  }
}
