import { cameraPos, cameraScale, EngineObject, mousePos, mouseWasPressed, mouseWasReleased, setCameraPos, setCameraScale, vec2, Vector2 } from "littlejsengine";
import { AnimationManager } from "./animation/animation-manager";
import type { Elem } from "./definition/elem";
import type { Scene } from "./definition/scene";
import { GameObject } from "./game-object";
import { Hud } from "./hud";

interface Entry {
  gameObject: Set<GameObject>;
  updateTime?: number;
}

export class Manager {
  readonly entries: Map<Elem, Entry> = new Map();
  readonly animation: AnimationManager;
  readonly grid: Record<string, GameObject> = {};
  readonly moveOptions: Record<string, EngineObject> = {};
  readonly revealed: Set<string> = new Set();
  cursor?: GameObject
  selected?: GameObject
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
    this.scene.elems.forEach((elem) => {
      this.sanitizeElem(elem);
      this.refreshElem(elem);
    });
    this.shiftCamera();
    if (this.worldChanged) {
      this.fixWorld();
      this.worldChanged = false;
    }
  }

  fixWorld() {

  }

  private shiftCamera() {
    if (!this.mousePosDown && mouseWasPressed(0)) {
      this.mousePosDown = vec2(mousePos.x, mousePos.y);
    }
    if (this.mousePosDown && mouseWasReleased(0)) {
      this.mousePosDown = undefined;
      this.cursor?.show();
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
    setCameraPos(cameraPos.set(Math.floor((cameraPos.x + dx * mul) * cameraScale) / cameraScale, Math.floor((cameraPos.y + dy * mul) * cameraScale) / cameraScale));
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
              if ((elem.type === "decor" || elem.type === "water") && Math.abs(xx) <= 1 && Math.abs(yy) <= 1) {
                continue;
              }

              const tag = `${elem.type}_${xx}_${yy}`;
              if (elem.type === "cloud" && this.revealed.has(tag)) {
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

  clearCloud(x: number, y: number) {
    const tag = `cloud_${x}_${y}`;
    if (this.revealed.has(tag)) {
      return;
    }
    this.revealed.add(tag);
    const gameObject = this.grid[tag];
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
    if (this.selected?.canMove(x, y)) {
      this.selected.setPosition(x, y);
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

  hovered(gameObject: GameObject) {
    return gameObject.px === this.cursor?.px && gameObject.py === this.cursor?.py;
  }
}
