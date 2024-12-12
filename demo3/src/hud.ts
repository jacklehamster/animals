import { GameObject } from "./game-object";
import type { Scene } from "./definition/scene";
import type { Manager } from "./manager";
import type { Resources } from "./definition/resources";
import type { Elem } from "./definition/elem";

export class Hud {
  ui: HTMLDivElement = document.createElement("div");
  bg: HTMLDivElement = document.createElement("div");
  topBg: HTMLDivElement = document.createElement("div");
  overlay: HTMLDivElement = document.createElement("div");
  resourceOverlay: HTMLDivElement = document.createElement("div");
  readonly itemsToDestroy = new Set<() => void>();
  readonly scene: Scene;
  nextButton: HTMLButtonElement = document.createElement("button");
  endButton: HTMLButtonElement = document.createElement("button");
  updated = false;

  constructor(readonly manager: Manager) {
    this.scene = manager.scene;
  }

  initialize() {
    this.ui.id = "hud";
    this.ui.classList.add("hud");
    document.body.appendChild(this.ui);
    this.ui.addEventListener("mouseover", e => {
      this.manager.inUI = true;
      this.manager.cursor?.hide();
    });
    this.ui.addEventListener("mouseout", e => {
      this.manager.inUI = false;
      this.manager.refreshCursor();
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
    this.overlay.style.transition = "right 0.2s";
    this.ui.appendChild(this.overlay);
    this.setHudButtons();

    this.resourceOverlay.style.position = "absolute";
    this.resourceOverlay.style.top = "0";
    this.resourceOverlay.style.left = "0";
    this.resourceOverlay.style.zIndex = "100";
    this.ui.appendChild(this.resourceOverlay);

    document.addEventListener("keyup", e => {
      if (e.code === "KeyE") {
        this.endButton.click();
      }
      if (e.code === "KeyN") {
        this.nextButton.click();
      }
    });
  }

  refresh() {
    if (this.updated) {
      return;
    }
    this.endButton.innerHTML = `<u style='color: blue'>E</u>nd turn ${this.scene.turn?.turn ?? 1}`;
    this.refreshResources();
    this.refreshTax();
    this.updated = true;
  }

  refreshTax() {
    //  display resources (wheat, wood, brain)
    const player = this.scene.turn?.player ?? 1;
    const RESOURCES: (keyof Resources)[] = (Object.keys(this.scene.resources) as (keyof Resources)[])
      .filter(resource => !this.scene.resources[resource]?.hidden && this.scene.resources[resource]?.global)
      .sort((a, b) => a.localeCompare(b));
    const revenuePerResource = this.manager.calculateResourceRevenue(player);
    RESOURCES.forEach((resource, _) => {
      let taxValue = this.scene.players[player - 1].tax ?? 0;
      let revenueValue = revenuePerResource[resource];
      const taxText = document.getElementById(`${resource}-tax`) as HTMLDivElement;
      if (taxText) {
        taxText.textContent = `${revenueValue >= 0 ? '+' : ''}${revenueValue} (${taxValue}%)`;
      }
    });
    //  add knob to adjust tax
    let taxKnob = document.getElementById("tax") as HTMLInputElement;
    if (!taxKnob) {
      taxKnob = (this.resourceOverlay.appendChild(document.createElement("input")));
      taxKnob.id = "tax";
      taxKnob.type = "range";
      taxKnob.min = "0";
      taxKnob.max = "100";
      taxKnob.step = "5";
      taxKnob.value = `${this.scene.players[player - 1].tax ?? 0}`;
      taxKnob.style.width = "60px";
      taxKnob.addEventListener("input", e => {
        this.scene.players[player - 1].tax = parseInt(taxKnob.value);
        this.refreshTax();
      });
    }
  }

  refreshResources() {
    //  display resources (wheat, wood, brain)
    const player = this.scene.turn?.player ?? 1;
    const RESOURCES: (keyof Resources)[] = (Object.keys(this.scene.resources) as (keyof Resources)[])
      .filter(resource => !this.scene.resources[resource]?.hidden && this.scene.resources[resource]?.global)
      .sort((a, b) => a.localeCompare(b));
    RESOURCES.forEach((resource, index) => {
      if (!this.scene.resources[resource]) {
        return;
      }
      const { imageSource, spriteSize, frames, padding } = this.scene.resources[resource].icon;
      let icon = document.getElementById(resource);
      if (!icon) {
        icon = this.resourceOverlay.appendChild(document.createElement("div"));
        icon.id = resource;
        icon.style.backgroundImage = `url(${imageSource})`;
        icon.style.width = `${spriteSize[0]}px`;
        icon.style.height = `${spriteSize[1]}px`;
        icon.style.backgroundPosition = `-${(spriteSize[0] + (padding?.[0] ?? 0) * 2) * frames[0] + (padding?.[0] ?? 0) / 2}px 0`;
        icon.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        icon.style.bottom = "0";
        icon.style.left = "0";
        icon.style.color = "white";
        icon.style.borderRadius = "50%";
        icon.style.display = "flex";
        icon.style.alignSelf = "flex-end";
        icon.style.justifyContent = "center";
        icon.style.fontSize = "12pt";
        icon.style.fontWeight = "bold";
        icon.style.marginTop = "15px";
        icon.style.transition = "background-color 0.2s";
        icon.textContent = "0";
        this.resourceOverlay.appendChild(icon);
      }
      let taxValue = this.scene.players[player - 1].tax ?? 0;
      if (index === 0) {
        taxValue = 100 - taxValue;
      }

      const newText = `${this.scene.players[player - 1].resources[resource] ?? 0}`;
      if (icon.textContent !== newText) {
        icon.textContent = newText;
        icon.style.backgroundColor = "rgba(255, 50, 255, 0.5)";
        setTimeout(() => {
          icon.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        }, 1500);
      }
      const taxText = document.getElementById(`${resource}-tax`) as HTMLDivElement ?? (this.resourceOverlay.appendChild(document.createElement("div")));
      taxText.id = `${resource}-tax`;
      taxText.style.color = "white";
      taxText.style.width = "100%";
      taxText.style.marginTop = "-20px";
      taxText.style.textAlign = "center";
      taxText.style.fontSize = "8pt";
    });
  }

  flashEndTurn(temp = false) {
    document.getElementById("endButton")?.classList.add(temp ? "flash-temp" : "flash");
    if (temp) {
      this.stopFlashEndTurn();
      setTimeout(() => {
        document.getElementById("endButton")?.classList.remove("flash-temp");
      }, 1000);
    }
  }

  stopFlashEndTurn() {
    document.getElementById("endButton")?.classList.remove("flash");
  }

  setHudButtons() {
    const nextButton = this.overlay.appendChild(this.nextButton);
    nextButton.innerHTML = "<u style='color: blue'>N</u>ext unit";
    nextButton.id = "nextButton";
    nextButton.addEventListener("click", e => {
      this.manager.selectNext();
    });

    const endButton = this.overlay.appendChild(this.endButton);
    endButton.id = "endButton";
    endButton.addEventListener("click", e => {
      this.stopFlashEndTurn();
      this.manager.gotoNextTurn();
    });
    endButton.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
    });
    endButton.addEventListener("mouseup", e => {
      e.preventDefault();
      e.stopPropagation();
    });

    const autoEndGroup = this.overlay.appendChild(document.createElement("div"));
    const autoEndLabel = autoEndGroup.appendChild(document.createElement("label"));
    autoEndLabel.textContent = "auto-end turn";
    autoEndLabel.htmlFor = "autoEndCheckbox";
    const autoEndCheckbox = autoEndGroup.appendChild(document.createElement("input"));
    autoEndCheckbox.id = "autoEndCheckbox";
    autoEndCheckbox.type = "checkbox";
    autoEndCheckbox.checked = this.manager.autoEndTurn;
    autoEndCheckbox.addEventListener("change", e => {
      this.manager.autoEndTurn = autoEndCheckbox.checked;
      if (this.manager.autoEndTurn) {
        this.stopFlashEndTurn();
        this.manager.checkForAnyMove();
      }
    });
  }

