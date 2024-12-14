import { cameraPos, cameraScale, EngineObject, mousePos, mouseWasPressed, mouseWasReleased, setCameraPos, setCameraScale, vec2, Vector2, LittleJS } from './lib/littlejs';

import { AnimationManager } from "./animation/animation-manager";
import type { Elem } from "./definition/elem";
import type { Scene } from "./definition/scene";
import { GameObject } from "./game-object";
import { Hud } from "./hud";
import type { Condition } from "./definition/condition";
import type { Resources } from "./definition/resources";
import type { Reward } from './definition/reward';


interface Entry {
  gameObject: Set<GameObject>;
  updateTime?: number;
}

export class Manager {
  readonly entries: Map<Elem, Entry> = new Map();
  readonly animation: AnimationManager;
  readonly grid: Record<string, GameObject> = {};
  readonly revealed: Set<string> = new Set();
  cursor?: GameObject;
  selected?: GameObject;
  private hovered?: GameObject;
  mousePosDown?: Vector2;
  readonly camShift = vec2(0, 0);
  shifting = 0;
  doneShifting = 0;
  hud;
  worldChanged = true;
  inUI?: boolean;
  resourceIcons: EngineObject[] = [];
  autoEndTurn = true;
  showLabels = true;

  constructor(readonly scene: Scene) {
    this.animation = new AnimationManager(scene.animations);
    this.hud = new Hud(this);
    if (scene.scale) {
      setCameraScale(scene.scale);
    }

    document.addEventListener("wheel", (e) => {
      this.camShift.x += e.deltaX / cameraScale;
      this.camShift.y -= e.deltaY / cameraScale;
      e.preventDefault();
    }, { passive: false });
    this.hud.initialize();

    window.addEventListener("blur", (e) => {
      this.hud.ui.classList.add("hidden");
      this.showLabels = false;
      this.setSelection(undefined);
      this.cursor?.hide();
      this.updateLabels();
      LittleJS.overlayCanvas.style.cursor = "default";
    });
    window.addEventListener("focus", (e) => {
      this.hud.ui.classList.remove("hidden");
      this.showLabels = true;
      this.refreshCursor();
      this.updateLabels();
      LittleJS.overlayCanvas.style.cursor = "";
    });
  }

  updateLabels() {
    this.iterateRevealedCells((gameObject) => {
      gameObject.updateLabel(this.showLabels);
    });
  }

  refresh() {
    this.initializeTurn();
    this.scene.elems.forEach((elem) => {
      this.sanitizeElem(elem);
      this.refreshElem(elem);
    });
    this.shiftCamera();
    if (this.worldChanged) {
      this.fixWorld();
      this.worldChanged = false;
    }
    this.hud.refresh();
  }

  initializeTurn() {
    if (!this.scene.turn) {
      this.scene.turn = {
        player: 1,
        turn: 1,
      };
    }
  }

  iterateGridCell(x: number, y: number, callback: (gameObject: GameObject) => void) {
    Object.keys(this.scene.layers).forEach((layer) => {
      const tag = `${layer}_${x}_${y}`;
      const gameObject = this.grid[tag];
      if (gameObject) {
        callback(gameObject);
      }
    });
  }

  getRevealedCells() {
    const cells: Vector2[] = [];
    this.revealed.forEach((tag) => {
      const [x, y] = tag.split("_").map(Number);
      cells.push(vec2(x, y));
    });
    return cells;
  }

  iterateRevealedCells(callback: (gameObject: GameObject) => void) {
    const cells = this.getRevealedCells();
    for (const cell of cells) {
      Object.keys(this.scene.layers).forEach((layer) => {
        const tag = `${layer}_${cell.x}_${cell.y}`;
        const gameObject = this.grid[tag];
        if (gameObject) {
          callback(gameObject);
        }
      });
    }
  }

  fixWorld() {
    Object.entries(this.grid).forEach(([tag, gameObject]) => {
      if (gameObject.elem?.condition) {
        let conditionMet = false;
        if (gameObject.elem.condition.tile) {
          const tiles = Array.isArray(gameObject.elem.condition.tile) ? gameObject.elem.condition.tile : [gameObject.elem.condition.tile];
          tiles.forEach((tile) => {
            this.iterateGridCell(gameObject.px, gameObject.py, (target) => {
              if (target?.elem?.name === tile) {
                conditionMet = true;
              }
            });
          });
        }
        let violationMet = false;
        if (gameObject.elem.condition.noTile) {
          const tiles = Array.isArray(gameObject.elem.condition.noTile) ? gameObject.elem.condition.noTile : [gameObject.elem.condition.noTile];
          tiles.forEach((tile) => {
            Object.keys(this.scene.layers).forEach((layer) => {
              const tag = `${layer}_${gameObject.px}_${gameObject.py}`;
              const target = this.grid[tag];
              if (target?.elem?.name === tile) {
                violationMet = true;
              }
            });
          });
        }
        if (gameObject.elem.condition.zeroUnit) {
          const tag = `unit_${gameObject.px}_${gameObject.py}`;
          const target = this.grid[tag];
          if (target) {
            violationMet = true;
          }
        }
        if (!conditionMet || violationMet) {
          gameObject.doom(true);
          delete this.grid[tag];
        }
      }
    });
  }

