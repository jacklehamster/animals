import { Color, EngineObject, mousePos, mouseWasPressed, mouseWasReleased, randColor, vec2, Vector2 } from "../../lib/littlejs";
import type { Elem } from "../../definition/elem";
import type { Manager } from "../manager";
import type { AnimationInfo } from "../../animation/animation-manager";
import type { Resources } from "../../definition/resources";
import { DecorObject } from "./decor";
import { MoveOption } from "./move-option";
import { AttackOption } from "./attack-option";
import { Projectile } from "../projectile";
import { BaseObject } from "./base-object";

export class GameObject extends BaseObject {
  animationInfo?: AnimationInfo;
  hoveredAnimationInfo?: AnimationInfo;
  selectedAnimationInfo?: AnimationInfo;
  moveAnimationInfo?: AnimationInfo;
  attackAnimationInfo?: AnimationInfo;
  harvestAnimationInfo?: AnimationInfo;
  shadowAnimationInfo?: AnimationInfo;
  frameRate: number = 60;
  mouseFollower?: { offset: Vector2; snap?: number };
  px: number = 0; py: number = 0;
  positionDetached?: boolean;
  // type?: string;
  onHoverHideCursor?: boolean;
  elem?: Elem;
  hovered: boolean = false;
  updated?: boolean = false;
  clearedCloud?: boolean;
  bornTime: number = Date.now() - Math.random() * 10000;
  moveQueue: Vector2[] = [];
  floatResources?: number;
  moving?: boolean;
  talkingTime?: number;
  attackTarget?: GameObject;
  attackOrigin?: Vector2;
  retaliationDamage?: number;
  onDone?: (self: GameObject) => void;
  hasPendingActions?: boolean;
  damageTime?: number;
  retaliating?: boolean;
  projectile?: Projectile;
  unitsSupported: Set<GameObject> = new Set();

  shadow?: BaseObject;
  labels: BaseObject[] = [];
  resources: BaseObject[] = [];
  resourceBars: BaseObject[] = [];
  hoverIndic?: BaseObject;
  decors: DecorObject[] = [];
  moveOptions?: Record<string, MoveOption>;
  attackOptions?: Record<string, AttackOption>;


  constructor(public manager: Manager, private gridShift: Vector2 = vec2(0, 0)) {
    super();
  }

  getColor(color: string): Color {
    if (color === "random") {
      return randColor();
    } else {
      return new Color().setHex(color);
    }
  }

