import { GameObject } from "../core/objects/game-object";
import type { Manager } from "../core/manager";
import type { Resources } from "../definition/resources";
import type { Elem } from "../definition/elem";
import { DEBUG } from "../content/constant";
import type { Research } from "../definition/research";

const SPRITESHEET_COLS = 30;

speechSynthesis.getVoices();

export class Hud {
  ui: HTMLDivElement = document.createElement("div");
  bg: HTMLDivElement = document.createElement("div");
  topBg: HTMLDivElement = document.createElement("div");
  buttonsOverlay: HTMLDivElement = document.createElement("div");
  resourceOverlay: HTMLDivElement = document.createElement("div");
  blocker: HTMLDivElement = document.createElement("div");
  dialog: HTMLDivElement = document.createElement("div");
  cat: HTMLImageElement = document.createElement("img");
  readonly itemsToDestroy = new Set<() => void>();
  nextButton: HTMLButtonElement = document.createElement("button");
  endButton: HTMLButtonElement = document.createElement("button");
  researchList: HTMLDivElement = document.createElement("div");
  researchInfoDiv: HTMLDivElement = document.createElement("div");
  researchPopup: HTMLDivElement = document.createElement("div");
  music: HTMLAudioElement = document.createElement("audio");
  updated = false;

  constructor(readonly manager: Manager) {
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
    this.ui.style.display = "none";

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

    this.buttonsOverlay.style.bottom = "0";
    this.buttonsOverlay.style.right = "0";
    this.buttonsOverlay.style.zIndex = "100";
    this.buttonsOverlay.style.position = "absolute";
    this.buttonsOverlay.style.display = "flex";
    this.buttonsOverlay.style.flexDirection = "column";
    this.buttonsOverlay.style.justifyContent = "right";
    this.buttonsOverlay.style.gap = "10px";
    this.buttonsOverlay.style.padding = "10px";
    this.buttonsOverlay.style.transition = "right 0.2s";
    this.buttonsOverlay.style.display = "none";
    this.ui.appendChild(this.buttonsOverlay);
    this.setHudButtons();

    this.resourceOverlay.style.position = "absolute";
    this.resourceOverlay.style.top = "0";
    this.resourceOverlay.style.left = "0";
    this.resourceOverlay.style.zIndex = "100";
    this.ui.appendChild(this.resourceOverlay);

    this.blocker.style.width = "100%";
    this.blocker.style.height = "100%";
    this.blocker.style.position = "absolute";
    this.blocker.style.zIndex = "100";
    this.blocker.style.top = "0";
    this.blocker.style.left = "0";
    this.blocker.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    this.blocker.style.cursor = "pointer";
    this.blocker.style.display = "none";
    this.ui.appendChild(this.blocker);

    this.dialog.style.position = "absolute";
    this.dialog.style.zIndex = "100";
    this.dialog.style.bottom = "10px";
    this.dialog.style.left = "50%";
    this.dialog.style.transform = "translate(-50%, 0)";
    this.dialog.style.width = "80%";
    this.dialog.style.height = "200px";
    this.dialog.style.backgroundColor = "rgba(0, 0, 0, .7)";
    this.dialog.style.color = "snow";
    this.dialog.style.flexDirection = "column";
    this.dialog.style.justifyContent = "center";
    this.dialog.style.alignItems = "center";
    this.dialog.style.textAlign = "center";
    this.dialog.style.textTransform = "uppercase";
    this.dialog.style.whiteSpace = "pre-wrap";
    this.dialog.style.display = "none";
    this.dialog.style.pointerEvents = "none";
    this.ui.appendChild(this.dialog);
    //  add cat figure on dialog
    this.cat.style.position = "absolute";
    this.cat.style.bottom = "0";
    this.cat.style.left = "0";
    this.cat.src = "./assets/cat.png";
    this.cat.style.display = "none";
    this.cat.style.zIndex = "100";
    this.ui.appendChild(this.cat);

    this.researchList.style.position = "absolute";
    this.researchList.style.zIndex = "100";
    this.researchList.style.top = "50%";
    this.researchList.style.left = "50%";
    this.researchList.style.transform = "translate(-50%, -50%)";
    this.researchList.style.width = "400px";
    this.researchList.style.height = "200px";
    this.researchList.style.backgroundColor = "rgba(0, 0, 0, .7)";
    this.researchList.style.color = "snow";
    this.researchList.style.flexDirection = "column";
    this.researchList.style.justifyContent = "center";
    this.researchList.style.alignItems = "center";
    this.researchList.style.textAlign = "center";
    this.researchList.style.textTransform = "uppercase";
    this.researchList.style.display = "none";
    this.ui.appendChild(this.researchList);

    this.researchInfoDiv.style.position = "absolute";
    this.researchInfoDiv.style.zIndex = "100";
    this.researchInfoDiv.style.top = "10px";
    this.researchInfoDiv.style.right = "10px";
    this.researchInfoDiv.style.width = "200px";
    this.researchInfoDiv.style.height = "60px";
    this.researchInfoDiv.style.backgroundColor = "rgba(0, 0, 0, .7)";
    this.researchInfoDiv.style.color = "snow";
    this.researchInfoDiv.style.flexDirection = "column";
    this.researchInfoDiv.style.justifyContent = "center";
    this.researchInfoDiv.style.alignItems = "center";
    this.researchInfoDiv.style.textAlign = "center";
    this.researchInfoDiv.style.textTransform = "uppercase";
    this.researchInfoDiv.style.display = "none";
    this.ui.appendChild(this.researchInfoDiv);

    this.researchPopup.style.position = "absolute";
    this.researchPopup.style.zIndex = "100";
    this.researchPopup.style.top = "50%";
    this.researchPopup.style.left = "50%";
    this.researchPopup.style.transform = "translate(-50%, -50%)";
    this.researchPopup.style.width = "800px";
    this.researchPopup.style.height = "600px";
    this.researchPopup.style.backgroundImage = "url(./assets/researched.png)";
    this.researchPopup.style.backgroundSize = "cover";
    this.researchPopup.style.display = "none";
    this.researchPopup.style.pointerEvents = "none";

    const researchImage = this.researchPopup.appendChild(document.createElement("div"));
    researchImage.id = "researchImage";
    researchImage.style.position = "absolute";
    researchImage.style.top = "30%";
    researchImage.style.left = "50%";
    researchImage.style.transform = "translate(-50%, -50%) scale(3)";
    this.ui.appendChild(this.researchPopup);

    const researchText = this.researchPopup.appendChild(document.createElement("div"));
    researchText.id = "researchText";
    researchText.style.position = "absolute";
    researchText.style.bottom = "10px";
    researchText.style.left = "50%";
    researchText.style.transform = "translate(-50%, 0)";
    researchText.style.width = "80%";
    researchText.style.height = "100px";
    researchText.style.backgroundColor = "rgba(0, 0, 0, .7)";
    researchText.style.color = "snow";
    researchText.style.flexDirection = "column";
    researchText.style.justifyContent = "center";
    researchText.style.alignItems = "center";
    researchText.style.textAlign = "center";
    researchText.style.textTransform = "uppercase";
    researchText.style.display = "flex";
    researchText.style.pointerEvents = "none";

    this.setupShortcutKeys();
    this.initializeErrorBanner();
    this.setupMusic();
  }