  private shiftCamera() {
    if (this.inUI) {
      return;
    }
    if (!this.mousePosDown && mouseWasPressed(0)) {
      this.mousePosDown = vec2(mousePos.x, mousePos.y);
    }
    if (this.mousePosDown && mouseWasReleased(0)) {
      this.mousePosDown = undefined;
      if (!this.selected) {
        this.refreshCursor();
      }
      if (this.shifting) {
        this.shifting = 0;
        this.doneShifting = Date.now();
        this.refreshCursor();
      }
    }

    if (this.mousePosDown) {
      const dx = mousePos.x - this.mousePosDown.x;
      const dy = mousePos.y - this.mousePosDown.y;
      if (dx || dy) {
        const mul = 10;
        this.camShift.set(this.camShift.x - dx * mul, this.camShift.y - dy * mul);
        this.mousePosDown.set(mousePos.x, mousePos.y);
        this.cursor?.hide();
        this.shifting = Date.now();
        this.doneShifting = 0;
      }
    }

    const dx = this.camShift.x - cameraPos.x;
    const dy = this.camShift.y - cameraPos.y;
    const mul = .1;
    setCameraPos(cameraPos.set(Math.round((cameraPos.x + dx * mul) * cameraScale) / cameraScale, Math.round((cameraPos.y + dy * mul) * cameraScale) / cameraScale));
  }

  defineElem(elem: Elem) {
    if (elem.definition) {
      const defintion = this.scene.definitions.find(def => def.name === elem.definition);
      if (defintion) {
        Object.entries(defintion).forEach(([key, value]) => {
          const e = elem as Record<string, any>;
          if (e[key] === undefined) {
            e[key] = JSON.parse(JSON.stringify(value));
          }
        });
        delete elem.definition;
      }
    }
  }

  private refreshElem(elem: Elem) {
    this.defineElem(elem);
    if (elem.gameObject) {
      const entry = this.ensureElem(elem);
      if (entry.updateTime !== elem.lastUpdate) {
        entry.gameObject?.forEach(gameObject => {
          gameObject.refresh(elem);
        });
        entry.updateTime = elem.lastUpdate;
      }
    } else {
      const entry = this.entries.get(elem);
      if (entry) {
        entry.gameObject?.forEach(gameObject => gameObject.refresh(elem));
        entry.gameObject.clear();
        this.entries.delete(elem);
      }
    }
  }

  private ensureElem(elem: Elem): Entry {
    let entry = this.entries.get(elem);
    if (!entry) {
      entry = {
        gameObject: new Set(),
      };
      this.entries.set(elem, entry);
      if (elem.gameObject && !entry.gameObject.size) {
        const chance = elem.group?.chance ?? 1;
        const [col, row] = elem.group?.grid ?? [1, 1];
        for (let x = 0; x < col; x++) {
          for (let y = 0; y < row; y++) {
            if (Math.random() <= chance) {
              const xx = x - Math.floor(col / 2);
              const yy = y - Math.floor(row / 2);
              if ((elem.type === "decor" || elem.water) && Math.abs(xx) <= 1 && Math.abs(yy) <= 1) {
                continue;
              }

              if (elem.type === "cloud" && this.revealed.has(`${xx}_${yy}`)) {
                continue;
              }
              const gameObject = new GameObject(this, vec2(xx, yy));
              entry.gameObject.add(gameObject);
              gameObject.refresh(elem);
            }
          }
        }
      }
    }
    return entry;
  }

  private sanitizeElem(elem: Elem) {
    if (!elem.lastUpdate) {
      elem.lastUpdate = Date.now();
    }
    if (elem.gameObject) {
      if (!elem.gameObject.pos) {
        elem.gameObject.pos = [0, 0];
      }
      if (!elem.gameObject.size) {
        elem.gameObject.size = [1, 1];
      }
    }
  }

