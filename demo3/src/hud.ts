import { GameObject } from "./game-object";
import type { Scene } from "./definition/scene";
import type { Manager } from "./manager";
import type { Condition } from "./definition/menu";

export class Hud {
  ui: HTMLDivElement = document.createElement("div");
  bg: HTMLDivElement = document.createElement("div");
  overlay: HTMLDivElement = document.createElement("div");
  readonly itemsToDestroy = new Set<() => void>();
  readonly scene: Scene;

  constructor(readonly manager: Manager) {
    this.scene = manager.scene;
  }

  initialize() {
    document.body.appendChild(this.ui);
    this.ui.addEventListener("mouseover", e => {
      this.manager.inUI = true;
      this.manager.cursor?.hide();
    });
    this.ui.addEventListener("mouseout", e => {
      this.manager.inUI = false;
      this.manager.cursor?.show();
    });

    this.bg.style.width = "100%";
    this.bg.style.height = "100px";
    this.bg.style.position = "absolute";
    this.bg.style.zIndex = "100";
    this.bg.style.bottom = "-100px";
    this.bg.style.left = "0";
    this.bg.style.background = "rgba(0, 0, 0, 1)";
    this.bg.style.transition = "bottom 0.2s";
    this.bg.style.display = "flex";
    this.bg.style.color = "snow";
    this.bg.style.flexDirection = "row";
    this.ui.appendChild(this.bg);

    this.overlay.style.bottom = "0";
    this.overlay.style.right = "0";
    this.overlay.style.zIndex = "100";
    this.overlay.style.position = "absolute";
    this.overlay.style.display = "flex";
    this.overlay.style.flexDirection = "column";
    this.overlay.style.justifyContent = "right";
    this.overlay.style.gap = "10px";
    this.overlay.style.padding = "10px";
    this.ui.appendChild(this.overlay);
    this.setHudButtons();
  }

  setHudButtons() {
    const nextButton = this.overlay.appendChild(document.createElement("button"));
    nextButton.textContent = "Next unit";

    const endButton = this.overlay.appendChild(document.createElement("button"));
    endButton.textContent = "End turn";
  }

  clear() {
    this.itemsToDestroy.forEach((item) => item());
    this.itemsToDestroy.clear();
  }

  checkCondition(condition?: Condition, obj?: GameObject) {
    if (!condition || !obj) {
      return null;
    }
    if (condition.levelBelowEqual && (obj?.elem?.level ?? 0) <= condition.levelBelowEqual[0]) {
      return condition.levelBelowEqual[1] ?? "disabled";
    }
    if (condition.occupied) {
      const tag = GameObject.getTag(condition.occupied[0], obj?.px, obj?.py);
      if (this.manager.grid[tag]) {
        condition.occupied[1] ?? "disabled";
      }
    }
    return null;
  }

  showSelected(obj?: GameObject) {
    const menu = this.scene.menu?.find((m) => m.name === obj?.elem?.name);

    this.bg.style.bottom = menu?.items.length ? "0" : "-100px";
    this.bg.innerHTML = "";

    this.clear();

    if (!menu?.items.length) {
      return;
    }
    if (!obj) {
      return;
    }
    {
      const iconDiv = this.bg.appendChild(document.createElement("div"));
      const { imageSource, spriteSize, frames, padding } = menu.icon;
      const icon = iconDiv.appendChild(document.createElement("div"));
      icon.style.backgroundImage = `url(${imageSource})`;
      icon.style.width = `${spriteSize[0]}px`;
      icon.style.height = `${spriteSize[1]}px`;
      const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 0) * 2);
      let animationFrame: number;
      const animateIcon = () => {
        animationFrame = requestAnimationFrame(animateIcon);
        const frame = frames[Math.floor(performance.now() / 100) % frames.length];
        icon.style.backgroundPosition = `-${spriteWidth * frame}px 0`;
      };
      animationFrame = requestAnimationFrame(animateIcon);
      this.itemsToDestroy.add(() => cancelAnimationFrame(animationFrame));

      const label = iconDiv.appendChild(document.createElement("div"));
      label.innerText = menu.name;
      label.style.textAlign = "center";
    }
    {
      const menuDiv = this.bg.appendChild(document.createElement("div"));
      menuDiv.style.display = "flex";
      menuDiv.style.flexDirection = "row";
      menuDiv.style.justifyContent = "center";
      menuDiv.style.alignItems = "center";
      menuDiv.style.flexGrow = "1";
      menuDiv.style.margin = "0 10px";
      menuDiv.style.gap = "10px";

      menu.items.forEach((item) => {
        if (this.checkCondition(item.hidden, obj)) {
          return;
        }
        const disabled = this.checkCondition(item.disabled, obj);

        const menuItemDiv = menuDiv.appendChild(document.createElement("div"));
        menuItemDiv.style.cursor = "pointer";
        const { imageSource, spriteSize, frames, padding } = item;
        const icon = menuItemDiv.appendChild(document.createElement("div"));
        icon.style.backgroundImage = `url(${imageSource})`;
        icon.style.width = `${spriteSize[0]}px`;
        icon.style.height = `${spriteSize[1]}px`;
        const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 0) * 2);
        let animationFrame: number;
        const animateIcon = () => {
          animationFrame = requestAnimationFrame(animateIcon);
          const frame = frames[Math.floor(performance.now() / 100) % frames.length];
          icon.style.backgroundPosition = `-${spriteWidth * frame}px 0`;
        };
        animationFrame = requestAnimationFrame(animateIcon);
        this.itemsToDestroy.add(() => cancelAnimationFrame(animationFrame));

        const label = menuItemDiv.appendChild(document.createElement("div"));
        label.innerText = disabled ?? item?.label ?? item.name;
        label.style.textAlign = "center";

        menuItemDiv.style.backgroundColor = "rgba(100, 100, 100, 0.5)";
        if (!disabled) {
          menuItemDiv.addEventListener("mouseover", () => {
            menuItemDiv.style.backgroundColor = "rgba(100, 100, 100, 1)";
          });
          menuItemDiv.addEventListener("mouseout", () => {
            menuItemDiv.style.backgroundColor = "rgba(100, 100, 100, 0.5)";
          });
          menuItemDiv.addEventListener("mousedown", e => {
            const actions = item.actions ?? [];
            actions.forEach(action => {
              if (action.create) {
                this.manager.defineElem(action.create);
                const elem = JSON.parse(JSON.stringify(action.create));
                elem.gameObject.pos = [obj?.px, obj?.py];
                elem.owner = obj?.elem?.owner;
                this.scene.elems.push(elem);
              }
              if (action.destroy) {
                obj.doom(true);
              }
              if (action.deselect) {
                this.manager.setSelection(undefined);
              }
              if (action.level && obj.elem) {
                obj.elem.level = (obj.elem.level ?? 0) + action.level;
                obj.refreshLevel();
              }
            });

            e.preventDefault();
            e.stopPropagation();
          });
        }
        if (disabled) {
          menuItemDiv.style.filter = "grayscale(100%)";
          menuItemDiv.style.opacity = "0.5";
          menuItemDiv.style.cursor = "not-allowed";
        } else {
          menuItemDiv.style.filter = "";
          menuItemDiv.style.opacity = "";
        }
      });
    }
  }
}
