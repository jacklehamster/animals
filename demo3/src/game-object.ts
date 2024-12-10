import { Color, EngineObject, mousePos, mouseWasPressed, mouseWasReleased, randColor, vec2, Vector2 } from "littlejsengine";
import type { Elem } from "./definition/elem";
import type { Manager } from "./manager";
import type { AnimationInfo } from "./animation/animation-manager";
import type { Resources } from "./definition/resources";

export class GameObject extends EngineObject {
  animationInfo?: AnimationInfo;
  hoveredAnimationInfo?: AnimationInfo;
  selectedAnimationInfo?: AnimationInfo;
  moveAnimationInfo?: AnimationInfo;
  harvestAnimationInfo?: AnimationInfo;
  shadowAnimationInfo?: AnimationInfo;
  frameRate: number = 60;
  mouseFollower?: { offset: Vector2; snap?: number };
  px: number = 0; py: number = 0;
  positionDetached?: boolean;
  type?: string;
  onHoverHideCursor?: boolean;
  visible: boolean = true;
  elem?: Elem;
  hovered: boolean = false;
  decors: EngineObject[] = [];
  shadow?: EngineObject;
  labels?: EngineObject[];
  updated?: boolean = false;
  moveOptions?: Record<string, EngineObject>;
  clearedCloud?: boolean;
  lastDx: number = 1;
  bornTime: number = Date.now();
  moveQueue?: Vector2[];
  resources: EngineObject[] = [];
  floatResources?: number;
  resourcesAccumulated?: Record<keyof Resources | string, number>;
  resourceBars: EngineObject[] = [];

  constructor(public manager: Manager, private gridShift: Vector2 = vec2(0, 0)) {
    super();
  }

  refresh(elem: Elem) {
    if (!this.elem) {
      const definition = this.manager.scene.definitions.find((def) => def.name === elem.definition);
      if (definition) {
        this.elem = JSON.parse(JSON.stringify(definition));
      } else {
        this.elem = elem;
      }
    }
    elem = this.elem!;
    const config = elem.gameObject;
    if (config) {
      this.type = elem.type;
      this.visible = !config.hidden;
      if (this.type === "cursor") {
        this.manager.cursor = this;
      }
      if (!this.positionDetached) {
        const px = this.gridShift.x + (config.pos?.[0] ?? 0);
        const py = this.gridShift.y + (config.pos?.[1] ?? 0);
        this.setPosition(px, py, true);
        const offset = this.elem?.gameObject?.offset ?? [0, 0];
        this.pos.set(px + offset[0], py + offset[1]);
        this.updateSize();
        this.size.set(
          this.visible ? config.size?.[0] : 0,
          this.visible ? config.size?.[1] : 0,
        );
        if (config.rotation) {
          this.angle = config.rotation;
        }
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
      if (elem.move) {
        if (elem.move.animation) {
          this.moveAnimationInfo = this.manager.animation.getInfo(elem.move.animation);
        }
      }
      if (elem.harvest) {
        if (elem.harvest.animation) {
          this.harvestAnimationInfo = this.manager.animation.getInfo(elem.harvest.animation);
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
          const shouldBrachOut = Math.random() <= (elem.branchOut.chance ?? 1);
          const { animation, count } = elem.branchOut;
          const actualCount = !shouldBrachOut ? 1 : count[0] + Math.floor(Math.random() * (count[1] - count[0]));
          let pos = vec2(this.pos.x, this.pos.y);
          const directions: [number, number][] = [[-1, 0], [0, -1], [1, 0], [0, 1]];
          let lastDir: [number, number] | undefined;
          let prePos: Vector2 = pos;
          for (let i = 0; i < actualCount; i++) {
            const oppositeDirIndex = lastDir ? (directions.indexOf(lastDir) + 2) % 4 : undefined;
            const filteredDirections = directions.filter((_dir, index) => index !== oppositeDirIndex);
            const dir = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
            pos = pos.add(vec2(dir[0], dir[1]));
            const rot = Math.atan2((pos.y - prePos.y), -(pos.x - prePos.x));

            this.manager.scene.elems.push({
              name: "river",
              type: "road",
              resources: {
                wheat: 1,
              },
              gameObject: {
                pos: [pos.x, pos.y],
                size: [2, 2],
                rotation: rot,
              },
              animation: {
                name: animation,
              },
            });
            prePos = pos;
            lastDir = dir;
          }
        }
      }
      this.refreshLabel();
      this.refreshBars();
    } else {
      if (this.manager.grid[this.getTag()] === this) {
        delete this.manager.grid[this.getTag()];
      }
      if (this.manager.selected === this) {
        this.manager.setSelection(undefined);
      }
      this.destroy();
    }
  }

  refreshBars() {
    if (!this.resourcesAccumulated) {
      return;
    }
    this.resourceBars.forEach(bar => bar.destroy());
    this.resourceBars.length = 0;
    Object.entries(this.resourcesAccumulated).forEach(([key, value], i) => {
      if (this.manager.scene.resources[key as keyof Resources]?.global) {
        return;
      }
      // const 
      // if (!this.resourceBars[i]) {
      //   this.resourceBars[i] = new EngineObject();
      //   this.addChild(this.resourceBars[i], vec2(-.5 + i * .2, 1.5));
      // }
      if (!value) {
        return;
      }
      const barIcon = new EngineObject(vec2(0, 0), vec2(.2, .2));
      barIcon.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(key));
      this.addChild(barIcon, vec2(-.5 + i * .2, 1.5));
      this.resourceBars.push(barIcon);

      const bar = new EngineObject(vec2(0, 0), vec2(.2 * value, .2));
      bar.color = new Color(1, 1, 0, 1);
      this.addChild(bar, vec2(-.5 + i * .2, 1.5));
      this.resourceBars.push(bar);
    });
  }