  countRevealPotential(x: number, y: number) {
    let count = 0;
    for (let xx = -1; xx <= 1; xx++) {
      for (let yy = -1; yy <= 1; yy++) {
        if (this.grid[`tile_${x + xx}_${y + yy}`] && !this.revealed.has(`${x + xx}_${y + yy}`)) {
          count++;
        }
      }
    }
    return count;
  }

  getResources(x: number, y: number) {
    const resources: Elem["resourcesProduced"] = {};
    Object.keys(this.scene.layers).forEach((layer) => {
      const tag = `${layer}_${x}_${y}`;
      const gameObject = this.grid[tag];
      if (gameObject && !gameObject?.doomed) {
        resources.wheat = (resources.wheat ?? 0) + (gameObject.elem?.resourcesProduced?.wheat ?? 0);
        resources.wood = (resources.wood ?? 0) + (gameObject.elem?.resourcesProduced?.wood ?? 0);
        resources.brain = (resources.brain ?? 0) + (gameObject.elem?.resourcesProduced?.brain ?? 0);
        resources.gold = (resources.gold ?? 0) + (gameObject.elem?.resourcesProduced?.gold ?? 0);
        resources.trade = (resources.trade ?? 0) + (gameObject.elem?.resourcesProduced?.trade ?? 0);
      }
    });
    return Math.max(resources.wheat ?? 0, 0)
      + Math.max(resources.wood ?? 0, 0)
      + Math.max(resources.brain ?? 0, 0)
      + Math.max(resources.gold ?? 0, 0)
      + Math.max(resources.trade ?? 0, 0)
      ? resources : undefined;
  }

  clearCloud(x: number, y: number) {
    const tag = `${x}_${y}`;
    if (this.revealed.has(tag)) {
      return;
    }
    this.revealed.add(tag);
    const gameObject = this.grid[`cloud_${x}_${y}`];
    if (gameObject) {
      gameObject.doom();
      const elem = gameObject.elem;
      if (elem) {
        const entry = this.entries.get(elem);
        if (entry) {
          entry.gameObject.delete(gameObject);
        }
      }
      delete this.grid[tag];
    }
  }

  onCursorMove(x: number, y: number) {
  }

  onTap(x: number, y: number, mouseX: number, mouseY: number) {
    if (Date.now() - this.doneShifting < 100) {
      return;
    }
    if (this.inUI) {
      return;
    }
    if (this.selected?.canMoveTo(x, y) && this.selected.hasMoveOptionToLandOn(x, y)) {
      this.selected.moveTo(x, y);
      return;
    }
    let unit: GameObject | undefined = this.grid[`unit_${x}_${y}`];
    if (!unit?.canAct()) {
      unit = undefined;
    }
    const house = this.grid[`house_${x}_${y}`];
    const nextSelection = unit === this.selected ? house : unit;
    this.setSelection(this.selected === nextSelection ? undefined : nextSelection);
  }

  setSelection(gameObject: GameObject | undefined) {
    if (this.selected === gameObject) {
      return;
    }
    const previousSelected = this.selected;
    this.selected = gameObject;
    previousSelected?.onSelectChange();
    this.selected?.onSelectChange();
    this.hud.showSelected(this.selected);
    if (!this.shifting && this.selected) {
      this.makeWithinView(this.selected);
    }
  }

  makeWithinView(gameObject: GameObject) {
    const finalDestination = gameObject.finalDestination();
    const dx = finalDestination.x - this.camShift.x;
    const dy = finalDestination.y - this.camShift.y;
    const diffX = 4, diffY = 2;
    if (Math.abs(dx) > diffX) {
      this.camShift.set(finalDestination.x, this.camShift.y);
    }
    if (Math.abs(dy) > diffY) {
      this.camShift.set(this.camShift.x, finalDestination.y);
    }
  }

  hovering(gameObject: GameObject) {
    if (this.inUI) {
      return false;
    }
    return gameObject.px === this.cursor?.px && gameObject.py === this.cursor?.py;
  }

  refreshCursor() {
    if (this.hovered || this.inUI) {
      this.cursor?.hide();
    } else {
      this.cursor?.show();
    }
  }

  setHovered(gameObject: GameObject | undefined) {
    if (this.hovered === gameObject) {
      return;
    }
    this.hovered = gameObject;
    this.refreshCursor();
  }