  clear() {
    this.itemsToDestroy.forEach((item) => item());
    this.itemsToDestroy.clear();
  }

  showSelected(obj?: GameObject) {
    const menu = this.scene.menu?.find((m) => m.name === obj?.elem?.name);

    this.bg.style.bottom = menu?.items.length ? "0" : "-400px";
    this.overlay.style.right = menu?.items.length ? "-200px" : "0";
    this.bg.innerHTML = "";

    this.topBg.style.top = obj ? "0" : "-400px";

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
      label.style.fontSize = "10pt";
      label.style.color = "silver";

      const descDiv = this.bg.appendChild(document.createElement("div"));
      const desc = descDiv.appendChild(document.createElement("div"));
      desc.style.margin = "20px 20px";
      desc.style.color = "silver";
      desc.style.width = "0px";
      const descContent = desc.appendChild(document.createElement("div"));
      descContent.style.position = "absolute";
      descContent.style.maxWidth = "200px";
      descContent.textContent = menu.description ?? "";

      const healthDiv = descDiv.appendChild(document.createElement("div"));
      healthDiv.style.position = "absolute";
      healthDiv.style.right = "0";
      if (obj.elem?.type === "house") {
        //  show weath resource
        const wheat = healthDiv.appendChild(document.createElement("div"));
        wheat.style.display = "flex";
        wheat.style.flexDirection = "row";
        wheat.style.alignItems = "center";
        wheat.style.justifyContent = "center";
        wheat.style.margin = "0 10px";
        wheat.style.gap = "10px";
        if (this.scene.resources.wheat) {
          const { imageSource, spriteSize, frames, padding } = this.scene.resources.wheat.icon;
          const icon = wheat.appendChild(document.createElement("div"));
          icon.style.backgroundImage = `url(${imageSource})`;
          icon.style.width = `${spriteSize[0]}px`;
          icon.style.height = `${spriteSize[1]}px`;
          icon.style.transform = "scale(.5)";
          const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 0) * 2);
          icon.style.backgroundPosition = `-${spriteWidth * frames[0]}px 0`;
        }
        // show wheat amount

