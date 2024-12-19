import { cameraPos, cameraScale, EngineObject, mousePos, mouseWasPressed, mouseWasReleased, setCameraPos, setCameraScale, vec2, Vector2, LittleJS } from '../lib/littlejs';

import { AnimationManager } from "../animation/animation-manager";
import type { Elem } from "../definition/elem";
import type { Scene } from "../definition/scene";
import { GameObject } from "./objects/game-object";
import { Hud } from "../ui/hud";
import type { Condition } from "../definition/condition";
import type { Resources } from "../definition/resources";
import type { ResourceType } from '../definition/resource-type';
import { Thinker } from '../ai/thinker';
import { DEBUG, READY } from '../content/constant';
import type { Research } from '../definition/research';
import type { QuickAction } from '../definition/quick-actions';


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
  private onMoveOption = false;
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
  thinker = new Thinker(this);
  lastUnit: GameObject | undefined;
  lastHovered?: GameObject | undefined;
  advise: Set<string> = new Set();

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
      // this.hud.ui.classList.add("hidden");
      this.hud.resourceOverlay.classList.add("hidden");
      this.hud.buttonsOverlay.classList.add("hidden");
      this.showLabels = false;
      this.cursor?.hide();
      this.updateLabels();
      LittleJS.overlayCanvas.style.cursor = "default";
    });
    window.addEventListener("focus", (e) => {
      // this.hud.ui.classList.remove("hidden");
      this.hud.resourceOverlay.classList.remove("hidden");
      this.hud.buttonsOverlay.classList.remove("hidden");
      this.showLabels = true;
      this.refreshCursor();
      this.updateLabels();
      LittleJS.overlayCanvas.style.cursor = "";
    });
    if (!READY) {
      this.hud.showDialog("This game is almost ready!.");
    }
  }

  updateLabels() {
    this.getAllUnitsOrHouses().forEach((gameObject) => {
      gameObject.updateLabel(this.showLabels);
    });
  }

  refresh() {
    this.scene.elems.forEach((elem) => {
      if (elem.debug && !DEBUG) {
        return;
      }
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

  clearFogOfWar() {
    Object.keys(this.grid).forEach((tag) => {
      const gameObject = this.grid[tag];
      if (gameObject.elem?.type === "cloud") {
        this.clearCloud(gameObject.px, gameObject.py);
      }
    });
  }

  async iterateGridCell(x: number, y: number, callback: (gameObject: GameObject) => Promise<void>) {
    const layers = Object.keys(this.scene.layers);
    for (const layer of layers) {
      const tag = `${layer}_${x}_${y}`;
      const gameObject = this.grid[tag];
      if (gameObject) {
        await callback(gameObject);
      }
    }
  }

  getRevealedCells() {
    const cells: Vector2[] = [];
    this.revealed.forEach((tag) => {
      const [x, y] = tag.split("_").map(Number);
      cells.push(vec2(x, y));
    });
    return cells;
  }

  async iterateRevealedCells(callback: (gameObject: GameObject) => Promise<void>) {
    const cells = this.getRevealedCells();
    for (const cell of cells) {
      for (const layer of Object.keys(this.scene.layers)) {
        const tag = `${layer}_${cell.x}_${cell.y}`;
        const gameObject = this.grid[tag];
        if (gameObject) {
          await callback(gameObject);
        }
      }
    }
  }

  async fixWorld() {
    if (this.scene.clearFogOfWar) {
      this.clearFogOfWar();
    }

    const entries = Object.entries(this.grid);
    for (const [tag, gameObject] of entries) {
      if (gameObject.elem?.condition) {
        let conditionMet = false;
        if (gameObject.elem.condition.tile) {
          const tiles = Array.isArray(gameObject.elem.condition.tile) ? gameObject.elem.condition.tile : [gameObject.elem.condition.tile];
          for (const tile of tiles) {
            await this.iterateGridCell(gameObject.px, gameObject.py, async (target) => {
              if (target?.elem?.name === tile) {
                conditionMet = true;
              }
            });
          }
        }
        let violationMet = false;
        if (gameObject.elem.condition.noTile) {
          const tiles = Array.isArray(gameObject.elem.condition.noTile) ? gameObject.elem.condition.noTile : [gameObject.elem.condition.noTile];
          for (const tile of tiles) {
            for (const layer of Object.keys(this.scene.layers)) {
              const tag = `${layer}_${gameObject.px}_${gameObject.py}`;
              const target = this.grid[tag];
              if (target?.elem?.name === tile) {
                violationMet = true;
              }
            }
          }
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
    }
  }

  private shiftCamera() {
    if (this.inUI) {
      // return;
    }
    if (!this.hud.onTaxKnob) {
      if (!this.mousePosDown && mouseWasPressed(0)) {
        this.mousePosDown = vec2(mousePos.x, mousePos.y);
      }
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
      const definition = this.scene.definitions.find(def => def.name === elem.definition);
      if (definition) {
        Object.entries(definition).forEach(([key, value]) => {
          const e = elem as Record<string, any>;
          if (e[key] === undefined) {
            e[key] = JSON.parse(JSON.stringify(value));
          }
        });
        delete elem.definition;
      }
    }
    return elem;
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
        const farFromCenter = elem.group?.farFromCenter ?? 0;
        for (let x = 0; x < col; x++) {
          for (let y = 0; y < row; y++) {
            if (farFromCenter) {
              const distance = Math.abs(x - Math.floor(col / 2)) + Math.abs(y - Math.floor(row / 2));
              if (distance < farFromCenter) {
                continue;
              }
            }
            if (Math.random() <= chance) {
              const xx = x - Math.floor(col / 2);
              const yy = y - Math.floor(row / 2);
              if ((elem.type === "decor" || elem.water) && Math.abs(xx) <= 1 && Math.abs(yy) <= 1) {
                continue;
              }

              if (elem.type === "cloud" && this.isRevealed(xx, yy)) {
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
        if (this.grid[`tile_${x + xx}_${y + yy}`] && !this.isRevealed(x + xx, y + yy)) {
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

  isRevealed(x: number, y: number) {
    return this.revealed.has(`${x}_${y}`);
  }

  clearCloud(x: number, y: number) {
    if (this.isRevealed(x, y)) {
      return;
    }
    const tag = `${x}_${y}`;
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

  private checkOnMoveOptions(x: number, y: number) {
    this.onMoveOption = false;
    if (!this.selected?.moveOptions) {
      return;
    }
    const selectedAnimation = this.selected.elem?.selected?.moveIndic?.selectedAnimation
    const moveOptionAnimation = this.selected.elem?.selected?.moveIndic?.animation;
    if (!selectedAnimation || !moveOptionAnimation) {
      return;
    }

    const moveOptions = Object.values(this.selected.moveOptions);
    if (moveOptions.length) {
      let hoveringMoveOption = false;
      moveOptions.forEach((option) => {
        if (option.px === x && option.py === y) {
          hoveringMoveOption = true;
        }
        option.animation = this.animation.getInfo(
          option.px === x && option.py === y ? selectedAnimation : moveOptionAnimation);
      });
      if (hoveringMoveOption) {
        this.onMoveOption = true;
      }
    }
  }

  private checkOnAttackOptions(x: number, y: number) {
    this.onMoveOption = false;
    if (!this.selected?.attackOptions) {
      return;
    }
    const selectedAnimation = this.selected.elem?.selected?.moveIndic?.selectedAnimation
    const moveOptionAnimation = this.selected.elem?.selected?.moveIndic?.animation;
    if (!selectedAnimation || !moveOptionAnimation) {
      return;
    }

    const attackOptions = Object.values(this.selected.attackOptions);
    if (attackOptions.length) {
      let hoveringAttackOption = false;
      attackOptions.forEach((option) => {
        if (option.px === x && option.py === y) {
          hoveringAttackOption = true;
        }
        option.animation = this.animation.getInfo(
          option.px === x && option.py === y ? selectedAnimation : moveOptionAnimation);
      });
      if (hoveringAttackOption) {
        this.onMoveOption = true;
      }
    }
  }

  onCursorMove(x: number, y: number) {
    this.checkOnMoveOptions(x, y);
    this.checkOnAttackOptions(x, y);
    this.refreshCursor();
  }

  async onTap(x: number, y: number, mouseX: number, mouseY: number) {
    this.onMoveOption = false;
    this.refreshCursor();
    if (Date.now() - this.doneShifting < 100) {
      return;
    }
    if (this.inUI) {
      return;
    }
    if (this.getPlayer() === 0) {
      return;
    }
    if (this.selected?.canMoveTo(x, y) && this.selected.hasMoveOptionToLandOn(x, y)) {
      this.selected.moveTo(x, y);
      return;
    }
    if (this.selected?.canAttackAt(x, y) && this.selected.hasAttackOptionOn(x, y)) {
      this.selected.attackAt(x, y);
      return;
    }
    let unit: GameObject | undefined = this.grid[`unit_${x}_${y}`];
    if (!await unit?.canAct()) {
      unit = undefined;
    }
    const house = this.grid[`house_${x}_${y}`];
    const nextSelection = unit === this.selected ? house : unit;
    this.setSelection(this.selected === nextSelection ? undefined : nextSelection);
  }

  async setSelection(gameObject: GameObject | undefined) {
    if (this.selected === gameObject) {
      return;
    }
    if (gameObject?.elem?.waiting) {
      gameObject.elem.waiting = false;
      gameObject.refreshAlpha();
    }
    //  de-select previous
    const previousSelected = this.selected;
    this.selected = undefined;
    previousSelected?.onSelectChange();
    await this.hud.showSelected(undefined);
    if (previousSelected?.elem?.adviseOnDeselect && !this.advise.has(previousSelected.elem.adviseOnDeselect.name)) {
      this.advise.add(previousSelected.elem.adviseOnDeselect.name);
      await this.hud.showDialog(previousSelected.elem.adviseOnDeselect.message, previousSelected.elem.adviseOnDeselect.music, previousSelected.elem.adviseOnDeselect.voice);
    }

    //  select new
    if (gameObject?.elem?.advise && !this.advise.has(gameObject.elem.advise.name)) {
      this.advise.add(gameObject.elem.advise.name);
      await this.hud.showDialog(gameObject.elem.advise.message, gameObject.elem.advise.music, gameObject.elem.advise.voice);
    }
    this.selected = gameObject;
    this.selected?.onSelectChange();
    await this.hud.showSelected(this.selected);
    if (!this.shifting && this.selected) {
      this.makeWithinView(this.selected);
    }
    if (this.selected) {
      this.lastUnit = this.selected;
    } else {
      this.checkForAnyMove(true);
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
    if (this.hovered || this.inUI || this.onMoveOption) {
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
    if (this.hovered) {
      this.lastHovered = gameObject;
    }
    this.refreshCursor();
  }

  async checkCondition(condition?: Condition, obj?: GameObject) {
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
      for (const check of PROXY_CHECK) {
        if (check && !proxyCheck) {
          const [item, message] = check;
          if (item) {
            const nearby = await obj.findNearby(obj => {
              if (obj.elem?.name === item) {
                return true;
              }
              if (item === "foe" && obj.elem?.type === "unit" && obj.elem?.owner !== obj.elem?.owner) {
                return true;
              }
              return false;
            });
            console.log(item, nearby);
            if (condition.proximity === check && nearby.size) {
              proxyCheck = message ?? "true";
            }
            if (condition.nonProximity === check && !nearby.size) {
              proxyCheck = message ?? "true";
            }
          }
        }
      }
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
      const support = await obj?.countUnitSupport(unit);
      if (support && support >= level) {
        return message ?? "true";
      }
    }
    return null;
  }

  async gotoNextTurn() {
    // Increase turn count
    if (this.scene.turn) {
      this.setSelection(undefined);
      //  Change player
      if (this.scene.turn.player < this.scene.players.length) {
        this.scene.turn.player++;
      } else {
        this.scene.turn.player = 0;
        this.scene.turn.turn++;
      }
      const player = this.getPlayer();
      if (this.scene.turn && player) {
        await this.collectResources(player);
      }
      this.refreshUnitsLabels();
      if (this.getUnits(player).size) {
        await this.giveUnitsTurns(player);
        await this.selectNext();
      } else if (this.isAiPlayer(player)) {
        await this.gotoNextTurn();
      }
      await this.checkForAnyMove(true);
    }

    this.hud.updated = false;
  }

  refreshUnitsLabels() {
    Object.entries(this.grid).forEach(([tag, gameObject]) => {
      if (gameObject.elem?.type === "unit") {
        gameObject.refreshLabel();
      }
    });
  }

  async giveUnitsTurns(player: number) {
    const units = this.getUnits(player);
    for (const gameObject of units) {
      await gameObject.giveTurn();
    }
  }

  async calculateRevenue(player: number) {
    const playerResources = this.scene.players[player - 1]?.resources;
    if (!playerResources) {
      return 0;
    }
    let trade = 0;
    const visited = new Set<string>();
    await this.iterateRevealedCells(async (gameObject) => {
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

  async collectResources(player: number) {
    await this.ensureResearch(player);
    const playerResources = this.scene.players[player - 1]?.resources;
    if (!playerResources) {
      return;
    }
    await this.iterateRevealedCells(async (gameObject) => {
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
    await this.iterateRevealedCells(async (gameObject) => {
      const elem = gameObject.elem;
      if (elem?.owner === player && elem.harvesting) {
        gameObject.checkResourceCaps();
      }
    })

    //  Save global resources
    const globalResources = await this.calculateResourceRevenue(player);
    Object.entries(globalResources).forEach(([resource, value]) => {
      const r = resource as keyof Resources;
      playerResources[r] = (playerResources[r] ?? 0) + value;
    });

    //  check researched resources
    await this.checkResearch(this.getPlayer());
  }

  availableInventionsToDiscover(player: number) {
    const allInventions = this.scene.research;
    const playerResearch = this.scene.players[player - 1]?.research;
    return allInventions.filter(invention => {
      if (playerResearch?.[invention.name]) {
        return false;
      }
      if (!invention.forceInDebug && !DEBUG) {
        const dependency = invention.dependency;
        if (dependency && dependency.some(dep => !playerResearch?.[dep])) {
          return false;
        }
      }
      return true;
    });
  }

  async ensureResearch(player: number) {
    const globalResources = await this.calculateResourceRevenue(player);
    const brainsPerTurn = globalResources.brain;
    if (brainsPerTurn) {
      const currentResearch = this.getResearchInfo(player);
      if (!currentResearch) {
        await this.hud.showDialog("Use your research points to unlock new inventions.\nThis will help you evolve your animals and buildings.");
        await this.findNextResearch(player);
      }
    }
  }

  async checkResearch(player: number) {
    const researchPoints = this.scene.players[player - 1]?.resources.brain ?? 0;
    const currentResearchName = this.scene.players[player - 1]?.currentResearch;
    const currentResearch = this.scene.research.find(research => research.name === currentResearchName);
    if (researchPoints) {
      if (currentResearch) {
        if (researchPoints >= currentResearch.cost) {
          if (researchPoints >= currentResearch.cost) {
            await this.discover(player, currentResearch);
          }
        }
      } else {
        await this.findNextResearch(player);
      }
    }
  }

  async findNextResearch(player: number) {
    const globalResources = await this.calculateResourceRevenue(player);
    const brainsPerTurn = globalResources.brain;
    const currentBrains = this.getPlayerResource("brain", player);
    await this.hud.promptForResearch(this.availableInventionsToDiscover(player), brainsPerTurn, currentBrains);
  }

  async discover(player: number, invention: Research) {
    const playerInfo = this.scene.players[player - 1];
    if (!playerInfo.research) {
      playerInfo.research = {};
    }
    playerInfo.research[invention.name] = Date.now();
    this.updateResource("brain", brains => Math.max(0, brains - invention.cost), this.getPlayer());
    await this.hud.showResearchDialog(invention);

    await this.findNextResearch(player);
  }

  async checkForAnyBuilding() {
    let anyBuilding = undefined;
    await this.iterateRevealedCells(async (gameObject) => {
      if (gameObject.elem?.type === "house"
        && await gameObject.canAffordMoreHarvester()) {
        anyBuilding = gameObject;
      }
    });
    return anyBuilding;
  }

  async checkForAnyMove(forFlashingOnly?: boolean) {
    //  check if any unit can move
    let anyMove = undefined;
    await this.iterateRevealedCells(async (gameObject) => {
      if (gameObject.elem?.owner === this.scene.turn?.player && await gameObject.canAct()) {
        if (gameObject.elem?.type === "unit" && !gameObject.elem?.harvesting) {
          anyMove = gameObject;
        }
        //  else if (gameObject?.elem?.type === "house"
        //   && (gameObject.canAffordMoreHarvester() || gameObject.resourceMaxedOut())) {
        //   anyMove = gameObject;
        // }
      }
    });
    if (!anyMove) {
      if (this.autoEndTurn && !forFlashingOnly) {
        this.hud.flashEndTurn(true);
        setTimeout(() => {
          this.gotoNextTurn();
        }, 500);
      } else {
        this.hud.flashEndTurn();
      }
    }
    this.hud.updated = false;
  }

  getAllGlobalResources() {
    return this.getAllResources()
      .filter(resource => !this.getResourceType(resource)?.hidden && this.getResourceType(resource)?.global)
      .sort((a, b) => b.localeCompare(a))
  }

  async calculateResourceRevenue(player: number) {
    const revenue = await this.calculateRevenue(player);
    const RESOURCES = this.getAllGlobalResources();
    const resources: Record<keyof Resources, number> = {
      wheat: 0,
      wood: 0,
      gold: 0,
      brain: 0,
      trade: 0
    };
    RESOURCES.forEach((resource, index) => {
      let taxValue = this.getTaxValue(player);
      let revenueValue = Math.round(revenue * taxValue / 100);
      if (index === 0) {
        taxValue = 100 - taxValue;
        revenueValue = revenue - revenueValue;
      }
      resources[resource] = revenueValue;
    });
    return resources;
  }

  getUnits(player?: number) {
    const units: Set<GameObject> = new Set();
    Object.entries(this.grid).forEach(([tag, gameObject]) => {
      if (gameObject.elem?.type === "unit" && (player === undefined || gameObject.elem?.owner === player)) {
        units.add(gameObject);
      }
    });
    return units;
  }

  private getAllUnitsOrHouses() {
    const units: Set<GameObject> = new Set();
    Object.entries(this.grid).forEach(([tag, gameObject]) => {
      if (gameObject.elem?.type === "unit" || gameObject.elem?.type === "house") {
        units.add(gameObject);
      }
    });
    return units;
  }

  private getAllResources() {
    return Object.keys(this.scene.resources) as (keyof Resources)[];
  }

  getTaxValue(player: number | undefined) {
    return this.scene.players[(player ?? 0) - 1]?.tax ?? 0;
  }

  updateTaxValue(player: number, value: number) {
    if (this.scene.players[player - 1]) {
      this.scene.players[player - 1].tax = value;
    }
  }

  getPlayerResource(resource: keyof Resources, player: number) {
    return this.scene.players[player - 1]?.resources[resource] ?? 0;
  }

  getPlayer() {
    return this.scene.turn?.player ?? 0;
  }

  getTurn() {
    return this.scene.turn?.turn ?? 0;
  }

  getResourceType(resource: keyof Resources): ResourceType | undefined {
    return this.scene.resources[resource];
  }

  async getUnitRotation(player: number) {
    const cellsRotation: GameObject[] = [];
    const playerUnits = this.getUnits(player);
    for (const gameObject of playerUnits) {
      let include = false;
      if (this.selected === gameObject) {
        include = true;
      } else if (await gameObject.canAct()) {
        if (gameObject.elem?.type === "unit"
          && !gameObject.elem?.harvesting && !gameObject.elem?.waiting) {
          include = true;
        }
        //  else if (gameObject?.elem?.type === "house"
        //   && (gameObject.canAffordMoreHarvester() || gameObject.resourceMaxedOut())) {
        //   include = true;
        // }
      }
      if (include) {
        cellsRotation.push(gameObject);
      }
    }

    if (player === 0) {
      cellsRotation.sort((a, b) => this.compareAI(a, b));
    }

    return cellsRotation;
  }

  compareAI(a: GameObject, b: GameObject) {
    const px = cameraPos.x, py = cameraPos.y;
    const distA = Math.abs(a.px - px) + Math.abs(a.py - py);
    const distB = Math.abs(b.px - px) + Math.abs(b.py - py);
    return distA - distB;
  }

  async selectNext() {
    const cellsRotation: GameObject[] = await this.getUnitRotation(this.getPlayer());
    const currentIndex = this.selected ? cellsRotation.indexOf(this.selected) : -1;
    if (!cellsRotation.length) {
      this.hud.flashEndTurn();
    } else {
      // rotate cells
      let nextIndex = (currentIndex + 1) % cellsRotation.length;
      this.setSelection(this.selected === cellsRotation[nextIndex] ? undefined : cellsRotation[nextIndex]);
    }
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
    this.hud.updated = false;
  }

  isEmptySpot(x: number, y: number) {
    const unitTag = GameObject.getTag("unit", x, y);
    const houseTag = GameObject.getTag("house", x, y);
    const tileOverlayTag = GameObject.getTag("tile_overlay", x, y);

    if (!this.grid[unitTag] && !this.grid[houseTag] && this.grid[tileOverlayTag]?.elem?.name !== "lake") {
      return true;
    }
    return false;
  }

  findEmptySpotsAround(x: number, y: number) {
    const emptySpots: Vector2[] = [];
    for (let xx = -1; xx <= 1; xx++) {
      for (let yy = -1; yy <= 1; yy++) {
        if (xx || yy) {
          if (this.isEmptySpot(x + xx, y + yy)) {
            emptySpots.push(vec2(x + xx, y + yy));
          }
        }
      }
    }
    return emptySpots;

  }

  async unlockRewards(obj: GameObject) {
    await this.iterateGridCell(obj.px, obj.py, async (gameObject) => {
      const rewards = gameObject.elem?.rewards;
      if (rewards) {
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        if (!reward) {
          return;
        }

        if (reward.gold) {
          const [min, max] = reward.gold;
          const gold = Math.floor(Math.random() * (max - min + 1) + min);
          obj.updateResource("gold", g => g + gold);
          obj.showResources(obj.px, obj.py, obj.elem?.owner, true, {
            gold,
          });
          this.hud.updated = false;
          await this.hud.showDialog(`You found ${gold} gold!`);
        }
        if (reward.invention) {
          if (!this.scene.players[this.getPlayer() - 1].research) {
            await this.findNextResearch(this.getPlayer());
          }
          const currentResearch = this.getResearchInfo(this.getPlayer());
          if (currentResearch) {
            await this.discover(this.getPlayer(), currentResearch);
          }
        }
        if (reward.spawnFoes) {
          const emptySpots: Vector2[] = this.findEmptySpotsAround(obj.px, obj.py);
          const { count, element } = reward.spawnFoes;
          const actualCount = Math.min(emptySpots.length, Math.floor(Math.random() * (count[1] - count[0] + 1) + count[0]));
          emptySpots.sort(() => Math.random() - .5);
          for (let i = 0; i < actualCount; i++) {
            const spot = emptySpots[i];
            const newElem = this.addSceneElemAt(element, spot.x, spot.y, {
              savage: true,
            });
            newElem.gameObject.lastDx = Math.sign(obj.px - spot.x) || 1;
          }
          await this.hud.showDialog(`You have been ambushed by ${actualCount} savages!`);
        }
        if (reward.unit) {
          const emptySpots: Vector2[] = this.findEmptySpotsAround(obj.px, obj.py);
          if (emptySpots.length) {
            const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            const newElem = this.addSceneElemAt(reward.unit, spot.x, spot.y, {
              owner: obj?.elem?.owner
            });
            newElem.gameObject.lastDx = Math.sign(obj.px - spot.x) || 1;
            await this.hud.showDialog(`You have found a ${reward.unit.name}!`);
          }
        }
        gameObject.doom(true);
      }
    });
  }

  addSceneElemAt(elem: Elem, x: number, y: number, config: Partial<Elem> = {}) {
    const tag = GameObject.getTag(elem.type, x, y);
    if (this.grid[tag]) {
      return;
    }
    const newElem = JSON.parse(JSON.stringify(elem));
    this.defineElem(newElem);
    newElem.gameObject = newElem.gameObject ?? {};
    newElem.gameObject.pos = [x, y];

    Object.assign(newElem, config);

    this.ensureElem(newElem);
    this.scene.elems.push(newElem);
    return newElem;
  }

  getMenu(name: string | undefined) {
    return this.scene.menu?.find((m) => m.name === name);
  }

  isAiPlayer(player: number | undefined) {
    return !player || this.scene.players[player - 1]?.ai;
  }

  isResearched(research: string, player: number) {
    return this.scene.players[player - 1]?.research?.[research];
  }

  research(research: string, player: number) {
    this.scene.players[player - 1].currentResearch = research;
  }

  getResearchInfo(player: number) {
    const current = this.scene.players[player - 1]?.currentResearch;
    return this.scene.research.find(research => research.name === current);
  }

  quickActions() {
    return this.scene.quickActions ?? [];
  }

  async performQuickAction(action: QuickAction) {
    if (!this.selected?.elem) {
      return;
    }
    switch (action.name) {
      case "wait":
        this.selected.elem.waiting = true;
        this.selected.refreshAlpha();
        this.selected.updated = false;
        await this.selectNext();
        this.hud.updated = false;
        break;
      case "abandon":
        this.selected.doom(true);
        await this.selectNext();
        this.hud.updated = false;
        break;
    }
  }
}