  checkCondition(condition?: Condition, obj?: GameObject) {
    if (!condition) {
      return null;
    }
    if (condition.levelBelowEqual && (obj?.elem?.level ?? 0) <= condition.levelBelowEqual[0]) {
      return condition.levelBelowEqual[1] ?? "true";
    }
    if (condition.occupied && obj) {
      const tag = GameObject.getTag(condition.occupied[0], obj?.px, obj?.py);
      if (this.grid[tag]) {
        return condition.occupied[1] ?? "true";
      }
    }
    if (condition.harvesting && obj && obj.elem?.harvesting) {
      return "true";
    }
    if (condition.notHarvesting && obj && !obj.elem?.harvesting) {
      return "true";
    }
    if (obj) {
      let proxyCheck: string | null = null;
      const PROXY_CHECK = [condition.proximity, condition.nonProximity];
      PROXY_CHECK.forEach((check) => {
        if (check && !proxyCheck) {
          const [item, message] = check;
          if (item) {
            const nearby = obj.findNearby(obj => obj.elem?.name === item);
            if (condition.proximity && nearby.size) {
              proxyCheck = message ?? "true";
            }
            if (condition.nonProximity && !nearby.size) {
              proxyCheck = message ?? "true";
            }
          }
        }
      });
      if (proxyCheck) {
        return proxyCheck;
      }
    }
    if (condition.cannotAct) {
      return !obj?.canAct() ? condition.cannotAct[1] : null;
    }
    if (condition.unitLimit) {
      const level = obj?.elem?.level ?? 0;
      const [unit, message] = condition.unitLimit;
      const support = obj?.countUnitSupport(unit);
      if (support && support >= level) {
        return message ?? "true";
      }
    }
    return null;
  }

  gotoNextTurn() {
    // Increase turn count
    if (this.scene.turn) {
      if (this.scene.turn.player < this.scene.players.length) {
        this.scene.turn.player++;
      } else {
        this.scene.turn.player = 1;
        this.scene.turn.turn++;
      }
      this.collectResources(this.scene.turn.player);
      this.giveUnitsTurns();
      this.selectNext();
    }

    this.hud.updated = false;
  }

  giveUnitsTurns() {
    this.iterateRevealedCells((gameObject) => {
      if (gameObject.elem?.owner === this.scene.turn?.player) {
        gameObject.giveTurn();
      }
    });
  }

  calculateRevenue(player: number) {
    const playerResources = this.scene.players[player - 1]?.resources;
    if (!playerResources) {
      return 0;
    }
    let trade = 0;
    const visited = new Set<string>();
    this.iterateRevealedCells((gameObject) => {
      const elem = gameObject.elem;
      if (elem?.owner === player && elem.harvesting) {
        if (!visited.has(`${gameObject.px}_${gameObject.py}`)) {
          visited.add(`${gameObject.px}_${gameObject.py}`);
          const resources = this.getResources(gameObject.px, gameObject.py);
          if (resources) {
            trade += resources.trade ?? 0;
          }
        }
      }
    });
    return trade;
  }

  collectResources(player: number) {
    const playerResources = this.scene.players[player - 1]?.resources;
    if (!playerResources) {
      return;
    }
    this.iterateRevealedCells((gameObject) => {
      const elem = gameObject.elem;
      if (elem?.owner === player && elem.harvesting) {
        const resources = this.getResources(gameObject.px, gameObject.py);
        if (resources) {
          gameObject.showResources(gameObject.px, gameObject.py, player, true);
          gameObject.accumulateResources(resources);
          delete elem.lastUpdate;
        }
      }
    });
    // cap resources
    this.iterateRevealedCells((gameObject) => {
      const elem = gameObject.elem;
      if (elem?.owner === player && elem.harvesting) {
        gameObject.checkResourceCaps();
      }
    })

    //  Save global resources
    const globalResources = this.calculateResourceRevenue(player);
    Object.entries(globalResources).forEach(([resource, value]) => {
      const r = resource as keyof Resources;
      playerResources[r] = (playerResources[r] ?? 0) + value;
    });

    this.hud.updated = true;
  }

  checkForAnyMove() {
    //  check if any unit can move
    let anyMove = false;
    this.iterateRevealedCells((gameObject) => {
      if (gameObject.elem?.owner === this.scene.turn?.player && gameObject.canAct()) {
        if (gameObject.elem?.type === "unit"
          && !gameObject.elem?.harvesting) {
          anyMove = true;
        } else if (gameObject?.elem?.type === "house"
          && (gameObject.canAffordMoreHarvester() || gameObject.resourceMaxedOut())) {
          anyMove = true;
        }
      }
    });
    if (!anyMove) {
      if (this.autoEndTurn) {
        this.hud.flashEndTurn(true);
        setTimeout(() => {
          this.gotoNextTurn();
        }, 500);
      } else {
        this.hud.flashEndTurn();
      }
    }
  }