  setupMusic() {
    this.music.src = "./assets/animal-anthem.mp3";
    this.music.loop = true;
    this.music.preload = "auto";
  }

  setupShortcutKeys() {
    document.addEventListener("keyup", e => {
      if (e.code === "KeyE") {
        this.endButton.click();
      }
      if (e.code === "KeyN") {
        this.nextButton.click();
      }
      if (e.code === "Escape") {
        this.manager.setSelection(undefined);
      }
    });
  }

  async refresh() {
    if (this.updated) {
      return;
    }
    this.endButton.innerHTML = `<u style='color: blue'>E</u>nd turn ${this.manager.getTurn()}`;
    this.refreshResources();
    this.refreshTax();
    this.refreshButtons();
    this.refreshResearchInfo();
    this.ui.style.display = "block";
    this.updated = true;
  }

  refreshButtons() {
    const player = this.manager.getPlayer();
    this.nextButton.style.display = this.manager.getUnits(player).size > 1 ? "block" : "none";
  }

  async refreshTax() {
    //  display resources (wheat, wood, brain)
    const player = this.manager.getPlayer();
    const RESOURCES: (keyof Resources)[] = this.manager.getAllGlobalResources();
    const revenuePerResource = await this.manager.calculateResourceRevenue(player);
    const hasRevenue = Object.values(revenuePerResource).some(value => value > 0);

    RESOURCES.forEach((resource, index) => {
      let taxValue = this.manager.getTaxValue(this.manager.getPlayer());
      if (index === 0) {
        taxValue = 100 - taxValue;
      }
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
      taxKnob.value = `${this.manager.getTaxValue(this.manager.getPlayer())}`;
      taxKnob.style.width = "60px";
      taxKnob.style.marginTop = "20px";
      taxKnob.addEventListener("input", e => {
        this.manager.updateTaxValue(player, parseInt(taxKnob.value));
        this.refreshTax();
        this.refreshResearchInfo();
      });
    }
    taxKnob.style.display = hasRevenue ? "block" : "none";
  }

  async refreshResources() {
    //  display resources (gold, brain)
    const RESOURCES: (keyof Resources)[] = this.manager.getAllGlobalResources();
    RESOURCES.forEach((resource, index) => {
      const resourceData = this.manager.getResourceType(resource);
      if (!resourceData) {
        return;
      }
      const { imageSource, spriteSize, frames, padding } = resourceData.icon;
      const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
      const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
      let icon = document.getElementById(resource);
      if (!icon) {
        icon = this.resourceOverlay.appendChild(document.createElement("div"));
        icon.id = resource;
        icon.style.backgroundImage = `url(${imageSource})`;
        icon.style.width = `${spriteWidth}px`;
        icon.style.height = `${spriteHeight}px`;
        icon.classList.add("resource-icon");
        icon.style.backgroundPosition = `${-spriteWidth * (frames[0] % 30) + (padding?.[0] ?? 2) / 2}px ${-spriteHeight * Math.floor(frames[0] / 30) + (padding?.[1] ?? 2) / 2}px`;
        icon.textContent = "0";
        this.resourceOverlay.appendChild(icon);
      }
      let taxValue = this.manager.getTaxValue(this.manager.getPlayer());
      if (index === 0) {
        taxValue = 100 - taxValue;
      }

      const newText = `${this.manager.getPlayerResource(resource, this.manager.getPlayer())}`;
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

    const revenuePerResource = await this.manager.calculateResourceRevenue(this.manager.getPlayer());
    const hasRevenue = Object.values(revenuePerResource).some(value => value > 0);
    const hasResource = RESOURCES.some(resource => this.manager.getPlayerResource(resource, this.manager.getPlayer()) > 0);
    this.resourceOverlay.style.display = hasRevenue || hasResource ? "block" : "none";
  }

  flashEndTurn(temp = false) {
    this.buttonsOverlay.style.display = "block";
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
    const nextButton = this.buttonsOverlay.appendChild(this.nextButton);
    nextButton.innerHTML = "<u style='color: blue'>N</u>ext unit";
    nextButton.id = "nextButton";
    nextButton.style.width = "150px";
    nextButton.addEventListener("click", e => {
      this.manager.selectNext();
    });
    nextButton.style.display = "none";

    const endButton = this.buttonsOverlay.appendChild(this.endButton);
    endButton.style.width = "150px";
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

    const autoEndGroup = this.buttonsOverlay.appendChild(document.createElement("div"));
    const autoEndLabel = autoEndGroup.appendChild(document.createElement("label"));
    autoEndLabel.textContent = "auto-end turn";
    autoEndLabel.htmlFor = "autoEndCheckbox";
    autoEndLabel.title = "Automatically end turn when no more moves are available";
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

  async showSelected(obj?: GameObject) {
    const menu = this.manager.getMenu(obj?.elem?.name);
    this.bg.style.bottom = menu?.items.length ? "0" : "-400px";
    this.buttonsOverlay.style.right = menu?.items.length ? "-200px" : "0";
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

      const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
      const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
      let animationFrame: number;
      const animateIcon = () => {
        animationFrame = requestAnimationFrame(animateIcon);
        const frame = frames[Math.floor(performance.now() / 100) % frames.length];
        icon.style.backgroundPosition = `${-spriteWidth * (frame % SPRITESHEET_COLS)}px ${-spriteHeight * Math.floor(frame / SPRITESHEET_COLS)}px`;
      };
      animateIcon();
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
      healthDiv.style.top = "0";
      if (obj.elem?.type === "house") {
        const resourcesRevenue = obj.calculateUnitResourcesRevenue();

        {
          //  show weath resource
          const wheat = healthDiv.appendChild(document.createElement("div"));
          wheat.style.display = "flex";
          wheat.style.flexDirection = "row";
          wheat.style.alignItems = "center";
          wheat.style.justifyContent = "left";
          wheat.style.margin = "3px 10px";
          wheat.style.height = "16px";
          const wheatResourceType = this.manager.getResourceType("wheat");
          if (wheatResourceType) {
            const { imageSource, spriteSize, frames, padding } = wheatResourceType.icon;
            const icon = wheat.appendChild(document.createElement("div"));
            icon.style.backgroundImage = `url(${imageSource})`;
            icon.style.width = `${spriteSize[0]}px`;
            icon.style.height = `${spriteSize[1]}px`;
            icon.style.transform = "scale(.5)";
            const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
            const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
            icon.style.backgroundPosition = `${-spriteWidth * (frames[0] % SPRITESHEET_COLS)}px ${-spriteHeight * Math.floor(frames[0] / SPRITESHEET_COLS)}px`;
          }
          // show wheat amount

          // calculate wheat cost for next level
          const cost = obj.nextLevelCost();

          const label = wheat.appendChild(document.createElement("div"));
          label.style.fontSize = "10pt";
          label.style.color = "gold";
          label.textContent = `(+${resourcesRevenue["wheat"]}) ${obj.elem.resourcesAccumulated?.wheat ?? 0} / ${cost}`;
        }
        {
          //  show wood resource
          const wood = healthDiv.appendChild(document.createElement("div"));
          wood.style.display = "flex";
          wood.style.flexDirection = "row";
          wood.style.alignItems = "center";
          wood.style.justifyContent = "left";
          wood.style.margin = "3px 10px";
          wood.style.height = "16px";
          const woodResourceType = this.manager.getResourceType("wood");
          if (woodResourceType) {
            const { imageSource, spriteSize, frames, padding } = woodResourceType.icon;
            const icon = wood.appendChild(document.createElement("div"));
            icon.style.backgroundImage = `url(${imageSource})`;
            icon.style.width = `${spriteSize[0]}px`;
            icon.style.height = `${spriteSize[1]}px`;
            icon.style.transform = "scale(.5)";
            const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
            const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
            icon.style.backgroundPosition = `${-spriteWidth * (frames[0] % SPRITESHEET_COLS)}px ${-spriteHeight * Math.floor(frames[0] / SPRITESHEET_COLS)}px`;
          }
          // show wood amount
          const label = wood.appendChild(document.createElement("div"));
          label.style.fontSize = "10pt";
          label.style.color = "orange";
          const capacity = obj.resourceCapacity("wood");
          label.textContent = `(+${resourcesRevenue["wood"]}) ${obj.elem.resourcesAccumulated?.wood ?? 0} / ${capacity}`;
        }
        {
          //  show trade resource
          const trade = healthDiv.appendChild(document.createElement("div"));
          trade.style.display = "flex";
          trade.style.flexDirection = "row";
          trade.style.alignItems = "center";
          trade.style.justifyContent = "left";
          trade.style.margin = "3px 10px";
          trade.style.height = "16px";
          const tradeResourceType = this.manager.getResourceType("trade");
          if (tradeResourceType) {
            const { imageSource, spriteSize, frames, padding } = tradeResourceType.icon;
            const icon = trade.appendChild(document.createElement("div"));
            icon.style.backgroundImage = `url(${imageSource})`;
            icon.style.width = `${spriteSize[0]}px`;
            icon.style.height = `${spriteSize[1]}px`;
            icon.style.transform = "scale(.5)";
            const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
            const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
            icon.style.backgroundPosition = `${-spriteWidth * (frames[0] % SPRITESHEET_COLS)}px ${-spriteHeight * Math.floor(frames[0] / SPRITESHEET_COLS)}px`;
          }
          // show trade amount
          const label = trade.appendChild(document.createElement("div"));
          label.style.fontSize = "10pt";
          label.style.color = "teal";
          label.textContent = `(+${resourcesRevenue["trade"]})`;
        }
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

      for (const item of menu.items) {
        console.log(item, DEBUG);
        if (item.debug && !DEBUG) {
          continue;
        }
        if (await this.manager.checkCondition(item.hidden, obj)) {
          continue;
        }
        const researched = !item.researchNeeded?.length || item.researchNeeded?.every(research => this.manager.isResearched(research, this.manager.getPlayer()));
        if (!researched) {
          continue;
        }
        const disabled = (!researched ? `Research\n${item.researchNeeded?.join(", ")}` : undefined) || await this.manager.checkCondition(item.disabled, obj)
          || (obj.canAfford(item.resourceCost) ? null : "not enough\nresources");

        const menuItemDiv = menuDiv.appendChild(document.createElement("div"));

        if (item.resourceCost && researched) {
          const resourceDiv = menuItemDiv.appendChild(document.createElement("div"));
          resourceDiv.style.display = "flex";
          resourceDiv.style.flexDirection = "row";
          resourceDiv.style.marginTop = "-55px";
          resourceDiv.style.marginLeft = "-60px";
          resourceDiv.style.position = "absolute";
          const cost = item.resourceCost;
          Object.entries(cost ?? {}).forEach(([key, amount]) => {
            const resource = key as keyof Resources;
            const resourceData = this.manager.getResourceType(resource);
            if (!resourceData) {
              return;
            }
            const { imageSource, spriteSize, frames, padding } = resourceData.icon;
            const icon = resourceDiv.appendChild(document.createElement("div"));
            icon.style.backgroundImage = `url(${imageSource})`;
            icon.style.width = `${spriteSize[0]}px`;
            icon.style.height = `${spriteSize[1]}px`;
            icon.style.transform = "scale(.5)";
            icon.style.marginTop = "-25px";
            const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
            const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
            icon.style.backgroundPosition = `${-spriteWidth * (frames[0] % SPRITESHEET_COLS)}px ${-spriteHeight * Math.floor(frames[0] / SPRITESHEET_COLS)}px`;
            const label = resourceDiv.appendChild(document.createElement("div"));
            label.style.fontSize = "10pt";
            label.style.marginLeft = "-20px";
            label.style.color = "gold";
            label.textContent = `${amount}`;
          });
        } else {
          const text = menuItemDiv.appendChild(document.createElement("div"));
          text.textContent = item.label ?? item.name;
          text.style.position = "absolute";
          text.style.top = "0";
          text.style.fontSize = "10pt";
          text.style.color = "red";
          text.style.display = disabled ? "block" : "none";
        }

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
        const cols = 30;
        const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
        const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
        let animationFrame: number;
        const animateIcon = () => {
          animationFrame = requestAnimationFrame(animateIcon);
          const frame = frames[Math.floor(performance.now() / 100) % frames.length];
          icon.style.backgroundPosition = `${-spriteWidth * (frame % cols)}px ${-spriteHeight * Math.floor(frame / SPRITESHEET_COLS)}px`;
        };
        animateIcon();
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
            menuItemDiv.style.backgroundColor = "rgba(250, 250, 150, .5)";
            e.preventDefault();
            e.stopPropagation();
          });
          menuItemDiv.addEventListener("mouseup", e => {
            menuItemDiv.style.backgroundColor = "rgba(100, 100, 100, 0.5)";
            if (disabled) {
              return;
            }
            const actions = item.actions ?? [];
            obj.spend(item.resourceCost);
            actions.forEach(action => {
              if (action.destroy) {
                obj.doom(true);
              }
              if (action.create) {
                const elem: Elem = JSON.parse(JSON.stringify(action.create));
                this.manager.addSceneElemAt(elem, obj.px, obj.py, {
                  owner: obj?.elem?.owner,
                  home: [obj.px, obj.py],
                });
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
            obj.refreshBars();

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
      }
    }
  }

  showBlocker() {
    this.blocker.style.display = "block";
  }

  hideBlocker() {
    this.blocker.style.display = "none";
  }

  async showResearchDialog(research: Research) {
    return new Promise<void>(resolve => {
      this.showBlocker();
      this.researchPopup.style.display = "flex";
      const { imageSource, spriteSize, frames, padding } = research.waitIcon ?? research.icon;
      const researchImage = this.researchPopup.querySelector("#researchImage") as HTMLDivElement;
      researchImage.style.backgroundImage = `url(${imageSource})`;
      researchImage.style.width = `${spriteSize[0]}px`;
      researchImage.style.height = `${spriteSize[1]}px`;
      const cols = 30;
      const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
      const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
      let animationFrame: number;
      const animateIcon = () => {
        animationFrame = requestAnimationFrame(animateIcon);
        const frame = frames[Math.floor(performance.now() / 100) % frames.length];
        researchImage.style.backgroundPosition = `${-spriteWidth * (frame % cols)}px ${-spriteHeight * Math.floor(frame / SPRITESHEET_COLS)}px`;
      };
      animateIcon();
      this.itemsToDestroy.add(() => cancelAnimationFrame(animationFrame));
      const researchText = this.researchPopup.querySelector("#researchText") as HTMLDivElement;
      researchText.textContent = `Good news, great leader!\n\nWe have discovered ${research.name}!\n${research.description ?? ""}`;

      //  play music
      this.playMusic();

      //  Speak the text
      const utterance = new SpeechSynthesisUtterance(researchText.textContent);
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(voice => voice.name.indexOf("Daniel") >= 0);
      if (voice) {
        utterance.voice = voice;
      }
      speechSynthesis.speak(utterance);

      this.blocker.addEventListener("click", () => {
        speechSynthesis.cancel();
        this.fadeMusicOut();
        this.clear();
        this.researchPopup.style.display = "none";
        this.hideBlocker();
        resolve();
      }, { once: true });
    });
  }

  musicFader: number = 0;
  fadeMusicOut() {
    let volume = this.music.volume;
    const fade = () => {
      volume -= 0.005;
      if (volume > 0) {
        this.music.volume = volume;
        this.musicFader = requestAnimationFrame(fade);
      } else {
        this.music.pause();
      }
    };
    fade();
  }

  playMusic() {
    cancelAnimationFrame(this.musicFader);
    this.music.play();
    this.music.volume = 1;
    this.music.currentTime = 0;
  }

  async showDialog(text: string, music: boolean = false, voiceName?: string): Promise<void> {
    this.showBlocker();
    this.dialog.style.display = "flex";
    this.cat.style.display = "block";
    this.dialog.textContent = text;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const voice = voiceName ? voices.find(voice => voice.name.indexOf(voiceName) >= 0) : undefined;
    if (voice) {
      utterance.voice = voice;
    }
    speechSynthesis.speak(utterance);
    if (music) {
      this.playMusic();
    }
    return new Promise(resolve => {
      this.blocker.addEventListener("click", () => {
        //  fade music out
        if (music) {
          this.fadeMusicOut();
        }

        this.dialog.style.display = "none";
        this.cat.style.display = "none";
        this.hideBlocker();
        speechSynthesis.cancel();
        this.clear();
        setTimeout(() => {
          resolve();
        }, 10);
      }, { once: true });
    });
  }

  closeDialog() {
    this.dialog.style.display = "none";
    this.hideBlocker();
  }

  initializeErrorBanner() {
    window.addEventListener("error", (event) => {
      const errorDiv = document.body.appendChild(document.createElement("div"));
      errorDiv.style.position = "absolute";
      errorDiv.style.zIndex = "1000";
      errorDiv.style.top = "0";
      errorDiv.style.left = "0";
      errorDiv.style.width = "100%";
      errorDiv.style.height = "100px";
      errorDiv.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      errorDiv.style.color = "white";
      errorDiv.style.textAlign = "center";
      errorDiv.style.fontSize = "20pt";
      errorDiv.textContent = event.message;
      errorDiv.addEventListener("click", () => {
        errorDiv.remove();
      });
    }, { once: true });
  }

  async promptForResearch(inventions: Research[], brainsPerTurn: number, currentBrains: number) {
    return new Promise<void>(resolve => {
      this.showBlocker();
      const inv = [...inventions];
      inv.sort((a, b) => {
        // if (a.cost !== b.cost) {
        //   return a.cost - b.cost;
        // }
        return Math.random() - 0.5;
      });
      while (inv.length > 3) {
        inv.pop();
      }
      this.researchList.style.display = "flex";
      this.researchList.style.height = `${inv.length * 100}px`;
      this.researchList.innerHTML = "";
      inv.forEach(invention => {
        const researchDiv = this.researchList.appendChild(document.createElement("div"));
        researchDiv.style.display = "flex";
        researchDiv.style.flexDirection = "row";
        researchDiv.style.justifyContent = "flex-start";
        researchDiv.style.alignItems = "center";
        researchDiv.style.flexGrow = "1";
        researchDiv.style.margin = "0 10px";
        researchDiv.style.gap = "10px";
        const { imageSource, spriteSize, frames, padding } = invention.icon;
        const icon = researchDiv.appendChild(document.createElement("div"));
        icon.style.backgroundImage = `url(${imageSource})`;
        icon.style.width = `${spriteSize[0]}px`;
        icon.style.height = `${spriteSize[1]}px`;
        const cols = 30;
        const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
        const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
        let animationFrame: number;
        const animateIcon = () => {
          animationFrame = requestAnimationFrame(animateIcon);
          const frame = frames[Math.floor(performance.now() / 100) % frames.length];
          icon.style.backgroundPosition = `${-spriteWidth * (frame % cols)}px ${-spriteHeight * Math.floor(frame / SPRITESHEET_COLS)}px`;
        };
        animateIcon();
        this.itemsToDestroy.add(() => cancelAnimationFrame(animationFrame));
        const midGroup = researchDiv.appendChild(document.createElement("div"));
        midGroup.style.display = "flex";
        midGroup.style.flexDirection = "column";
        midGroup.style.justifyContent = "flex-start";
        midGroup.style.alignItems = "flex-start";
        midGroup.style.flexGrow = "1";
        midGroup.style.margin = "0 10px";
        midGroup.style.gap = "5px";

        const label = midGroup.appendChild(document.createElement("div"));
        label.innerText = invention.name;
        label.style.textAlign = "left";
        label.style.fontSize = "10pt";

        const desc = midGroup.appendChild(document.createElement("div"));
        desc.innerText = invention.description ?? "";
        desc.style.textAlign = "left";
        desc.style.fontSize = "8pt";
        desc.style.color = "silver";

        const costDiv = researchDiv.appendChild(document.createElement("div"));
        costDiv.style.display = "flex";
        costDiv.style.flexDirection = "row";
        costDiv.style.alignItems = "flex-end";
        costDiv.style.justifyContent = "center";
        costDiv.style.position = "absolute";
        costDiv.style.right = "10px";
        costDiv.style.marginTop = "-40px";
        costDiv.style.color = "silver";
        const numTurns = Math.ceil((invention.cost - currentBrains) / brainsPerTurn);
        costDiv.textContent = `${numTurns} turns`;

        researchDiv.style.cursor = "pointer";
        researchDiv.style.width = "100%";
        researchDiv.addEventListener("mouseover", () => {
          researchDiv.style.backgroundColor = "rgba(100, 100, 100, 1)";
        });
        researchDiv.addEventListener("mouseout", () => {
          researchDiv.style.backgroundColor = "";
        });
        researchDiv.addEventListener("click", () => {
          this.manager.research(invention.name, this.manager.getPlayer());
          this.researchList.style.display = "none";
          this.hideBlocker();
          this.updated = false;
          resolve();
        });
      });
    });
  }

  async refreshResearchInfo() {
    const player = this.manager.getPlayer();
    const research: Research | undefined = this.manager.getResearchInfo(player);
    this.researchInfoDiv.innerHTML = "";
    if (!research) {
      this.researchInfoDiv.style.display = "none";
      return;
    }
    const researched = this.manager.isResearched(research.name, player);
    this.researchInfoDiv.style.display = "block";
    const { imageSource, spriteSize, frames, padding } = research.icon;
    const icon = this.researchInfoDiv.appendChild(document.createElement("div"));
    icon.style.backgroundImage = `url(${imageSource})`;
    icon.style.width = `${spriteSize[0]}px`;
    icon.style.height = `${spriteSize[1]}px`;
    const cols = 30;
    const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
    const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
    let animationFrame: number;
    const animateIcon = () => {
      animationFrame = requestAnimationFrame(animateIcon);
      const frame = frames[Math.floor(performance.now() / 100) % frames.length];
      icon.style.backgroundPosition = `${-spriteWidth * (frame % cols)}px ${-spriteHeight * Math.floor(frame / SPRITESHEET_COLS)}px`;
    };
    animateIcon();
    this.itemsToDestroy.add(() => cancelAnimationFrame(animationFrame));
    const label = this.researchInfoDiv.appendChild(document.createElement("div"));
    label.innerText = research.name;
    label.style.marginTop = "-30px";
    label.style.textAlign = "center";
    label.style.fontSize = "10pt";
    label.style.color = "white";
    // const desc = this.researchInfoDiv.appendChild(document.createElement("div"));
    // desc.innerText = research.description ?? "";
    // desc.style.textAlign = "center";
    // desc.style.fontSize = "8pt";
    // desc.style.color = "silver";

    const turnDiv = this.researchInfoDiv.appendChild(document.createElement("div"));
    const globalResources = await this.manager.calculateResourceRevenue(this.manager.getPlayer());
    const brainsPerTurn = globalResources.brain;
    turnDiv.style.position = "absolute";
    turnDiv.style.top = "10px";
    turnDiv.style.right = "10px";
    turnDiv.style.color = researched ? "#00ffff" : !brainsPerTurn ? "#ff0000" : "silver";
    turnDiv.style.fontSize = "8pt";

    const currentBrains = this.manager.getPlayerResource("brain", this.manager.getPlayer());
    const numTurns = Math.ceil((research.cost - currentBrains) / brainsPerTurn);
    turnDiv.textContent = researched ? `researched` : !brainsPerTurn ? "research halted" : `${numTurns} turns`;
  }
}
