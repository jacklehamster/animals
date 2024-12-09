import { cameraPos, cameraScale, Color, EngineObject, mousePos, mouseWasPressed, mouseWasReleased, setCameraPos, setCameraScale, vec2, Vector2 } from "littlejsengine";
import { AnimationManager } from "./animation/animation-manager";
import type { Elem } from "./definition/elem";
import type { Scene } from "./definition/scene";
import { GameObject } from "./game-object";
import { Hud } from "./hud";
import type { Condition } from "./definition/condition";

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
  shifting = false;
  hud;
  worldChanged = true;
  inUI?: boolean;

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

  fixWorld() {
    Object.entries(this.grid).forEach(([tag, gameObject]) => {
      if (gameObject.elem?.condition) {
        let conditionMet = false;
        if (gameObject.elem.condition.tile) {
          this.iterateGridCell(gameObject.px, gameObject.py, (target) => {
            if (target?.elem?.name === gameObject.elem?.condition?.tile) {
              conditionMet = true;
            }
          });
        }
        let violationMet = false;
        if (gameObject.elem.condition.noTile) {
          Object.keys(this.scene.layers).forEach((layer) => {
            const tag = `${layer}_${gameObject.px}_${gameObject.py}`;
            const target = this.grid[tag];
            if (target?.elem?.name === gameObject.elem?.condition?.noTile) {
              violationMet = true;
            }
          });
        }
        if (!conditionMet || violationMet) {
          gameObject.doom(true);
          delete this.grid[tag];
        }
      }
    });
  }

  private shiftCamera() {
    if (!this.mousePosDown && mouseWasPressed(0)) {
      this.mousePosDown = vec2(mousePos.x, mousePos.y);
    }
    if (this.mousePosDown && mouseWasReleased(0)) {
      this.mousePosDown = undefined;
      if (!this.selected) {
        this.cursor?.show();
      }
      this.shifting = false;
    }

    if (this.mousePosDown) {
      const dx = mousePos.x - this.mousePosDown.x;
      const dy = mousePos.y - this.mousePosDown.y;
      if (dx || dy) {
        const mul = 10;
        this.camShift.set(this.camShift.x - dx * mul, this.camShift.y - dy * mul);
        this.mousePosDown.set(mousePos.x, mousePos.y);
        this.setSelection(undefined);
        this.cursor?.hide();
        this.shifting = true;
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
    const resources: Elem["resources"] = {};
    Object.keys(this.scene.layers).forEach((layer) => {
      const tag = `${layer}_${x}_${y}`;
      const gameObject = this.grid[tag];
      if (gameObject) {
        resources.wheat = (resources.wheat ?? 0) + (gameObject.elem?.resources?.wheat ?? 0);
        resources.wood = (resources.wood ?? 0) + (gameObject.elem?.resources?.wood ?? 0);
        resources.brain = (resources.brain ?? 0) + (gameObject.elem?.resources?.brain ?? 0);
      }
    });
    return Math.max(resources.wheat ?? 0, 0) + Math.max(resources.wood ?? 0, 0) + Math.max(resources.brain ?? 0, 0) ? resources : undefined;
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
    if (this.selected?.canMoveTo(x, y)) {
      this.selected.moveTo(x, y);
      this.setSelection(undefined);
      return;
    }
    const unit = this.grid[`unit_${x}_${y}`];
    const house = this.grid[`house_${x}_${y}`];
    this.setSelection(unit === this.selected ? house : unit);
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
  }

  hovering(gameObject: GameObject) {
    return gameObject.px === this.cursor?.px && gameObject.py === this.cursor?.py;
  }

  setHovered(gameObject: GameObject | undefined) {
    if (this.hovered === gameObject) {
      return;
    }
    this.hovered = gameObject;
    if (this.hovered) {
      this.cursor?.hide();
    } else {
      this.cursor?.show();
    }
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
        condition.occupied[1] ?? "true";
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
            let nearby = null;
            for (let y = -1; y <= 1; y++) {
              for (let x = -1; x <= 1; x++) {
                if (x === 0 && y === 0) {
                  continue;
                }
                this.iterateGridCell(obj.px + x, obj.py + y, (cell) => {
                  if (cell.elem?.name === item) {
                    nearby = cell;
                  }
                });
              }
            }
            if (condition.proximity && nearby) {
              proxyCheck = message ?? "true";
            }
            if (condition.nonProximity && !nearby) {
              proxyCheck = message ?? "true";
            }
          }
        }
      });
      if (proxyCheck) {
        return proxyCheck;
      }
    }
    return null;
  }
}