  calculateResourceRevenue(player: number) {
    const revenue = this.calculateRevenue(player);
    const RESOURCES: (keyof Resources)[] = (Object.keys(this.scene.resources) as (keyof Resources)[])
      .filter(resource => !this.scene.resources[resource]?.hidden && this.scene.resources[resource]?.global)
      .sort((a, b) => a.localeCompare(b));
    const resources: Record<keyof Resources, number> = {
      wheat: 0,
      wood: 0,
      gold: 0,
      brain: 0,
      trade: 0
    };
    RESOURCES.forEach((resource, index) => {
      let taxValue = this.scene.players[player - 1].tax ?? 0;
      let revenueValue = Math.round(revenue * taxValue / 100);
      if (index === 0) {
        taxValue = 100 - taxValue;
        revenueValue = revenue - revenueValue;
      }
      resources[resource] = revenueValue;
    });
    return resources;
  }

  selectNext() {
    const cellsRotation: GameObject[] = [];
    this.iterateRevealedCells((gameObject) => {
      let include = false;
      if (this.selected === gameObject) {
        include = true;
      } else if (gameObject.elem?.owner === this.scene.turn?.player
        && gameObject.canAct()) {
        if (gameObject.elem?.type === "unit"
          && !gameObject.elem?.harvesting) {
          include = true;
        } else if (gameObject?.elem?.type === "house"
          && (gameObject.canAffordMoreHarvester() || gameObject.resourceMaxedOut())) {
          include = true;
        }
      }
      if (include) {
        cellsRotation.push(gameObject);
      }
    });
    const currentIndex = this.selected ? cellsRotation.indexOf(this.selected) : -1;
    // rotate cells
    let nextIndex = (currentIndex + 1) % cellsRotation.length;
    this.setSelection(this.selected === cellsRotation[nextIndex] ? undefined : cellsRotation[nextIndex]);
  }

  unitAt(x: number, y: number): GameObject | undefined {
    return this.grid[`unit_${x}_${y}`];
  }

  houseAt(x: number, y: number): GameObject | undefined {
    return this.grid[`house_${x}_${y}`];
  }

  updateResource(resource: keyof Resources, value: number | ((value: number) => number), player: number) {
    const val = typeof value === "function" ? value(this.scene.players[player - 1].resources[resource] ?? 0) : value;
    this.scene.players[player - 1].resources[resource] = val;
    this.hud.updated = true;
  }

  findEmptySpotsAround(x: number, y: number) {
    const emptySpots: Vector2[] = [];
    for (let xx = -1; xx <= 1; xx++) {
      for (let yy = -1; yy <= 1; yy++) {
        if (xx || yy) {
          const tag = GameObject.getTag("unit", x + xx, y + yy);
          if (!this.grid[tag]) {
            emptySpots.push(vec2(x + xx, y + yy));
          }
        }
      }
    }
    return emptySpots;

  }

  unlockRewards(obj: GameObject, rewards?: Reward[]) {
    if (rewards) {
      rewards.forEach((reward) => {
        if (reward.gold) {
          const [min, max] = reward.gold;
          const gold = Math.floor(Math.random() * (max - min + 1) + min);
          obj.updateResource("gold", g => g + gold);
        }
        if (reward.invention) {
          //  invention
          console.log("invention", reward.invention);
        }
        if (reward.spawnFoes) {
          const emptySpots: Vector2[] = this.findEmptySpotsAround(obj.px, obj.py);
          const { count, element } = reward.spawnFoes;
          const actualCount = Math.min(emptySpots.length, Math.floor(Math.random() * (count[1] - count[0] + 1) + count[0]));
          emptySpots.sort(() => Math.random() - .5);
          for (let i = 0; i < actualCount; i++) {
            const spot = emptySpots[i];
            this.addSceneElemAt(element, spot.x, spot.y);
          }
        }
        if (reward.unit) {
          const emptySpots: Vector2[] = this.findEmptySpotsAround(obj.px, obj.py);
          if (emptySpots.length) {
            const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            this.addSceneElemAt(reward.unit, spot.x, spot.y, {
              owner: obj?.elem?.owner
            });
          }
        }
      });
    }
  }

  addSceneElemAt(elem: Elem, x: number, y: number, config: Partial<Elem> = {}) {
    const tag = GameObject.getTag(elem.type, x, y);
    if (this.grid[tag]) {
      return;
    }
    const newElem = JSON.parse(JSON.stringify(elem));
    newElem.gameObject = newElem.gameObject ?? {};
    newElem.gameObject.pos = [x, y];
    Object.assign(newElem, config);
    this.scene.elems.push(newElem);
  }
}