  async refresh(elem: Elem) {
    if (!this.elem) {
      const definition = this.manager.scene.definitions.find((def) => def.name === elem.definition);
      if (definition) {
        this.elem = JSON.parse(JSON.stringify(definition));
      } else {
        this.elem = elem.copy ? JSON.parse(JSON.stringify(elem)) : elem;
      }
      this.manager.defineElem(this.elem!);

      // this.elem = JSON.parse(JSON.stringify(elem));

    }
    elem = this.elem!;
    const config = elem.gameObject;
    if (config) {
      if (config.hidden) {
        this.hide();
      } else {
        this.show();
      }
      if (this.home) {
        this.home.unitsSupported.add(this);
      }
      if (elem.owner === undefined) {
        elem.owner = 0;
      }
      if (elem.type === "cursor") {
        this.manager.cursor = this;
      }
      if (!this.positionDetached) {
        const px = this.gridShift.x + (config.pos?.[0] ?? 0);
        const py = this.gridShift.y + (config.pos?.[1] ?? 0);
        this.setPosition(px, py, true);
        const offset = this.elem?.gameObject?.offset ?? [0, 0];
        this.pos.set(px + offset[0], py + offset[1]);
      }
      this.updateSize(1);
      if (config.rotation) {
        this.angle = config.rotation;
      }
      if (config.color) {
        this.color = this.getColor(config.color);
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
      if (elem.selected?.animation) {
        this.selectedAnimationInfo = this.manager.animation.getInfo(elem.selected.animation);
      }
      if (elem.move?.animation) {
        this.moveAnimationInfo = this.manager.animation.getInfo(elem.move.animation);
      }
      if (elem?.attack?.animation) {
        this.attackAnimationInfo = this.manager.animation.getInfo(elem.attack.animation);
      }
      if (elem.harvest?.animation) {
        this.harvestAnimationInfo = this.manager.animation.getInfo(elem.harvest.animation);
      }
      if (elem.shadow) {
        if (elem.shadow.animation) {
          this.shadowAnimationInfo = this.manager.animation.getInfo(elem.shadow.animation);
          if (!this.shadow) {
            this.shadow = new BaseObject();
            this.shadow.size.set(this.size.x, this.size.y);
            this.shadow.tileInfo = this.getTileInfoAnimate(this.shadowAnimationInfo);
            const offset = this.elem?.gameObject?.offset ?? [0, 0];
            this.addChild(this.shadow, vec2(-offset[0], -offset[1]));
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
        const { animation, count, radius, color, size } = elem.spread;
        const animInfo = this.manager.animation.getInfo(animation);
        const actualCount = count[0] + Math.floor(Math.random() * (count[1] - count[0]));
        for (let i = 0; i < actualCount; i++) {
          const x = (Math.random() - 1 / 2) * (size ?? 1);
          const y = (Math.random() - 1 / 2) * (size ?? 1);
          if (radius && x * x + y * y > radius * radius) {
            continue;
          }
          const decor = new DecorObject(this, x, y);
          decor.tileInfo = this.getTileInfoAnimate(animInfo);
          if (color) {
            decor.color = this.getColor(color);
          }
          this.decors.push(decor);
        }
        if (elem.branchOut && Math.random() <= (elem.branchOut.chance ?? 1)) {
          const { count, element } = elem.branchOut;
          const actualCount = count[0] + Math.floor(Math.random() * (count[1] - count[0]));
          const pos = vec2(this.pos.x, this.pos.y);
          const directions: [number, number][] = [[-1, 0], [0, -1], [1, 0], [0, 1]];
          let lastDir: [number, number] | undefined;
          for (let i = 0; i < actualCount; i++) {
            const el = this.manager.defineElem(JSON.parse(JSON.stringify(element)));
            const oppositeDirIndex = lastDir ? (directions.indexOf(lastDir) + 2) % 4 : undefined;
            const filteredDirections = directions.filter((_dir, index) => index !== oppositeDirIndex);
            const dir = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
            pos.set(pos.x + dir[0], pos.y + dir[1]);

            if (this.manager.grid[`road_${pos.x}_${pos.y}`]) {
              break;
            }

            const rot = Math.atan2(-dir[1], dir[0]);

            if (!el.gameObject) {
              el.gameObject = {};
            }
            if (!el.gameObject.noRotation) {
              el.gameObject.rotation = rot;
            }
            el.gameObject.pos = [pos.x, pos.y];
            this.manager.scene.elems.push(el);
            lastDir = dir;
          }
        }
      }
      if (elem.selfSelect) {
        elem.selfSelect = false;
        setTimeout(() => {
          this.manager.setSelection(this);
        }, 300);
      }
      await this.refreshLabel();
      this.refreshBars();
      this.refreshAlpha();
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

  hideBars() {
    this.resourceBars.forEach(bar => bar.destroy());
    this.resourceBars.length = 0;
  }

  refreshBars() {
    this.hideBars();
    if (!this.elem?.resourcesAccumulated) {
      return;
    }
    const [offX, offY] = this.elem?.gameObject?.offset ?? [0, 0];
    let count = 0;
    Object.entries(this.elem.resourcesAccumulated).forEach(([key, value]) => {
      const res = key as keyof Resources;
      if (this.manager.scene.resources[res]?.global) {
        return;
      }
      if (!value) {
        return;
      }
      const backBar = new BaseObject(vec2(0, 0), vec2(1, .3));
      backBar.color = new Color(0, 0, 0, .3);
      this.addChild(backBar, vec2(0 - offX, count * .3 - offY - .3));
      this.resourceBars.push(backBar);

      const numValuesToShow = Math.min(10, value);
      const spacing = Math.min(.2, 1 / numValuesToShow);
      for (let j = 0; j < numValuesToShow; j++) {
        const barIcon = new BaseObject(vec2(0, 0), vec2(.5, .5));
        barIcon.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(key));
        this.addChild(barIcon, vec2(-.4 + j * spacing - offX + Math.floor(j / 5) * .1 - Math.floor((numValuesToShow - 1) / 5) * .05, count * .3 - offY - .3));
        this.resourceBars.push(barIcon);
      }
      if (value > 10) {
        const color = value >= this.resourceCapacity(res) ? new Color(1, .7, .7, 1) : new Color(1, 1, 1, 1);
        const digits = this.generateEngineObjectsForDigit(value, .4, .16, vec2(.5 - offX, count * .3 - offY - .3,), color);
        this.resourceBars.push(...digits);
      }
      count++;
    });
    this.updated = false;
  }

  isRevealed() {
    return this.manager.isRevealed(this.px, this.py);
  }

  async refreshLabel() {
    this.labels.forEach(label => label.destroy());
    this.labels.length = 0;
    if (this.elem?.harvesting && !this.elem?.level) {
      return;
    }
    if (!this.isRevealed()) {
      return;
    }
    let numToShow = this.elem?.level ?? this.elem?.hitpoints;
    if (!numToShow) {
      return;
    }
    const size = this.elem?.level ? .5 : .3;
    const offset = this.elem?.level ? vec2(0, .25) : vec2(-.5, .2);
    const charSize = this.elem?.level ? .2 : .15;
    const labelAlpha = await this.canAct() ? 1 : .5;
    const isOwnedByPlayer = this.elem?.owner === this.manager.getPlayer();
    const color = !this.elem?.owner ?
      new Color(1, .5, .5, labelAlpha) :
      !isOwnedByPlayer ? new Color(.5, .5, .5, labelAlpha) :
        this.elem?.hitpoints
          ? (this.elem.hitpoints < (this.elem.maxHitPoints ?? 0)
            ? new Color(1, 1, 0, labelAlpha)
            : new Color(0, 1, 0, labelAlpha))
          : await this.canAffordMoreHarvester()
            ? new Color(1, .9, 0, labelAlpha)
            : new Color(1, 1, 1, labelAlpha);
    if (!this.labels) {
      this.labels = [];
    }
    const digits = this.generateEngineObjectsForDigit(numToShow, size, charSize, offset, color);
    this.labels.push(...digits);
    this.labels.forEach(label => label.renderOrder = this.renderOrder + .2);
  }

  async canAffordMoreHarvester() {
    return (await this.findNearby((obj) => !!obj?.elem?.harvesting)).size < (this.elem?.level ?? 0);
  }

  resourceMaxedOut() {
    return Object.entries(this.elem?.resourcesAccumulated ?? {}).some(([resource, value]) => {
      const res = resource as keyof Resources;
      if (this.manager.scene.resources[res]?.global || this.manager.scene.resources[res]?.forGrowth) {
        return;
      }
      return value >= this.resourceCapacity(resource as keyof Resources);
    });
  }

  generateDigits(num: number) {
    const digits: number[] = [];
    let l = Math.max(0, num);
    while (l > 0) {
      const d = l % 10;
      digits.push(d);
      l = Math.floor(l / 10);
    }
    return digits;
  }

  generateEngineObjectsForDigit(num: number, size: number, charSize: number, offset: Vector2, color: Color) {
    const digits = this.generateDigits(num);
    return digits.map((d, i) => {
      const digit = new BaseObject(vec2(0, 0), vec2(size, size));
      digit.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(`num_${d}`));
      digit.color = color;
      this.addChild(digit, offset.add(vec2(-i * charSize, 0)));
      return digit;
    });
  }

  private hideResources() {
    this.resources.forEach(resource => resource.destroy());
    this.resources.length = 0;
  }

  showResources(x: number, y: number,
    owner?: number,
    floatResources: boolean = false,
    res?: Resources,
  ) {
    const resources = res ?? this.manager.getResources(x, y);
    if (!resources) {
      return;
    }


    const rand = floatResources ? (Math.random() - .5) * .5 : 0;
    const resourceSpacing = .15;
    const offset = this.elem?.gameObject?.offset ?? [0, 0];
    const offX = (x - this.px - offset[0]) + rand, offY = y - this.py - offset[1];
    const RESOURCES: ["wheat", "wood", "trade", "gold", "brain"] = ["wheat", "wood", "trade", "gold", "brain"];
    let total = 0;
    RESOURCES.forEach((resource) => {
      for (let i = 0; i < (resources[resource] ?? 0); i++) {
        total++;
      }
    });

    let count = 0;
    RESOURCES.forEach((resource) => {
      const value = resources[resource] ?? 0;
      if (!value) {
        return;
      }
      const MAX_ROW = 8;
      for (let i = 0; i < value; i++) {
        const indic = new BaseObject(vec2(0, 0), vec2(.5, .5));
        indic.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(resource));
        indic.color = new Color(1, 1, 1, 1);
        const col = count % MAX_ROW;
        const row = Math.floor(count / MAX_ROW);
        this.addChild(indic,
          vec2(
            offX + (col - (Math.min(total, MAX_ROW) - 1) / 2) * resourceSpacing + rand,
            offY + (row - Math.floor(total / MAX_ROW) / 2) * resourceSpacing + rand
          )
        );
        this.resources.push(indic);
        count++;
      }
    });
    let harvesting = floatResources;
    if (!floatResources) {
      this.manager.iterateGridCell(x, y, async (elem) => {
        if (elem.elem?.owner === owner && elem.elem?.harvesting) {
          harvesting = true;
        }
      });
    }
    if (!floatResources) {
      const indic = new BaseObject(vec2(0, 0), vec2(count * resourceSpacing + .2, .3));
      indic.color = harvesting ? new Color(1, .5, 1, .8) : new Color(.5, .5, .5, .8);
      this.addChild(indic, vec2(offX, offY));
      this.resources.push(indic);
    }
    this.updated = false;
    if (floatResources) {
      this.floatResources = Date.now();
    }
  }

  setHarvesting(value: boolean) {
    if (this.elem) {
      if (this.elem.harvesting !== value) {
        this.elem.harvesting = value;
        this.home?.refreshLabel();
        if (this.elem.harvesting) {
          this.spendActions();
        } else {
          this.manager.setSelection(this);
        }
      }
    }
  }

  private getTag() {
    return GameObject.getTag(this.elem?.type, this.px, this.py);
  }

  static getTag(type: string | undefined, px: number, py: number) {
    return `${type}_${px}_${py}`;
  }

  updateSize(s?: number) {
    const age = Date.now() - this.bornTime;
    const scale = s ?? Math.min(1, age / 200);
    const config = this.elem?.gameObject;
    this.size.set(
      scale * (this.visible ? (config?.size?.[0] ?? 0) : 0) * (this.elem?.gameObject?.lastDx ?? 1),
      scale * (this.visible ? (config?.size?.[1] ?? 0) : 0),
    );
  }

  clearMoves() {
    if (this.elem?.turn) {
      this.elem.turn.moves = 0;
      this.elem.turn.attacks = 0;
      this.elem.turn.actions = 0;
    }
  }

  hasMove() {
    return this.elem?.turn?.moves;
  }

  hasAttack() {
    return this.elem?.turn?.attacks;
  }

  hasAction() {
    return this.elem?.turn?.actions;
  }

  async canAttack() {
    if (!this.elem?.attack || this.elem.attack.disabled) {
      return false;
    }
    if (!this.elem.turn?.attacks) {
      return false;
    }
    if (!this.elem?.turn.moves && !this.elem.attack.attackAfterMove) {
      return false;
    }
    const foes = await this.findNearbyFoe(this.elem.attack.range);
    if (!foes.size) {
      return false;
    }
    let hasFoeToAttack = false;
    foes.forEach((foe) => {
      if (this.canAttackAt(foe.px, foe.py)) {
        hasFoeToAttack = true;
      }
    });
    if (!hasFoeToAttack) {
      return false;
    }

    return true;
  }

  spendAttack() {
    const elem = this.elem;
    if (elem && elem.turn?.attacks) {
      elem.turn.attacks = this.elem?.attack?.attackAfterAttack ? 1 : 0;
      elem.turn.moves = this.elem?.attack?.moveAfterAttack ? 1 : 0;
    }
  }

  spendMove() {
    if (this.elem?.endlessMove) {
      this.doneMoving();
      return;
    }
    const elem = this.elem;
    if (elem && elem.turn?.moves) {
      elem.turn.moves--;
      this.doneMoving();
    }
  }

  doneMoving() {
    if (this.hasPendingActions) {
      return;
    }
    this.afterDoneMoving();
  }

  private async afterDoneMoving() {
    this.refreshAlpha();
    this.refreshLabel();
    await this.manager.unlockRewards(this);
    this.manager.checkForAnyMove();

    if (this.manager.isAiPlayer(this.elem?.owner)) {
      await this.manager.selectNext();
    } else if (!this.canAct() || this.elem?.harvesting || this.elem?.waiting) {
      await this.manager.selectNext();
    } else if (this.manager.selected === this) {
      if (this.elem?.settler || this.elem?.worker) {
        this.showResourcesNearby();
      }
      await this.showActionOptions();
      this.manager.hud.showSelected(this);
    }
  }

  spendActions() {
    const elem = this.elem;
    if (elem && elem.turn?.actions) {
      elem.turn.actions--;
      this.doneMoving();
    }
  }

  async canAct() {
    return this.hasMove() || (this.hasAttack() && await this.canAttack()) || this.hasAction();
  }

  refreshAlpha() {
    if (this.elem?.turn && this.elem?.type === "unit") {
      if (!this.canAct() || this.elem?.waiting) {
        this.color = new Color(1, 1, 1, .5);
      } else {
        this.color = new Color(1, 1, 1, 1);
      }
    }
  }

  async giveTurn() {
    const elem = this.elem;
    if (elem?.turn) {
      elem.turn.moves = elem.turn.attacks = 1;
      if (elem.worker) {
        elem.turn.actions = 1;
      }
      if (this.elem?.harvesting || this.elem?.waiting) {
        //  check nearby foes
        const foes = await this.findNearbyFoe();
        if (foes.size) {
          this.elem.harvesting = false;
          this.elem.waiting = false;
          this.updated = false;
        }
      }

      this.refreshAlpha();
      this.refreshLabel();
    }
  }

  attackTowards(px: number, py: number) {
    console.log(this.elem?.name, "Attack towards", px, py);
    const dx = px - this.px;
    const dy = py - this.py;
    const dist = Math.max(Math.abs(dx), Math.abs(dy));
    if (dist === 0) {
      return;
    }
    if (dist > 1) {
      const x = Math.sign(dx);
      const y = Math.sign(dy);
      this.simpleMoveTo(this.px + x, this.py + y);
      console.log("move by", x, y);
    }
    this.moveQueue.push(vec2(px, py));
  }

  simpleMoveTo(px: number, py: number) {
    this.moveQueue = [vec2(px, py)];
    this.hideResources();
    this.hideMoveOptions();
    this.manager.hud.showSelected(undefined);
  }

  attackAt(px: number, py: number) {
    const dx = px - this.px;
    const dy = py - this.py;
    if (!this.elem?.attack?.range) {
      //  melee attack. Just move to the target
      this.moveQueue.push(vec2(px, py));
      this.hideResources();
      this.hideMoveOptions();
      this.manager.hud.showSelected(undefined);
    } else {
      //  ranged attack
      const unit = this.manager.unitAt(px, py);
      if (unit) {
        this.attackRange(unit);

      }

    }
  }

  moveTo(px: number, py: number) {
    this.positionDetached = true;
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
    const from = moveOption.from;
    if (from.x !== this.px || from.y !== this.py) {
      this.moveTo(from.x, from.y);
      return;
    }
    this.hideResources();
    this.hideMoveOptions();
    this.manager.hud.showSelected(undefined);
  }

  talkTo(gameObject: GameObject) {
    if (!this.elem?.gameObject) {
      return;
    }
    const dx = gameObject.px - this.px;
    if (this.elem.gameObject.lastDx !== Math.sign(dx)) {
      this.elem.gameObject.lastDx = Math.sign(dx);
      this.updateSize();
    }
    this.talkingTime = Date.now() + Math.random() * 3000;
  }

  async moveUnitTo(px: number, py: number) {
    this.talkingTime = undefined;
    // check if there's a unit at the target position
    const target = this.manager.unitAt(px, py);
    if (target) {
      if (this.elem?.owner === target.elem?.owner) {
        this.talkTo(target);
        target.talkTo(this);
        return;
      }
      if (this.elem?.owner !== target.elem?.owner && await this.canAttack()) {
        this.attack(target);
        return;
      }
    } else {
      this.setPosition(px, py);
    }
  }

  setPosition(px: number, py: number, force?: boolean) {
    if (this.px === px && this.py === py && !force) return;

    if (this.manager.grid[this.getTag()] === this) {
      delete this.manager.grid[this.getTag()];
    }
    if (this.px !== px && this.elem?.gameObject) {
      this.elem.gameObject.lastDx = Math.sign(px - this.px);
      this.updateSize();
    }

    this.px = px;
    this.py = py;

    if (this.manager.grid[this.getTag()] !== this) {
      this.manager.grid[this.getTag()]?.destroy();
      this.manager.grid[this.getTag()] = this;
    }

    if (!this.manager.inUI) {
      if (this.elem?.type === "cursor") {
        this.manager.onCursorMove(px, py);
      }
    }
    if (this.elem?.type === "cloud") {
      this.manager.revealed.delete(`${px}_${py}`);
    }

    this.clearedCloud = false;
    this.updated = false;
  }

  hasMoveOptionToLandOn(x: number, y: number) {
    return this.moveOptions?.[`${x}_${y}`]?.canLand;
  }

  hasAttackOptionOn(x: number, y: number) {
    return this.attackOptions?.[`${x}_${y}`];
  }

  canLandOn(px: number, py: number) {
    if (!this.canMoveTo(px, py)) {
      return false;
    }
    return true;
  }

  canAttackAt(px: number, py: number) {
    const elem = this.elem;
    if (!elem) {
      return false;
    }
    if (this.elem?.owner && !this.manager.isRevealed(px, py)) {
      return false;
    }
    const dx = px - this.px;
    const dy = py - this.py;
    const distance = Math.max(Math.abs(dx), Math.abs(dy));
    if (distance > (elem.attack?.range ?? 1)) {
      return false;
    }
    const targetUnit = this.manager.unitAt(px, py);
    // const targetHouse = this.manager.houseAt(px, py);
    if (targetUnit) {
      return targetUnit.elem?.owner !== elem.owner;
    }
    // if (targetHouse) {
    //   return targetHouse.elem?.owner !== elem.owner;
    // }
    return false;
  }

  canMoveTo(px: number, py: number) {
    const elem = this.elem;
    if (!elem) {
      return false;
    }
    if (this.px === px && this.py === py) {
      return false;
    }
    if (!this.elem?.turn?.moves) {
      return false;
    }
    if (elem.type !== "unit") {
      return false;
    }
    if (!this.manager.grid[`tile_${px}_${py}`]) {
      return false;
    }
    if (!this.manager.isRevealed(px, py)) {
      if (!this.manager.isAiPlayer(this.elem.owner) && !this.elem.team) {
        return false;
      }
    }
    const decor = this.manager.grid[`decor_${px}_${py}`];
    if (decor) {
      if (!elem?.canCrossTerrains?.includes(decor.elem?.name ?? "")) {
        return false;
      }
    }
    const tile_overlay = this.manager.grid[`tile_overlay_${px}_${py}`];
    if (tile_overlay?.elem?.water) {
      if (!elem?.canCrossTerrains?.includes(tile_overlay?.elem?.name ?? "")) {
        return false
      }
    }
    if (this.elem?.closeToHome && this.home) {
      const home = this.home;
      const dx = px - home.px;
      const dy = py - home.py;
      if (this.manager.isResearched("expansion", this.manager.getPlayer())) {
        if (Math.abs(dx * dy) >= 4) {
          return false;
        }
      } else {
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          return false;
        }
      }
    }
    const targetUnit = this.manager.unitAt(px, py);
    if (targetUnit) {
      return false;
    }

    // const targetHouse = this.manager.houseAt(px, py);
    // if (targetHouse && targetHouse.elem?.owner !== elem.owner) {
    //   return false;
    // }
    // if (!targetUnit) {
    //   return this.hasMove();
    // }

    // if (targetUnit?.elem?.owner === elem.owner) {
    //   return false;
    // }
    //  else if (!this.canAttack() || (this.elem?.attack?.range ?? 1) > 1) {
    //   return false;
    // }

    return true;
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  onHoverChange() {
    if (this.manager.shifting) {
      return;
    }
    if (this.onHoverHideCursor) {
      if (this.manager.hovering(this)) {
        this.manager.setHovered(this);
        if (this.elem?.onHover?.indic && !this.hoverIndic) {
          this.hoverIndic = new BaseObject();
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

  showResourcesNearby() {
    const home = this.elem?.settler ? this : this.elem?.worker ? this.home : this;
    if (home) {
      const range = this.manager.isResearched("expansion", this.elem?.owner ?? 0) ? 2 : 1;
      for (let y = -range; y <= range; y++) {
        for (let x = -range; x <= range; x++) {
          if (Math.abs(x * y) < 4) {
            if (this.elem?.building || home.px + x === this.px && home.py + y === this.py || this.canMoveTo(home.px + x, home.py + y)) {
              this.showResources(home.px + x, home.py + y, this.elem?.owner);
            }
          }
        }
      }
      home?.hideBars();
    }
  }

  async onSelectChange() {
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
        if (!this.elem?.owner) {
          this.selectIndic.color = new Color(1, 0, 0, 1);
        }

        if (this.manager.isAiPlayer(this.elem?.owner)) {
          if (await this.canAct() && this.manager.isRevealed(this.px, this.py)) {
            this.manager.thinker?.think(this);
          } else {
            this.clearMoves();
            this.doneMoving();
          }
          return;
        }

        //  show move options
        this.showActionOptions();
        if (!this.moving) {
          const resourcesFloating = Date.now() - (this.floatResources ?? 0) < 2000;

          if ((this.elem?.settler || this.elem?.worker) && !resourcesFloating) {
            if (!this.elem?.building && this.elem?.harvesting) {
              this.showResources(this.px, this.py, this.elem?.owner);
            } else {
              this.showResourcesNearby();
            }
          }
        }
        this.hideBars();
      }
    } else {
      if (this.elem?.selected?.indic && this.selectIndic) {
        this.selectIndic.destroy();
        this.selectIndic = undefined;
      }
      this.hideMoveOptions();
      if (this.elem?.animation) {
        this.hideResources();
      }
      this.refreshBars();
    }
  }

  async showActionOptions() {
    if (this.hasMove() && !await this.manager.checkCondition(this.elem?.move?.disabled, this)) {
      this.addMoveOptions(this.elem?.move?.distance ?? 1, vec2(this.px, this.py));
    }
    if (this.hasAttack() && await this.canAttack()) {
      this.addAttackOptions(this.elem?.attack?.range ?? 1);
    }
  }

  hideMoveOptions() {
    if (this.moveOptions) {
      Object.values(this.moveOptions).forEach(moveOption => moveOption.destroy());
      delete this.moveOptions;
    }
    if (this.attackOptions) {
      Object.values(this.attackOptions).forEach(attackOption => attackOption.destroy());
      delete this.attackOptions;
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
      const existingMoveOption = this.moveOptions?.[`${from.x + dx}_${from.y + dy}`];
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

      const obj = new MoveOption(
        from.x + dx,
        from.y + dy,
        from,
        revealPotential + this.manager.countRevealPotential(from.x + dx, from.y + dy),
        movePoints,
        newDistanceTravelled,
        this.canLandOn(from.x + dx, from.y + dy),
      );
      obj.size.set(this.size.x, this.size.y);
      if (this.elem?.selected?.moveIndic) {
        obj.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.selected.moveIndic.animation));
      } else {
        obj.color = new Color(0, 0, 0, .3);
        obj.tileInfo = this.tileInfo;
      }
      if (!obj.canLand) {
        obj.color = new Color(0, 0, 0, 0);
      }
      const unit = this.manager.unitAt(from.x + dx, from.y + dy);
      if (unit) {
        obj.color = new Color(1, 0, 0, .5);
      }
      const offset = this.elem?.gameObject?.offset ?? [0, 0];
      this.addChild(obj, vec2((from.x + dx - this.px) - offset[0], (from.y + dy - this.py) - offset[1]));
      if (!this.moveOptions) {
        this.moveOptions = {};
      }
      this.moveOptions[`${from.x + dx}_${from.y + dy}`] = obj;
      froms.push([vec2(from.x + dx, from.y + dy), obj.canReveal, obj.distanceTravelled]);
      this.updated = false;
    });
    froms.forEach(([from, revealing, newDistanceTravelled]) => this.addMoveOptions(movePoints - 1, from, revealing, newDistanceTravelled));
  }

  addAttackOptions(range: number) {
    if (!range) {
      return;
    }
    for (let y = -range; y <= range; y++) {
      for (let x = -range; x <= range; x++) {
        if (this.canAttackAt(this.px + x, this.py + y)) {
          const obj = new AttackOption(this.px + x, this.py + y);
          obj.size.set(this.size.x, this.size.y);
          if (this.elem?.selected?.moveIndic) {
            obj.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.selected.moveIndic.animation));
          } else {
            obj.color = new Color(0, 0, 0, .3);
            obj.tileInfo = this.tileInfo;
          }
          const unit = this.manager.unitAt(this.px + x, this.py + y);
          if (unit) {
            obj.color = new Color(1, 0, 0, .5);
          }
          this.addChild(obj, vec2(x, y));
          if (!this.attackOptions) {
            this.attackOptions = {};
          }
          this.attackOptions[`${this.px + x}_${this.py + y}`] = obj;
          this.updated = false;
        }
      }
    }
  }

  getFrame(animInfo?: AnimationInfo) {
    if (!animInfo) {
      return 0;
    }
    const timeOffset = this.talkingTime ?? this.bornTime;
    const globalFrame = Math.floor((Date.now() + timeOffset) / (1000 / this.frameRate));
    return animInfo?.animation?.once ? Math.min(globalFrame, animInfo.tileInfos.length - 1) : globalFrame % (animInfo.tileInfos.length);
  }

  getTileInfoAnimate(animInfo: AnimationInfo) {
    const t = this.getFrame(animInfo);
    return animInfo?.tileInfos?.[t];
  }

  checkResourceCaps() {
    const elem = this.elem;
    if (!elem?.resourcesAccumulated) {
      return;
    }
    Object.entries(elem.resourcesAccumulated).forEach(([key, value]) => {
      const k = key as keyof Resources;
      const maxCapacity = this.resourceCapacity(k);
      if (value > maxCapacity) {
        if (!elem.resourcesCapped) {
          elem.resourcesCapped = {};
        }
        elem.resourcesCapped[k] = value;
      }
    });
  }

  calculateUnitResourcesRevenue() {
    const resources: Resources = {
      wheat: 0,
      wood: 0,
      trade: 0,
      gold: 0,
      brain: 0,
    };
    this.unitsSupported.forEach(unit => {
      const res = unit.calculateUnitResourcesRevenue();
      Object.entries(res).forEach(([key, value]) => {
        resources[key as keyof Resources] += value;
      });
    });
    Object.entries(resources).forEach(([key, value]) => {
      const k = key as keyof Resources;
      if (this.manager.scene.resources[k]?.global) {
        return;
      }
      resources[k] += value;
    });
    return resources;
  }

  accumulateResources(resources: Resources) {
    if (this.doomed) {
      return;
    }
    if (this.home) {
      this.home.accumulateResources(resources);
      return;
    }
    const elem = this.elem;
    if (!elem) {
      return;
    }
    Object.entries(resources).forEach(([key, value]) => {
      const k = key as keyof Resources;
      if (this.manager.scene.resources[k]?.global) {
        return;
      }
      if (!elem.resourcesAccumulated) {
        elem.resourcesAccumulated = {};
      }
      if (!elem.resourcesCapped?.[k]) {
        elem.resourcesAccumulated[k] = (elem.resourcesAccumulated[k] ?? 0) + value;
      }
    });
    if (elem.type === "house" && elem.resourcesAccumulated) {
      if (this.manager.isResearched("productivity", this.manager.getPlayer())) {
        elem.resourcesAccumulated.wood = (elem.resourcesAccumulated.wood ?? 0) + 1;
      }

      if ((elem.resourcesAccumulated.wheat ?? 0) >= this.nextLevelCost() && this.canUpdateLevel()) {
        elem.resourcesAccumulated.wheat = (elem.resourcesAccumulated.wheat ?? 0) - this.nextLevelCost();
        this.updateLevel((elem.level ?? 0) + 1);
        this.updated = false;
      }
    }
  }

  updateResource(resource: keyof Resources, value: number | ((value: number) => number)) {
    if (!this.elem) {
      return;
    }
    if (!this.elem.resourcesAccumulated) {
      this.elem.resourcesAccumulated = {};
    }
    const resObj = this.manager.getResourceType(resource);
    const previousVal = resObj?.global ? this.manager.getPlayerResource(resource, this.elem.owner ?? 0) : this.elem.resourcesAccumulated[resource] ?? 0;
    const val = typeof value === "function" ? value(previousVal) : value;
    if (resObj?.global) {
      if (this.elem.owner) {
        this.manager.updateResource(resource, val, this.elem.owner);
      }
      return;
    }
    this.elem.resourcesAccumulated[resource] = val;
    if (this.elem.resourcesCapped && val < this.resourceCapacity(resource)) {
      this.elem.resourcesCapped[resource] = 0;
    }
    this.updated = false;
  }

  async fixCows() {
    // cows number can't be higher than house level
    const cows = await this.countUnitSupport("cow");
    const maxCows = this.elem?.level ?? 0;
    if (cows > maxCows) {
      let toRemove = cows - maxCows;
      await this.manager.iterateRevealedCells(async (obj) => {
        if (toRemove <= 0) {
          return;
        }
        if (obj.elem?.name === "cow" && obj.home === this) {
          obj.doom(true);
          toRemove--;
        }
      });
    }
  }

  canUpdateLevel() {
    return this.elem?.type === "house" && (this.elem?.level ?? 0) < (this.elem?.maxLevel ?? 999);
  }

  async updateLevel(level: number) {
    if (this.elem?.type === "house") {
      this.elem.level = level;
      await this.fixCows();
      await this.refreshLabel();
      this.updated = false;
    }
  }

  nextLevelCost() {
    return this.resourceCapacity("wheat");
  }

  resourceCapacity(resource: keyof Resources) {
    const capacity = (this.elem?.level ?? 0) + 1;
    return capacity * 10;
  }

  async countUnitSupport(unit: string) {
    let count = 0;
    await this.manager.iterateRevealedCells(async (obj) => {
      if (obj.elem?.name === unit && obj.home === this) {
        count++;
      }
    });
    return count;
  }

  update() {
    super.update();
    if (this.manager.hud.touchCaptured) {
      return;
    }

    if (this.updated && !this.elem?.dynamic && !this.elem?.spread?.moving && !this.doomed && Date.now() - this.bornTime < 1000 && !this.floatResources) {
      return;
    }
    if (!this.visible) {
      // return;
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
    Object.values(this.moveOptions ?? {}).forEach(moveOption => {
      if (moveOption.animation) {
        moveOption.tileInfo = this.getTileInfoAnimate(moveOption.animation);
      }
    });
    Object.values(this.attackOptions ?? {}).forEach(option => {
      if (option.animation) {
        option.tileInfo = this.getTileInfoAnimate(option.animation);
      }
    });
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
    const talking = this.talkingTime && Date.now() < this.talkingTime;
    const animInfo = this.attackAnimationInfo && this.attackTarget
      ? this.attackAnimationInfo
      : this.harvestAnimationInfo && this.elem?.harvesting
        ? this.harvestAnimationInfo
        : this.moveAnimationInfo && (dx || dy)
          ? this.moveAnimationInfo
          : this.selectedAnimationInfo && this.isRevealed() && (this.manager.selected === this || talking)
            ? this.selectedAnimationInfo
            : this.hoveredAnimationInfo && this.manager.hovering(this)
              ? this.hoveredAnimationInfo : this.animationInfo;

    if (animInfo === this.animationInfo) {
      if (Math.random() < .005) {
        this.talkingTime = Date.now() + Math.random() * 3000;
      }
    }

    if (animInfo) {
      this.tileInfo = this.getTileInfoAnimate(animInfo);
    }

    if (dx || dy) {
      const doMove = this.attackTarget || !animInfo?.airFramesSet || animInfo.airFramesSet?.has(this.getFrame(animInfo));
      if (doMove) {
        const immediate = !this.manager.isRevealed(this.px, this.py) && !this.manager.isRevealed(this.px + dx, this.py + dy);
        this.moving = true;
        if (dx * dx + dy * dy > .01) {
          const dist = this.elem?.gameObject?.speed ? Math.sqrt(dx * dx + dy * dy) : 1;
          const speed = immediate ? dist : Math.min(dist, this.attackTarget ? .2 : this.elem?.gameObject?.speed ?? .5);
          this.pos.set(this.pos.x + dx / dist * speed, this.pos.y + dy / dist * speed);
        } else {
          this.pos.set(this.px + offset[0], this.py + offset[1]);
        }
      }
    } else {
      if (this.attackTarget) {
        if (this.projectile) {
          this.projectile.move();
          if (this.projectile.landed()) {
            const projectile = this.projectile;
            this.projectile = undefined;
            projectile.destroy();
            this.finishAttack(this.attackTarget, true);
          }
        } else {
          this.finishAttack(this.attackTarget);
        }
      } else if (this.moveQueue?.length) {
        const dest = this.moveQueue.pop()!;
        this.moveUnitTo(dest.x, dest.y);
      } else if (this.moving) {
        this.moving = false;
        if (this.onDone) {
          const onDone = this.onDone;
          this.onDone = undefined;
          onDone(this);
        } else if (!this.hasPendingActions) {
          if (!this.retaliating) {
            this.spendMove();
          } else {
            this.retaliating = false;
          }
        }
      }
    }

    if (this.elem?.type === "cursor" && !this.manager.inUI) {
      if (mouseWasReleased(0)) {
        this.manager.mousePosDown = undefined;
        this.manager.onTap(this.px, this.py, mousePos.x, mousePos.y);
      }
    }

    const coLayers = this.manager.scene?.colayers;
    let renderOrder = Math.round(-this.py) + (this.manager.scene.layers?.[this.elem?.type ?? ""] ?? 100) * 10000 + (coLayers?.[this.elem?.type ?? ""] ?? 0) * .001;
    if (this.renderOrder !== renderOrder || !this.updated) {
      this.renderOrder = renderOrder;
      this.decors.forEach((decor) => {
        decor.renderOrder = this.renderOrder + (this.elem?.spread?.behind ? -.1 : .1);
      });
      if (this.moveOptions) {
        Object.values(this.moveOptions).forEach(moveOption => moveOption.renderOrder = this.renderOrder - .1);
      }
      if (this.attackOptions) {
        Object.values(this.attackOptions).forEach(option => option.renderOrder = this.renderOrder - .1);
      }
      if (this.projectile) {
        this.projectile.renderOrder = this.renderOrder + .1;
      }

      if (this.shadow) {
        this.shadow.renderOrder = this.renderOrder - .1;
      }
      if (this.hoverIndic) {
        this.hoverIndic.renderOrder = this.renderOrder - .1;
      }
      this.labels?.forEach(label => label.renderOrder = this.renderOrder + .2);
      this.resources.forEach((resource) => resource.renderOrder = 100000 + (resource.tileInfo ? .1 : -.1));
      this.resourceBars.forEach((resource) => resource.renderOrder = 100000 + (resource.tileInfo ? .1 : -.1));
    }

    if (this.elem?.spread?.moving && Math.random() < this.elem.spread.moving) {
      this.decors.forEach((decor) => {
        const time = Date.now() - decor.bornTime;
        const dx = Math.sin(time / 5000 * decor.motionX) * .2;
        const dy = Math.cos(time / 5000 * decor.motionY) * .2;
        decor.localPos.set(decor.initialPos.x + dx, decor.initialPos.y + dy);
      });
    }

    if (this.elem?.clearCloud && !this.clearedCloud) {
      const expansion = this.elem?.type === "house" && this.manager.isResearched("expansion", this.elem?.owner ?? 0);
      const SIZE = expansion ? 2 : 1, LIMIT = 2;
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
        if (this.manager.selected === this) {
          this.showResourcesNearby();
        }
      } else {
        this.resources.forEach(res => res.localPos.y += .005);
      }
    }

    if (this.damageTime) {
      const timeLeft = this.damageTime - Date.now();
      if (timeLeft >= 0) {
        this.angle = Math.sin(Date.now() / 10) * timeLeft / 5000;
        this.color = new Color(2, 0, 0, timeLeft / 1000);
      } else {
        this.damageTime = undefined;
        this.angle = 0;
        this.color = new Color(1, 1, 1, 1);
      }
    }
  }

  get home(): GameObject | undefined {
    if (this.elem?.home && !this.elem?.building) {
      return this.manager.grid[GameObject.getTag("house", this.elem.home[0], this.elem.home[1])] ?? undefined;
    }
    return undefined;
  }

  doomed?: boolean = false;
  doom(immediate?: boolean) {
    if (this.doomed) {
      return;
    }
    this.doomed = true;
    if (this.home) {
      this.home.unitsSupported.delete(this);
    }
    this.size.set(0, 0);
    const destroy = () => {
      if (this.manager.grid[this.getTag()] === this) {
        delete this.manager.grid[this.getTag()];
      }

      this.decors.forEach((decor) => {
        decor.destroy();
      });
      this.labels?.forEach(label => label.destroy());
      this.resources.forEach(resource => resource.destroy());
      this.resourceBars.forEach(bar => bar.destroy());
      if (this.shadow) {
        this.shadow.destroy();
      }
      this.destroy();
    };

    const DURATION = immediate ? 10 : 300;
    setTimeout(destroy, DURATION * 2);
    if (!immediate) {
      this.decors.forEach((decor) => {
        decor.doomTime = Date.now() + DURATION * Math.random();
      });
    }
  }

  updateLabel(showLabel: boolean) {
    if (showLabel) {
      this.refreshLabel();
      this.refreshBars();
      this.refreshAlpha();
    } else {
      this.labels.forEach(label => label.destroy());
      this.labels.length = 0;
      this.resourceBars.forEach(bar => bar.destroy());
      this.resourceBars.length = 0;
      this.color = new Color(1, 1, 1, 1);
    }
  }

  getSurroundingCells(vectorCondition: (cell: Vector2) => boolean) {
    const set: Set<Vector2> = new Set();
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const vec = vec2(this.px + x, this.py + y);
        if (vectorCondition(vec)) {
          set.add(vec);
        }
      }
    }
    return set;
  }

  findNearbyFoe(distance: number = 1) {
    return this.findNearby((cell) => {
      return cell.elem?.type === "unit" && cell.elem?.owner !== this.elem?.owner;
    }, distance);
  }

  async findNearby(cellCondition: (cell: GameObject) => boolean, distance: number = 1) {
    const set: Set<GameObject> = new Set();
    for (let y = -distance; y <= distance; y++) {
      for (let x = -distance; x <= distance; x++) {
        if (x === 0 && y === 0) {
          continue;
        }
        await this.manager.iterateGridCell(this.px + x, this.py + y, async (cell) => {
          if (cellCondition(cell)) {
            set.add(cell);
          }
        });
      }
    }
    return set;
  }

  finalDestination(): Vector2 {
    return this.moveQueue?.[0] ?? vec2(this.px, this.py);
  }

  canAfford(resources?: Resources): boolean {
    if (!resources) {
      return true;
    }
    return Object.entries(resources).every(([key, value]) => {
      const res = this.manager.getResourceType(key as keyof Resources);
      if (res?.global) {
        return this.manager.getPlayerResource(key as keyof Resources, this.elem?.owner ?? 0) >= value;
      } else {
        return (this.elem?.resourcesAccumulated?.[key as keyof Resources] ?? 0) >= value;
      }
    });
  }

  turnAround() {
    if (!this.elem?.gameObject) {
      return;
    }
    this.elem.gameObject.lastDx = -(this.elem.gameObject.lastDx ?? 1);
    this.updateSize();
  }

  spend(resources?: Resources) {
    if (!resources) {
      return;
    }
    const resourcesAccumulated = this.elem?.resourcesAccumulated;
    Object.entries(resources).forEach(([key, value]) => {
      const k = key as keyof Resources;
      const res = this.manager.getResourceType(k);
      if (res?.global) {
        this.manager.updateResource(k, amount => Math.max(0, amount - value), this.elem?.owner ?? 0);
      } else {
        if (resourcesAccumulated?.[k]) {
          resourcesAccumulated[k] = Math.max(0, resourcesAccumulated[k] - value);
        }
      }
    });
  }

  attack(target: GameObject, retaliationDamage?: number) {
    if (!target || target.elem?.owner === this.elem?.owner) {
      return;
    }
    this.attackTarget = target;
    this.attackOrigin = vec2(this.px, this.py);
    this.px = target.px;
    this.py = target.py;
    this.retaliationDamage = retaliationDamage;
  }

  attackRange(target: GameObject, retaliationDamage?: number) {
    if (!target || target.elem?.owner === this.elem?.owner) {
      return;
    }
    this.attackTarget = target;
    this.attackOrigin = vec2(this.px, this.py);
    this.retaliationDamage = this.retaliationDamage;
    if (this.projectile) {
      this.projectile.destroy();
    }
    this.projectile = new Projectile(this.pos, target.pos, .05);
    if (this.elem?.attack?.projectile) {
      this.projectile.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.attack.projectile));
    }
  }

  finishAttack(target: GameObject, done: boolean = false) {
    const targetX = target.px, targetY = target.py;
    const { retaliation, death } = !this.retaliating
      ? target.takeDamageAndCheckDeath(this.elem?.attack?.damage ?? 1, this)
      : target.takeDirectDamageAndCheckDeath(this.retaliationDamage);
    this.px = this.attackOrigin?.x ?? this.px;
    this.py = this.attackOrigin?.y ?? this.py;
    this.attackTarget = undefined;
    this.attackOrigin = undefined;
    if (!this.retaliating) {
      this.spendAttack();
      if (death) {
        if (!this.elem?.attack?.range) {
          this.setPosition(targetX, targetY);
        }
        this.doneMoving();
      } else {
        // check distance
        const dx = this.px - targetX;
        const dy = this.py - targetY;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        if (distance <= (target?.elem?.attack?.range ?? 1)) {
          //  retaliate
          this.hasPendingActions = true;
          this.onDone = (self: GameObject) => {
            setTimeout(() => {
              target.retaliating = true;
              target.onDone = (target: GameObject) => {
                target.retaliating = false;
                self.hasPendingActions = false;
                self.doneMoving();
              };
              const rangedAttack = target?.elem?.attack?.range;
              if (rangedAttack) {
                target.attackRange(self, retaliation);
              } else {
                target.attack(self, retaliation);
              }
            }, 1000);
          };
          if (done) {
            const onDone = this.onDone;
            this.onDone = undefined;
            onDone(this);
          }
        } else {
          this.doneMoving();
        }
      }
    } else {
      target.doneMoving();  //  give back control to target
    }
  }

  getDefenseBonus() {
    let bonus = 1;
    this.manager.iterateGridCell(this.px, this.py, async (cell) => {
      if (cell.elem?.defenseBonus) {
        bonus *= cell.elem.defenseBonus;
      }
    });
    return bonus;
  }

  healthPercent() {
    return this.elem?.hitpoints ? this.elem.hitpoints / (this.elem.maxHitPoints ?? 1) : 1;
  }

  getDefense() {
    return this.elem?.attack?.defense ?? 1;
  }

  takeDirectDamageAndCheckDeath(damage: number = 0) {
    if (this.elem) {
      this.damageTime = Date.now() + damage * 100;
      this.elem.hitpoints = (this.elem.hitpoints ?? 1) - damage;
      if (this.elem.hitpoints > 0) {
        this.refreshLabel();
      } else {
        this.doom(true);
        return { retaliation: 0, death: true };
      }
    }
    return { retaliation: 0, death: false };
  }

  takeDamageAndCheckDeath(attack: number, attacker: GameObject) {
    // attackForce = attacker.attack * (attacker.health / attacker.maxHealth)
    // defenseForce = defender.defense * (defender.health / defender.maxHealth) * defenseBonus 
    // totalDamage = attackForce + defenseForce 
    // attackResult = roundUp((attackForce / totalDamage) * attacker.attack * 4.5) 
    // defenseResult = roundDown((defenseForce / totalDamage) * defender.defense * 4.5)    

    if (this.elem) {
      const attackForce = attack * attacker.healthPercent();
      const defenseForce = this.getDefense() * this.healthPercent() * this.getDefenseBonus();
      const totalDamage = attackForce + defenseForce;
      const attackResult = Math.ceil((attackForce / totalDamage) * attack * 4.5);
      const defenseResult = Math.ceil((defenseForce / totalDamage) * this.getDefense() * 4.5);

      this.damageTime = Date.now() + attackResult * 100;
      this.elem.hitpoints = (this.elem.hitpoints ?? 1) - attackResult;
      if (this.elem.hitpoints > 0) {
        this.refreshLabel();
        return { retaliation: defenseResult, death: false };
      } else {
        this.doom(true);
        return { retaliation: 0, death: true };
      }
    }
    return { retaliation: 0, death: false };
  }

  detailsVisible: boolean = true;
  showDetails(visible: boolean) {
    if (visible !== this.detailsVisible) {
      this.detailsVisible = visible;
      this.shadow?.setVisible(visible);
      this.labels.forEach(label => label.setVisible(visible));
      this.resources.forEach(resource => resource.setVisible(visible));
      this.resourceBars.forEach(bar => bar.setVisible(visible));
      this.hoverIndic?.setVisible(visible);
      this.decors.forEach(decor => decor.setVisible(visible));
      Object.values(this.moveOptions ?? {}).forEach(moveOption => moveOption.setVisible(visible));
      Object.values(this.attackOptions ?? {}).forEach(option => option.setVisible(visible));
    }
  }
}