  refreshLabel() {
    let numToShow = this.elem?.level ?? this.elem?.hitpoints;
    if (!numToShow) {
      return;
    }
    const size = this.elem?.level ? .5 : .3;
    const offset = this.elem?.level ? vec2(0, .25) : vec2(-.5, .2);
    const charSize = this.elem?.level ? .2 : .15;
    if (!this.labels) {
      this.labels = [];
    }
    let l = numToShow;
    for (let i = 0; l > 0 || i < this.labels.length; i++) {
      if (!l) {
        if (this.labels[i]) {
          this.labels[i].size.set(0, 0);
        }
      } else {
        const d = l % 10;
        if (!this.labels[i]) {
          this.labels[i] = new EngineObject(vec2(0, 0), vec2(0, 0));
          if (this.elem?.hitpoints) {
            this.labels[i].color = new Color(255, 255, 0, 1);
          } else {
            this.labels[i].color = new Color(255, 255, 255, 1);
          }
          this.addChild(this.labels[i], offset.add(vec2(-i * charSize, 0)));
        }
        const digit = this.labels[i];
        digit.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(`num_${d}`));
        digit.size.set(size, size);
        l = Math.floor(l / 10);
      }
    }
    this.labels.forEach(label => label.renderOrder = this.renderOrder + .2);
  }

  private hideResources() {
    this.resources.forEach(resource => resource.destroy());
    this.resources.length = 0;
  }

  showResources(x: number, y: number,
    owner?: number,
    floatResources: boolean = false
  ) {
    const resources = this.manager.getResources(x, y);
    if (!resources) {
      return;
    }
    const resourceSpacing = .15;
    const offset = this.elem?.gameObject?.offset ?? [0, 0];
    const offX = x - this.px - offset[0], offY = y - this.py - offset[1];
    let count = 0;
    const RESOURCES: ["wheat", "wood", "brain"] = ["wheat", "wood", "brain"];
    let total = 0;
    RESOURCES.forEach((resource) => {
      for (let i = 0; i < (resources[resource] ?? 0); i++) {
        total++;
      }
    });

    RESOURCES.forEach((resource) => {
      for (let i = 0; i < (resources[resource] ?? 0); i++) {
        const indic = new EngineObject(vec2(0, 0), vec2(.5, .5));
        indic.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(resource));
        indic.color = new Color(255, 255, 255, 1);
        this.addChild(indic, vec2(offX + (count - (total - 1) / 2) * resourceSpacing, offY));
        this.resources.push(indic);
        count++;
      }
    });
    let harvesting = floatResources;
    if (!floatResources) {
      this.manager.iterateGridCell(x, y, (elem) => {
        if (elem.elem?.owner === owner && elem.elem?.harvesting) {
          harvesting = true;
        }
      });
    }
    const indic = new EngineObject(vec2(0, 0), vec2(count * resourceSpacing + .2, .3));
    indic.color = harvesting ? new Color(1, .5, 1, .8) : new Color(.5, .5, .5, .8);
    this.addChild(indic, vec2(offX, offY));
    this.resources.push(indic);
    this.updated = false;
    if (floatResources) {
      this.floatResources = Date.now();
    }
  }

  private getTag() {
    return GameObject.getTag(this.type, this.px, this.py);
  }

  static getTag(type: string | undefined, px: number, py: number) {
    return `${type}_${px}_${py}`;
  }

  updateSize() {
    const age = Date.now() - this.bornTime;
    const scale = Math.min(1, age / 200);
    const config = this.elem?.gameObject;
    this.size.set(
      scale * (this.visible ? (config?.size?.[0] ?? 0) : 0) * (this.lastDx || 1),
      scale * (this.visible ? (config?.size?.[1] ?? 0) : 0),
    );
  }

  moveTo(px: number, py: number) {
    const moveOption = this.moveOptions?.[`${px}_${py}`];
    if (!moveOption) {
      if (this.moveQueue)
        this.moveQueue.length = 0;
      return;
    }
    if (!this.moveQueue) {
      this.moveQueue = [];
    }
    this.moveQueue.push(vec2(px, py));
    const from = (moveOption as any).from;
    if (from.x !== this.px || from.y !== this.py) {
      this.moveTo(from.x, from.y);
    }
    this.positionDetached = true;
  }

  setPosition(px: number, py: number, force?: boolean) {
    if (this.px === px && this.py === py && !force) return;
    if (this.manager.grid[this.getTag()] === this) {
      delete this.manager.grid[this.getTag()];
    }
    if (this.px !== px) {
      this.lastDx = Math.sign(px - this.px);
      this.updateSize();
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
      this.manager.revealed.delete(`${px}_${py}`);
    }
    this.clearedCloud = false;
    this.updated = false;
  }

  canMoveTo(px: number, py: number) {
    if (this.px === px && this.py === py) {
      return false;
    }
    if (!this.manager.revealed.has(`${px}_${py}`)) {
      return false;
    }
    if (this.elem?.type !== "unit") {
      return false;
    }
    if (this.manager.grid[`unit_${px}_${py}`]) {
      return false;
    }
    if (this.manager.grid[`decor_${px}_${py}`]) {
      return false;
    }
    if (this.manager.grid[`tile_overlay_${px}_${py}`]?.elem?.water) {
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
      this.updateSize();
    }
  }

  hoverIndic?: EngineObject;

  onHoverChange() {
    if (this.manager.shifting) {
      return;
    }
    if (this.onHoverHideCursor) {
      if (this.manager.hovering(this)) {
        this.manager.setHovered(this);
        if (this.elem?.onHover?.indic && !this.hoverIndic) {
          this.hoverIndic = new EngineObject();
          const scale = this.elem.onHover.indic.scale ?? 1;
          this.hoverIndic.size.set(this.size.x * scale, this.size.y * scale);
          this.hoverIndic.tileInfo = this.manager.animation.getInfo(this.elem.onHover.indic.animation).tileInfos[0];
          this.hoverIndic.pos.set(this.px, this.py);
          const offset = this.elem?.gameObject?.offset ?? [0, 0];
          this.addChild(this.hoverIndic, vec2(-offset[0], -offset[1]));
          this.updated = false;
        }
      } else {
        this.manager.setHovered(undefined);
        if (this.elem?.onHover?.indic && this.hoverIndic) {
          this.removeChild(this.hoverIndic);
          this.hoverIndic.destroy();
          this.hoverIndic = undefined;
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
        this.selectIndic.renderOrder = this.renderOrder - .1;
        this.selectIndic.tileInfo = this.manager.animation.getInfo(this.elem.selected.indic.animation).tileInfos[0];
        const offset = this.elem?.gameObject?.offset ?? [0, 0];
        this.addChild(this.selectIndic, vec2(-offset[0], -offset[1]));
        this.selectIndic.pos.set(this.px, this.py);

        //  show move options
        if (this.elem.move && !this.manager.checkCondition(this.elem.move.disabled, this)) {
          this.addMoveOptions(this.elem.move?.distance ?? 1, vec2(this.px, this.py));
        }
        const home = this.elem.settler ? this : this.elem.worker ? this.home : undefined;
        if (home) {
          for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
              this.showResources(home.px + x, home.py + y, this.elem?.owner);
            }
          }
        }
      }
    } else {
      if (this.elem?.selected?.indic && this.selectIndic) {
        this.selectIndic.destroy();
        this.selectIndic = undefined;
      }
      if (this.moveOptions) {
        Object.values(this.moveOptions).forEach(moveOption => moveOption.destroy());
        delete this.moveOptions;
      }
      if (this.elem?.animation) {
        this.hideResources();
      }
    }
  }

  addMoveOptions(movePoints: number, from: Vector2, revealPotential = 0, distanceTravelled = 0) {
    if (!movePoints) {
      return;
    }
    const DIRECTIONS = [
      [-1, 0], [0, -1], [1, 0], [0, 1],
      [-1, -1], [1, -1], [-1, 1], [1, 1],
    ];
    const froms: [Vector2, number, number][] = [];
    DIRECTIONS.forEach(([dx, dy]) => {
      if (!this.canMoveTo(from.x + dx, from.y + dy)) {
        return;
      }
      const newDistanceTravelled = distanceTravelled + Math.sqrt(dx * dx + dy * dy);
      const existingMoveOption = this.moveOptions?.[`${from.x + dx}_${from.y + dy}`] as any;
      if (existingMoveOption) {
        const canReveal = revealPotential + this.manager.countRevealPotential(from.x + dx, from.y + dy);
        let shouldReplace = false;
        if (existingMoveOption.movePoints < movePoints) {
          //  this route takes less points
          shouldReplace = true;
        } else if (existingMoveOption.movePoints === movePoints) {
          if (existingMoveOption.distanceTravelled > newDistanceTravelled) {
            //  this route takes same points but less distance
            shouldReplace = true;
          } else if (existingMoveOption.distanceTravelled === newDistanceTravelled && existingMoveOption.canReveal < canReveal) {
            //  this route takes same points and distance but more revealing
            shouldReplace = true
          }
        }
        if (shouldReplace) {
          existingMoveOption.canReveal = canReveal;
          existingMoveOption.from = from;
          existingMoveOption.movePoints = movePoints;
          existingMoveOption.distanceTravelled = newDistanceTravelled;
          froms.push([vec2(from.x + dx, from.y + dy), canReveal, newDistanceTravelled]);
        }
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
      (obj as any).from = from;
      (obj as any).canReveal = revealPotential + this.manager.countRevealPotential(from.x + dx, from.y + dy);
      (obj as any).movePoints = movePoints;
      (obj as any).distanceTravelled = newDistanceTravelled;
      const offset = this.elem?.gameObject?.offset ?? [0, 0];
      // obj.pos.set(this.px, this.py);
      this.addChild(obj, vec2((from.x + dx - this.px) - offset[0], (from.y + dy - this.py) - offset[1]));
      if (!this.moveOptions) {
        this.moveOptions = {};
      }
      this.moveOptions[`${from.x + dx}_${from.y + dy}`] = obj;
      froms.push([vec2(from.x + dx, from.y + dy), (obj as any).canReveal, (obj as any).distanceTravelled]);
      this.updated = false;
    });
    froms.forEach(([from, revealing, newDistanceTravelled]) => this.addMoveOptions(movePoints - 1, from, revealing, newDistanceTravelled));
  }

  getFrame(animInfo?: AnimationInfo) {
    return !animInfo ? 0 : Math.floor(Date.now() / (1000 / this.frameRate)) % animInfo.tileInfos.length;
  }

  getTileInfoAnimate(animInfo: AnimationInfo) {
    const t = this.getFrame(animInfo);
    return animInfo?.tileInfos?.[t];
  }

  accumulateResources(resources: Resources) {
    if (this.home) {
      this.home.accumulateResources(resources);
      return;
    }
    Object.entries(resources).forEach(([key, value]) => {
      if (!this.resourcesAccumulated) {
        this.resourcesAccumulated = {};
      }
      this.resourcesAccumulated[key] = (this.resourcesAccumulated[key] ?? 0) + value;
    });
  }

  update() {
    super.update();
    if (this.updated && !this.elem?.dynamic && !this.doomed && Date.now() - this.bornTime < 1000 && !this.floatResources) {
      return;
    }
    // if (this.manager.inUI) {
    //   return;
    // }
    const nowHoverered = this.manager.hovering(this);
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
    const offset = this.elem?.gameObject?.offset ?? [0, 0];
    const dx = (this.px + offset[0]) - this.pos.x;
    const dy = (this.py + offset[1]) - this.pos.y;
    const animInfo = this.harvestAnimationInfo && this.elem?.harvesting ? this.harvestAnimationInfo : this.moveAnimationInfo && (dx || dy) ? this.moveAnimationInfo : this.selectedAnimationInfo && (this.manager.selected === this) ? this.selectedAnimationInfo : this.hoveredAnimationInfo && this.manager.hovering(this) ? this.hoveredAnimationInfo : this.animationInfo;
    if (animInfo) {
      this.tileInfo = this.getTileInfoAnimate(animInfo);
    }

    if (dx || dy) {
      const doMove = !animInfo?.airFramesSet || animInfo.airFramesSet?.has(this.getFrame(animInfo));
      if (doMove) {
        if (dx * dx + dy * dy > .01) {
          const dist = this.elem?.gameObject?.speed ? Math.sqrt(dx * dx + dy * dy) : 1;
          const speed = Math.min(dist, this.elem?.gameObject?.speed ?? .5);
          this.pos.set(this.pos.x + dx / dist * speed, this.pos.y + dy / dist * speed);
        } else {
          this.pos.set(this.px + offset[0], this.py + offset[1]);
        }
      }
    } else {
      if (this.moveQueue?.length) {
        const dest = this.moveQueue.pop()!;
        this.setPosition(dest.x, dest.y);
        if (!this.moveQueue.length) {
          delete this.moveQueue;
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


    const coLayers = this.manager.scene?.colayers;
    const renderOrder = Math.round(-this.py) + (this.manager.scene.layers?.[this.type ?? ""] ?? 100) * 10000 + (coLayers?.[this.type ?? ""] ?? 0) * .001;
    if (this.renderOrder !== renderOrder || !this.updated) {
      this.renderOrder = renderOrder;
      this.decors.forEach((decor) => {
        decor.renderOrder = this.renderOrder + (this.elem?.spread?.behind ? -.1 : .1);
      });
      if (this.moveOptions) {
        Object.values(this.moveOptions).forEach(moveOption => moveOption.renderOrder = this.renderOrder - .1);
      }

      if (this.shadow) {
        this.shadow.renderOrder = this.renderOrder - .1;
      }
      if (this.hoverIndic) {
        this.hoverIndic.renderOrder = this.renderOrder - .1;
      }
      this.labels?.forEach(label => label.renderOrder = this.renderOrder + .2);
      this.resources.forEach((resource) => resource.renderOrder = 100000 + (resource.tileInfo ? .1 : -.1));
      this.resourceBars.forEach((resource) => resource.renderOrder = this.renderOrder + .1);
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

    if (this.elem?.dynamic && Date.now() - this.bornTime < 1000) {
      this.updateSize();
    }

    if (this.doomed) {
      this.decors.forEach((decor: any) => {
        const time = Date.now() - decor.doomTime;
        if (time > 0) {
          decor.size.set(decor.size.x * .9, decor.size.y * .9);
        }
      });
    }

    if (this.floatResources) {
      if (Date.now() - this.floatResources > 2000) {
        this.floatResources = undefined;
        this.hideResources();
      } else {
        this.resources.forEach(res => res.localPos.y += .005);
      }
    }
  }

  get home(): GameObject | undefined {
    if (this.elem?.home && !this.elem?.building) {
      return this.manager.grid[GameObject.getTag("house", this.elem.home[0], this.elem?.home[1])] ?? undefined;
    }
    return undefined;
  }

  doomed?: boolean = false;
  doom(immediate?: boolean) {
    this.doomed = true;
    this.size.set(0, 0);
    const destroy = () => {
      if (this.manager.grid[this.getTag()] === this) {
        delete this.manager.grid[this.getTag()];
      }
      this.destroy();
      this.decors.forEach((decor) => {
        decor.destroy();
      });
    };
    if (immediate) {
      destroy();
      return;
    }

    const DURATION = 300;
    setTimeout(destroy, DURATION * 2);
    if (!immediate) {
      this.decors.forEach((decor) => {
        (decor as any).doomTime = Date.now() + DURATION * Math.random();
      });
    }
  }
}