        // calculate wheat cost for next level
        const cost = obj.nextLevelCost();

        const label = wheat.appendChild(document.createElement("div"));
        label.style.fontSize = "10pt";
        label.style.color = "gold";
        label.textContent = `${obj.elem.resourcesAccumulated?.wheat ?? 0} / ${cost}`;
      }
    }
    {
      const menuDiv = this.bg.appendChild(document.createElement("div"));
      menuDiv.style.display = "flex";
      menuDiv.style.flexDirection = "row";
      menuDiv.style.justifyContent = "center";
      menuDiv.style.alignItems = "center";
      menuDiv.style.flexGrow = "1";
      menuDiv.style.margin = "0 10px";
      menuDiv.style.marginLeft = "-100px";
      menuDiv.style.gap = "10px";

      menu.items.forEach((item) => {
        if (this.manager.checkCondition(item.hidden, obj)) {
          return;
        }
        const disabled = this.manager.checkCondition(item.disabled, obj);

        const menuItemDiv = menuDiv.appendChild(document.createElement("div"));
        const text = menuItemDiv.appendChild(document.createElement("div"));
        text.textContent = item.label ?? item.name;
        text.style.position = "absolute";
        text.style.top = "0";
        text.style.fontSize = "10pt";
        text.style.color = "red";
        text.style.display = disabled ? "block" : "none";

        menuItemDiv.style.cursor = "pointer";
        menuItemDiv.style.display = "flex";
        menuItemDiv.style.alignItems = "center";
        menuItemDiv.style.justifyContent = "center";
        menuItemDiv.style.flexDirection = "column";
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
        label.style.fontSize = "10pt";

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
              if (action.destroy) {
                obj.doom(true);
              }
              if (action.create) {
                this.manager.defineElem(action.create);
                const elem: Elem = JSON.parse(JSON.stringify(action.create));
                if (!elem.gameObject) {
                  elem.gameObject = {};
                }
                elem.gameObject.pos = [obj?.px, obj?.py];
                elem.owner = obj?.elem?.owner;
                elem.home = [obj?.px, obj?.py];
                this.scene.elems.push(elem);
              }
              if (action.deselect) {
                this.manager.setSelection(undefined);
              }
              if (action.level && obj.elem) {
                obj.updateLevel((obj.elem.level ?? 0) + action.level)
                obj.refreshLabel();
              }
              if (action.harvest && obj.elem) {
                obj.setHarvesting(true);
              }
              if (action.stopHarvest && obj.elem) {
                obj.setHarvesting(false);
              }
              obj.refreshLabel();
            });
            this.updated = false;

            e.preventDefault();
            e.stopPropagation();
          });
        }
        if (disabled) {
          icon.style.filter = "grayscale(100%)";
          icon.style.opacity = "0.5";
          menuItemDiv.style.cursor = "not-allowed";
        } else {
          icon.style.filter = "";
          icon.style.opacity = "";
          menuItemDiv.style.cursor = "pointer";
        }
      });
    }
  }
}
