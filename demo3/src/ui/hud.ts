import { GameObject } from "../core/objects/game-object";
import type { Manager } from "../core/manager";
import type { Resources } from "../definition/resources";
import { DEBUG } from "../content/constant";
import type { Research } from "../definition/research";
import { isTouchDevice, zzfx } from "../lib/littlejs";
import type { Elem } from "../definition/elem";
import type { QuickAction } from "../definition/quick-actions";
import type { Medal } from "../definition/medal";

const SPRITESHEET_COLS = 30;

speechSynthesis.getVoices();

export class Hud {
  ui: HTMLDivElement = document.createElement("div");
  bg: HTMLDivElement = document.createElement("div");
  buttonsOverlay: HTMLDivElement = document.createElement("div");
  quickActionOverlay: HTMLDivElement = document.createElement("div");
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
  spaceshipPopup: HTMLDivElement = document.createElement("div");
  music: HTMLAudioElement = document.createElement("audio");
  confirmDialog: HTMLDivElement = document.createElement("div");
  medalsView: HTMLDivElement = document.createElement("div");
  updated = false;
  onKnob = false;

  constructor(readonly manager: Manager) {
  }

  hookupClick(elem: HTMLElement, callback: () => void, condition?: () => boolean) {
    elem.style.cursor = "pointer";
    elem.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
    });
    elem.addEventListener("click", e => {
      if (condition && !condition()) {
        return;
      }
      zzfx(...[.8, , 788, .02, .03, .04, , 1.1, , -1, , , , .1, 191, , , .83, .01, .01, 125]); // Blip 105
      e.preventDefault();
      e.stopPropagation();
      callback();
    });
    elem.addEventListener("touchstart", e => {
      if (condition && !condition()) {
        return;
      }
      zzfx(...[.8, , 788, .02, .03, .04, , 1.1, , -1, , , , .1, 191, , , .83, .01, .01, 125]); // Blip 105
      e.preventDefault();
      e.stopPropagation();
      callback();
    }, { passive: false, capture: true });
  }

  initialize() {
    this.ui.id = "hud";
    this.ui.classList.add("hud");
    document.body.appendChild(this.ui);
    this.ui.addEventListener("mouseover", () => {
      this.manager.inUI = true;
      this.manager.cursor?.hide();
    }, { capture: true, passive: false });
    this.ui.addEventListener("mouseout", () => {
      this.manager.inUI = false;
      this.manager.refreshCursor();
    }, { capture: true, passive: false });
    this.ui.style.display = "none";

    this.bg.classList.add("bg");
    this.bg.style.width = "100%";
    this.bg.style.position = "absolute";
    this.bg.style.zIndex = "100";
    this.bg.style.left = "0";
    this.bg.style.background = "rgba(0, 0, 0, 1)";
    this.bg.style.transition = "bottom 0.2s";
    this.bg.style.display = "flex";
    this.bg.style.color = "snow";
    this.bg.style.flexDirection = "row";
    this.ui.appendChild(this.bg);

    this.quickActionOverlay.style.position = "absolute";
    this.quickActionOverlay.style.zIndex = "100";
    this.quickActionOverlay.style.left = "0";
    this.quickActionOverlay.style.bottom = "-100px";
    this.quickActionOverlay.style.display = "flex";
    this.quickActionOverlay.style.flexDirection = "row";
    this.quickActionOverlay.style.transition = "bottom 0.2s";
    this.ui.appendChild(this.quickActionOverlay);

    this.buttonsOverlay.style.bottom = "0";
    this.buttonsOverlay.style.right = "0";
    this.buttonsOverlay.style.zIndex = "100";
    this.buttonsOverlay.style.position = "absolute";
    // this.buttonsOverlay.style.display = "flex";
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
    this.resourceOverlay.style.display = "none";
    this.ui.appendChild(this.resourceOverlay);

    this.blocker.style.width = "100%";
    this.blocker.style.height = "100%";
    this.blocker.style.position = "absolute";
    this.blocker.style.zIndex = "100";
    this.blocker.style.top = "0";
    this.blocker.style.left = "0";
    this.blocker.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    this.blocker.style.display = "none";
    this.ui.appendChild(this.blocker);

    this.hookupClick(this.blocker, () => {
      this.executeTap();
    }, () => !!this.onTap);

    this.dialog.style.position = "absolute";
    this.dialog.style.zIndex = "200";
    this.dialog.style.top = "10px";
    this.dialog.style.left = "50%";
    this.dialog.style.transform = "translate(-50%, 0)";
    this.dialog.style.width = "80%";
    this.dialog.style.padding = "20px";
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
    this.researchList.style.cursor = "pointer";
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
    this.researchPopup.style.maxWidth = "100vw";
    this.researchPopup.style.maxHeight = "calc(100vw * 6 / 8)";
    this.researchPopup.style.backgroundImage = "url(./assets/researched.png)";
    this.researchPopup.style.backgroundSize = "contain";
    this.researchPopup.style.pointerEvents = "none";
    this.researchPopup.style.opacity = "0";
    this.researchPopup.style.transition = "opacity .2s";
    this.researchPopup.style.display = "none";

    this.spaceshipPopup.style.position = "absolute";
    this.spaceshipPopup.style.zIndex = "100";
    this.spaceshipPopup.style.top = "50%";
    this.spaceshipPopup.style.left = "50%";
    this.spaceshipPopup.style.transform = "translate(-50%, -50%)";
    this.spaceshipPopup.style.width = "800px";
    this.spaceshipPopup.style.height = "600px";
    this.researchPopup.style.maxWidth = "100vw";
    this.researchPopup.style.maxHeight = "calc(100vw * 6 / 8)";
    this.spaceshipPopup.style.backgroundImage = "url(./assets/spaceship.png)";
    this.spaceshipPopup.style.backgroundSize = "contain";
    this.spaceshipPopup.style.pointerEvents = "none";
    this.spaceshipPopup.style.opacity = "0";
    this.spaceshipPopup.style.transition = "opacity .2s";
    this.spaceshipPopup.style.display = "none";

    const researchImage = this.researchPopup.appendChild(document.createElement("div"));
    researchImage.id = "researchImage";
    researchImage.style.position = "absolute";
    researchImage.style.top = "30%";
    researchImage.style.left = "50%";
    researchImage.style.transform = "translate(-50%, -50%) scale(2)";
    researchImage.style.transition = "opacity 3s";
    researchImage.style.opacity = "0";
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

    const spaceshipText = this.spaceshipPopup.appendChild(document.createElement("div"));
    spaceshipText.id = "spaceshipText";
    spaceshipText.style.position = "absolute";
    spaceshipText.style.bottom = "10px";
    spaceshipText.style.left = "50%";
    spaceshipText.style.transform = "translate(-50%, 0)";
    spaceshipText.style.width = "80%";
    spaceshipText.style.height = "100px";
    spaceshipText.style.backgroundColor = "rgba(0, 0, 0, .7)";
    spaceshipText.style.color = "snow";
    spaceshipText.style.flexDirection = "column";
    spaceshipText.style.justifyContent = "center";
    spaceshipText.style.alignItems = "center";
    spaceshipText.style.textAlign = "center";
    spaceshipText.style.textTransform = "uppercase";
    spaceshipText.style.display = "flex";
    spaceshipText.style.pointerEvents = "none";
    spaceshipText.style.whiteSpace = "pre-wrap";
    this.ui.appendChild(this.spaceshipPopup);

    this.confirmDialog.style.position = "absolute";
    this.confirmDialog.style.zIndex = "200";
    this.confirmDialog.style.top = "50%";
    this.confirmDialog.style.left = "50%";
    this.confirmDialog.style.transform = "translate(-50%, -50%)";
    this.confirmDialog.style.width = "400px";
    this.confirmDialog.style.height = "200px";
    this.confirmDialog.style.maxWidth = "100vw";
    this.confirmDialog.style.backgroundColor = "rgba(0, 0, 0, .7)";
    this.confirmDialog.style.color = "snow";
    this.confirmDialog.style.flexDirection = "column";
    this.confirmDialog.style.justifyContent = "center";
    this.confirmDialog.style.alignItems = "center";
    this.confirmDialog.style.textAlign = "center";
    this.confirmDialog.style.textTransform = "uppercase";
    this.confirmDialog.style.padding = "20px";
    this.confirmDialog.style.display = "none";
    this.ui.appendChild(this.confirmDialog);

    //  top right, next to resources div
    this.medalsView.style.position = "absolute";
    this.medalsView.style.zIndex = "100";
    this.medalsView.style.top = "5px";
    this.medalsView.style.left = "100px";
    this.medalsView.style.display = "flex";
    this.medalsView.style.flexDirection = "row";
    this.medalsView.style.justifyContent = "center";
    this.medalsView.style.alignItems = "center";
    this.medalsView.style.textAlign = "center";
    this.medalsView.style.textTransform = "uppercase";
    this.ui.appendChild(this.medalsView);


    this.setupShortcutKeys();
    this.initializeErrorBanner();
    this.setupMusic();
    this.setupQuickActions();
    if (!isTouchDevice) {
      this.setupZoom();
    } else {
      this.manager.resizeCamera(50);
    }
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

  async update() {
    if (this.updated) {
      return;
    }
    if (this.manager.getPlayer()) {
      this.endButton.innerHTML = `<u style='color: blue'>E</u>nd turn ${this.manager.getTurn()}`;
      await this.refreshResources();
      await this.refreshTax();
      this.refreshButtons();
      await this.refreshResearchInfo();
      this.ui.style.display = "block";
      this.updated = true;
      this.endButton.disabled = !!this.manager.isAiPlayer(this.manager.getPlayer())
        || this.dialog.style.display !== "none";
      await this.updateMedals();
    }
  }

  async updateMedals() {
    const medalsManager = this.manager.medals;
    if (this.manager.isAiPlayer(this.manager.getPlayer())) {
      return;
    }
    this.medalsView.innerHTML = "";

    const medals = [...(this.manager.scene.medals ?? [])];
    medals.sort((a: Medal, b: Medal) => {
      const unlockedA = this.manager.medals.isUnlocked(a.name) ? 1 : 0;
      const unlockedB = this.manager.medals.isUnlocked(b.name) ? 1 : 0;
      if (unlockedA !== unlockedB) {
        return unlockedB - unlockedA;
      }
      return a.name.localeCompare(b.name);
    });

    medals.forEach(medal => {
      if (medal.showInUI) {
        const medalDiv = this.medalsView.appendChild(document.createElement("div"));
        medalDiv.textContent = `${medal.icon}`;
        medalDiv.style.opacity = medalsManager.isUnlocked(medal.name) ? "1" : "0.3";
        medalDiv.title = medalsManager.isUnlocked(medal.name) ? `Medal unlocked: ${medal.name} ${medal.description}` : "";
      }
    });
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

    const taxValue = this.manager.getTaxValue(this.manager.getPlayer());
    RESOURCES.forEach((resource, index) => {
      const resTax = index === 0 ? 100 - taxValue : taxValue;
      const revenueValue = revenuePerResource[resource];
      const taxText = document.getElementById(`${resource}-tax`) as HTMLDivElement;
      if (taxText) {
        taxText.textContent = `${revenueValue >= 0 ? '+' : ''}${revenueValue} (${resTax}%)`;
      }
    });

    if (!isTouchDevice) {
      //  add knob to adjust tax
      let taxKnob = document.getElementById("tax") as HTMLInputElement;
      if (!taxKnob) {
        taxKnob = (this.resourceOverlay.appendChild(document.createElement("input")));
        taxKnob.id = "tax";
        taxKnob.type = "range";
        taxKnob.min = "0";
        taxKnob.max = "100";
        taxKnob.step = "10";
        taxKnob.value = `${this.manager.getTaxValue(this.manager.getPlayer())}`;
        taxKnob.style.width = "60px";
        taxKnob.style.marginTop = "20px";
        taxKnob.addEventListener("input", async e => {
          this.manager.updateTaxValue(player, parseInt(taxKnob.value));
          await this.refreshTax();
          await this.refreshResearchInfo();
        });
        taxKnob.addEventListener("mouseover", e => {
          this.onKnob = true;
        });
        taxKnob.addEventListener("mouseout", e => {
          this.onKnob = false;
        });
      }
      taxKnob.value = taxValue.toString();
      taxKnob.style.display = hasRevenue ? "block" : "none";
    }
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

        this.hookupClick(icon, async () => {
          const player = this.manager.getPlayer();
          let taxValue = this.manager.getTaxValue(this.manager.getPlayer());
          if (index === 0) {
            taxValue = Math.min(100, taxValue - 10);
          } else {
            taxValue = Math.max(0, taxValue + 10);
          }
          this.manager.updateTaxValue(player, taxValue);
          await this.refreshTax();
          await this.refreshResearchInfo();
        });

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
        }, 500);
      }
      let taxText = document.getElementById(`${resource}-tax`) as HTMLDivElement;
      if (!taxText) {
        taxText = this.resourceOverlay.appendChild(document.createElement("div"));
        taxText.id = `${resource}-tax`;
        taxText.style.color = "white";
        taxText.style.width = "100%";
        taxText.style.marginTop = "-20px";
        taxText.style.textAlign = "center";
        taxText.style.fontSize = "8pt";
        taxText.style.pointerEvents = "none";
      }
    });

    const revenuePerResource = await this.manager.calculateResourceRevenue(this.manager.getPlayer());
    const hasRevenue = Object.values(revenuePerResource).some(value => value > 0);
    const hasResource = RESOURCES.some(resource => this.manager.getPlayerResource(resource, this.manager.getPlayer()) > 0);
    this.resourceOverlay.style.display = hasRevenue || hasResource ? "block" : "none";
  }

  flashEndTurn(temp = false) {
    this.ui.querySelector("#zoomGroup")?.classList.remove("hidden");
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

  setupQuickActions() {
    const quickActions = this.manager.quickActions();
    quickActions.forEach(action => {
      const { imageSource, spriteSize, frames, padding } = action.icon;
      const icon = this.quickActionOverlay.appendChild(document.createElement("div"));
      //  setup icon
      icon.style.backgroundImage = `url(${imageSource})`;
      icon.style.width = `${spriteSize[0]}px`;
      icon.style.height = `${spriteSize[1]}px`;
      icon.title = action.description;
      const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
      const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
      icon.style.backgroundPosition = `${-spriteWidth * (frames[0] % SPRITESHEET_COLS)}px ${-spriteHeight * Math.floor(frames[0] / SPRITESHEET_COLS)}px`;
      icon.style.cursor = "pointer";
      icon.style.backgroundColor = "rgb(50, 50, 50, .3)";

      icon.addEventListener("mouseover", e => {
        icon.style.backgroundColor = "rgb(200, 200, 0, .7)";
      });
      icon.addEventListener("mouseout", e => {
        icon.style.backgroundColor = "rgb(50, 50, 50, .3)";
      });
      this.hookupClick(icon, () => {
        this.confirmQuickAction(action);
        // this.manager.performQuickAction(action);
      });
    });
  }

  confirmQuickAction(action: QuickAction) {
    //  show confirmDialog to confirm action or cancel
    this.confirmDialog.style.display = "flex";
    this.confirmDialog.innerHTML = `<div>${action.description}</div>`;
    const confirmButton = this.confirmDialog.appendChild(document.createElement("button"));
    confirmButton.textContent = "confirm";
    confirmButton.style.cursor = "pointer";
    confirmButton.style.margin = "10px";
    this.hookupClick(confirmButton, async () => {
      await this.waitABit(100);
      this.manager.performQuickAction(action);
      this.confirmDialog.style.display = "none";
    });
    const cancelButton = this.confirmDialog.appendChild(document.createElement("button"));
    cancelButton.textContent = "cancel";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.margin = "10px";
    this.hookupClick(cancelButton, async () => {
      await this.waitABit(100);
      this.confirmDialog.style.display = "none";
    });
  }

  turnPage() {
  }

  setupZoom() {
    const zoomGroup = this.ui.appendChild(document.createElement("div"));
    zoomGroup.id = "zoomGroup";
    zoomGroup.classList.add("hidden");
    zoomGroup.style.display = "flex";
    zoomGroup.style.flexDirection = "column";
    zoomGroup.style.justifyContent = "center";
    zoomGroup.style.alignItems = "center";
    zoomGroup.style.gap = "10px";
    zoomGroup.style.position = "absolute";
    zoomGroup.style.top = "50%";
    zoomGroup.style.right = "0px";
    zoomGroup.style.zIndex = "100";

    const zoomLabel = zoomGroup.appendChild(document.createElement("label"));
    zoomLabel.textContent = "zoom";
    zoomLabel.htmlFor = "zoom";
    zoomLabel.style.fontWeight = "bold";

    const zoomKnob = zoomGroup.appendChild(document.createElement("input"));
    zoomKnob.id = "zoom";
    zoomKnob.type = "range";
    zoomKnob.min = "40";
    zoomKnob.max = "200";
    zoomKnob.step = "5";
    zoomKnob.value = "80";
    zoomKnob.style.width = "100px";
    zoomKnob.style.marginTop = "40px";
    zoomKnob.style.transform = "rotate(90deg)";
    zoomKnob.addEventListener("input", e => {
      this.manager.resizeCamera(parseInt(zoomKnob.value));
    });
    zoomKnob.addEventListener("mouseover", e => {
      this.onKnob = true;
    });
    zoomKnob.addEventListener("mouseout", e => {
      this.onKnob = false;
    });
  }

  setHudButtons() {
    //  add animation above end turn
    let icon: HTMLDivElement | null = null;
    if (this.manager.scene.endTurnAnim) {
      const animation = this.buttonsOverlay.appendChild(document.createElement("div"));
      animation.style.position = "absolute";
      animation.style.marginTop = "-140px";
      animation.style.pointerEvents = "none";
      const { imageSource, spriteSize, frames, padding } = this.manager.scene.endTurnAnim;
      icon = animation.appendChild(document.createElement("div"));
      icon.style.backgroundImage = `url(${imageSource})`;
      icon.style.width = `${spriteSize[0]}px`;
      icon.style.height = `${spriteSize[1]}px`;
      icon.style.zIndex = "100";
      icon.style.pointerEvents = "auto";
      icon.style.transform = "scale(0.3) translate(-100%, -100%)";
      const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
      const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
      let animationFrame: number;
      let animStart = 0;
      const animateIcon = () => {
        let frameIndex = Math.floor((performance.now() - animStart) / 100) % frames.length;
        if (frameIndex === frames.length - 1) {
          frameIndex = 0;
        } else {
          animationFrame = requestAnimationFrame(animateIcon);
        }
        const frame = frames[frameIndex];
        if (icon) {
          icon.style.backgroundPosition = `${-spriteWidth * (frame % SPRITESHEET_COLS)}px ${-spriteHeight * Math.floor(frame / SPRITESHEET_COLS)}px`;
        }
      };
      this.turnPage = () => {
        cancelAnimationFrame(animationFrame);
        animStart = performance.now();
        animateIcon();
      }
    }


    const endButton = this.buttonsOverlay.appendChild(this.endButton);
    endButton.style.width = "150px";
    endButton.id = "endButton";
    const endTurnAction = () => {
      endButton.disabled = true;
      this.stopFlashEndTurn();
      this.manager.gotoNextTurn();
      const timeout = setTimeout(() => {
        if (endButton.disabled) {
          endButton.disabled = false;
        }
      }, 2000);
      this.itemsToDestroy.add(() => clearTimeout(timeout));
    };
    if (icon) {
      this.hookupClick(icon, endTurnAction, () => !endButton.disabled);
    }
    this.hookupClick(endButton, endTurnAction, () => !endButton.disabled);
    endButton.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
    });
    endButton.addEventListener("mouseup", e => {
      e.preventDefault();
      e.stopPropagation();
    });

    const nextButton = this.buttonsOverlay.appendChild(this.nextButton);
    nextButton.innerHTML = "<u style='color: blue'>N</u>ext unit";
    nextButton.id = "nextButton";
    nextButton.style.width = "150px";
    this.hookupClick(nextButton, () => {
      this.manager.selectNext();
    });
    nextButton.style.display = "none";
    if (!isTouchDevice) {
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
  }

  clear() {
    this.itemsToDestroy.forEach((item) => item());
    this.itemsToDestroy.clear();
  }

  async showSelected(obj?: GameObject) {

    const isAi = obj && this.manager.isAiPlayer(obj.elem?.owner);
    const menu = isAi ? undefined : this.manager.getMenu(obj?.elem?.name);
    if (menu?.items.length) {
      this.bg.classList.add("open");
      this.quickActionOverlay.classList.add("open");
    } else {
      this.bg.classList.remove("open");
      this.quickActionOverlay.classList.remove("open");
    }
    if (obj?.elem?.type !== "unit" || obj?.elem?.disableQuickActions || isAi) {
      this.quickActionOverlay.classList.add("removed");
    } else {
      this.quickActionOverlay.classList.remove("removed");
    }
    this.quickActionOverlay.style.bottom = obj?.elem?.type !== "unit" || obj?.elem?.disableQuickActions || isAi ? `-100px` : menu?.items.length ? `${this.bg.offsetHeight}px` : "0";
    this.buttonsOverlay.style.right = menu?.items.length ? "-200px" : "0";
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
      label.style.pointerEvents = "none";

      const descDiv = this.bg.appendChild(document.createElement("div"));
      const desc = descDiv.appendChild(document.createElement("div"));
      desc.style.margin = "20px 20px";
      desc.style.color = "silver";
      desc.style.width = "0px";
      const descContent = desc.appendChild(document.createElement("div"));
      descContent.style.position = "absolute";
      descContent.style.maxWidth = "200px";
      descContent.style.pointerEvents = "none";
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
      menuDiv.style.alignItems = "flex-end";
      menuDiv.style.flexGrow = "1";
      menuDiv.style.margin = "0 10px";
      menuDiv.style.marginLeft = "-100px";
      menuDiv.style.gap = "10px";

      let hasMenu = false;
      for (const item of menu.items) {
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
        hasMenu = true;

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
          this.hookupClick(menuItemDiv, async () => {
            menuItemDiv.style.backgroundColor = "rgba(100, 100, 100, 0.5)";
            if (disabled) {
              return;
            }
            obj.spend(item.resourceCost);
            const actions = item.actions ?? [];
            for (const action of actions) {
              await this.manager.performAction(action, obj);
            }
            obj.refreshLabel();
            this.updated = false;
            obj.refreshBars();
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
      if (hasMenu) {
        this.bg.classList.remove("nomenu");
        this.quickActionOverlay.classList.remove("nomenu");
      } else {
        this.bg.classList.add("nomenu");
        this.quickActionOverlay.classList.add("nomenu");
      }
    }
  }

  showBlocker(clickable?: boolean) {
    this.captureTouch();
    this.blocker.style.display = "block";
    this.blocker.style.cursor = clickable ? "pointer" : "default";
  }

  hideBlocker() {
    this.releaseTouch();
    this.blocker.style.display = "none";
  }

  async showSpaceshipDialog() {
    this.spaceshipPopup.style.display = "flex";
    await new Promise<void>(resolve => setTimeout(resolve, 100));
    return new Promise<void>(async resolve => {
      this.spaceshipPopup.style.opacity = "1";
      this.showBlocker(true);
      const spaceshipText = this.spaceshipPopup.querySelector("#spaceshipText") as HTMLDivElement;
      spaceshipText.textContent = `Good news, great leader! We have built the spaceship!\nWe can now travel accross the galaxy,\nand leave those poor humans behind!\nTHE END`;

      const animalsSaved: Elem[] = [];
      await this.manager.iterateRevealedCells(async (cell: GameObject) => {
        if (cell.elem?.owner === this.manager.getPlayer() && cell.elem?.type === "unit") {
          animalsSaved.push(cell.elem);
        }
      });
      //  create div overlay for each animal saved
      const overlay = this.spaceshipPopup.appendChild(document.createElement("div"));
      overlay.style.position = "absolute";
      overlay.style.top = "50%";
      overlay.style.left = "50%";
      overlay.style.transform = `translate(-50%, -50%)`;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.pointerEvents = "none";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "row";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.gap = "10px";
      overlay.style.flexWrap = "wrap";
      overlay.style.overflow = "auto";
      overlay.style.maxHeight = "80%";

      // for (let i = 0; i < 5; i++) {
      //   animalsSaved.push(...animalsSaved);
      // }

      //  show icon for all animals saved
      for (const animal of animalsSaved) {
        const anim = animal.selected?.animation ?? animal.animation;
        if (!anim) {
          continue;
        }
        const animObj = this.manager.scene.animations.find(animObj => animObj.name === anim);
        if (!animObj) {
          continue;
        }
        const { imageSource, spriteSize, frames, padding } = animObj;
        const icon = this.spaceshipPopup.appendChild(document.createElement("div"));
        icon.style.backgroundImage = `url(${imageSource})`;
        icon.style.width = `${spriteSize[0]}px`;
        icon.style.height = `${spriteSize[1]}px`;
        icon.style.position = "absolute";
        icon.style.top = "50%";
        icon.style.left = "50%";
        icon.style.transform = `translate(-50%, -50%)`;
        icon.style.pointerEvents = "none";
        const cols = 30;
        const spriteWidth = (spriteSize[0] + (padding?.[0] ?? 2) * 2);
        const spriteHeight = (spriteSize[1] + (padding?.[1] ?? 2) * 2);
        //  place icon at random position on the screen
        const x = 50 + (Math.random() - .5) * 50;
        const y = 50 + (Math.random() - .5) * 30;
        icon.style.left = `${x}%`;
        icon.style.top = `${y}%`;
        let animationFrame: number;
        const animateIcon = () => {
          animationFrame = requestAnimationFrame(animateIcon);
          const frame = frames[Math.floor(performance.now() / 100) % frames.length];
          icon.style.backgroundPosition = `${-spriteWidth * (frame % cols)}px ${-spriteHeight * Math.floor(frame / SPRITESHEET_COLS)}px`;
        };
        animateIcon();
        this.itemsToDestroy.add(() => cancelAnimationFrame(animationFrame));

      }



      //  play music
      this.playMusic();

      //  Speak the text
      const utterance = new SpeechSynthesisUtterance(spaceshipText.textContent);
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(voice => voice.name.indexOf("Daniel") >= 0);
      if (voice) {
        utterance.voice = voice;
      }
      speechSynthesis.speak(utterance);

      await this.waitABit();

      this.onTap = async () => {
        overlay.parentNode?.removeChild(overlay);
        speechSynthesis.cancel();
        this.fadeMusicOut();
        this.clear();
        this.spaceshipPopup.style.opacity = "0";
        // this.researchPopup.style.display = "none";
        this.hideBlocker();
        resolve();
        await this.waitABit(300);
        this.spaceshipPopup.style.display = "none";
      };
    });
  }

  executeTap() {
    const onTap = this.onTap;
    this.onTap = undefined;
    onTap?.();
  }

  private onTap?: () => void;

  async showResearchDialog(research: Research) {
    this.researchPopup.style.display = "flex";
    await this.waitABit(100);

    return new Promise<void>(async (resolve) => {
      this.showBlocker(true);
      // this.researchPopup.style.display = "flex";
      this.researchPopup.style.opacity = "1";
      const { imageSource, spriteSize, frames, padding } = research.waitIcon ?? research.icon;
      const researchImage = this.researchPopup.querySelector("#researchImage") as HTMLDivElement;
      researchImage.style.backgroundImage = `url(${imageSource})`;
      researchImage.style.width = `${spriteSize[0]}px`;
      researchImage.style.height = `${spriteSize[1]}px`;
      researchImage.style.opacity = "1";
      researchImage.style.imageRendering = "pixelated";
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

      await this.waitABit();
      this.onTap = async () => {
        speechSynthesis.cancel();
        this.fadeMusicOut();
        this.clear();
        this.researchPopup.style.opacity = "0";
        this.hideBlocker();
        resolve();
        researchImage.style.opacity = "0";
        await this.waitABit(300);
        this.researchPopup.style.display = "none";
      };
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

  touchCaptured = false;

  captureTouch() {
    this.touchCaptured = true;
  }

  releaseTouch() {
    this.touchCaptured = false;
  }

  async showDialog(text: string, music: boolean = false, voiceName?: string): Promise<void> {
    this.showBlocker(true);
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
    return new Promise(async resolve => {
      await this.waitABit(500);
      this.onTap = async () => {
        speechSynthesis.cancel();

        //  fade music out
        if (music) {
          this.fadeMusicOut();
        }

        this.dialog.style.display = "none";
        this.cat.style.display = "none";
        this.hideBlocker();
        this.clear();
        await this.waitABit(10);
        resolve();
      };
    });
  }

  async waitABit(time = 1000) {
    await new Promise<void>(resolve => setTimeout(resolve, time));
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
      this.hookupClick(errorDiv, () => {
        errorDiv.remove();
      });
    }, { once: true });
  }

  async promptForResearch(inventions: Research[], brainsPerTurn: number, currentBrains: number) {
    if (!inventions.length) {
      this.manager.scene.players[this.manager.getPlayer() - 1].currentResearch = undefined;
      return;
    }
    return new Promise<void>(resolve => {
      this.showBlocker();
      const inv = [...inventions];
      inv.sort((a, b) => {
        if (DEBUG) {
          if (a.forceInDebug !== b.forceInDebug) {
            return a.forceInDebug ? -1 : 1;
          }
        }
        if (a.cost !== b.cost) {
          return a.cost - b.cost;
        }
        return Math.random() - 0.5;
      });
      while (inv.length > 4) {
        inv.pop();
      }
      inv.sort((a, b): number => {
        const recA = a.recommended ?? 10000;
        const recB = b.recommended ?? 10000;
        if (recA !== recB) {
          return recA - recB;
        }
        return Math.random() - .5;
      })
      this.researchList.style.display = "flex";
      this.researchList.style.height = `${inv.length * 100}px`;
      this.researchList.innerHTML = "";
      inv.forEach((invention, index) => {
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

        const labelGroup = midGroup.appendChild(document.createElement("div"));
        labelGroup.style.display = "flex";
        labelGroup.style.flexDirection = "row";
        const label = labelGroup.appendChild(document.createElement("div"));
        label.innerText = invention.name;
        label.style.textAlign = "left";
        label.style.fontSize = "10pt";
        if (index === 0) {  //recommended
          const rec = labelGroup.appendChild(document.createElement("div"));
          rec.innerText = "recommended";
          rec.style.textAlign = "left";
          rec.style.fontSize = "8pt";
          rec.style.color = "gold";
          rec.style.marginLeft = "10px";
          rec.style.marginTop = "3px";
          researchDiv.style.backgroundColor = "rgba(70, 60, 0, 1)";
        }

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
        const numTurns = Math.max(0, Math.ceil((invention.cost - currentBrains) / brainsPerTurn));
        costDiv.textContent = `${numTurns} turns`;

        researchDiv.style.cursor = "pointer";
        researchDiv.style.width = "100%";
        researchDiv.addEventListener("mouseover", () => {
          researchDiv.style.backgroundColor = index === 0 ? "rgba(120, 100, 0, 1)" : "rgba(100, 100, 100, 1)";
        });
        researchDiv.addEventListener("mouseout", () => {
          researchDiv.style.backgroundColor = index === 0 ? "rgba(70, 60, 0, 1)" : "";
        });
        this.hookupClick(researchDiv, () => {
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
    // this.researchInfoDiv.innerHTML = "";
    if (!research) {
      this.researchInfoDiv.style.display = "none";
      return;
    }
    this.researchInfoDiv.classList.add("research-flash-temp");
    setTimeout(() => {
      this.researchInfoDiv.classList.remove("research-flash-temp");
    }, 1000);

    const researched = this.manager.isResearched(research.name, player);
    this.researchInfoDiv.style.display = "block";
    const { imageSource, spriteSize, frames, padding } = research.icon;
    const icon: HTMLDivElement = this.researchInfoDiv.querySelector("#researchIcon") ?? this.researchInfoDiv.appendChild(document.createElement("div"));
    icon.id = "researchIcon";
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
    const label: HTMLDivElement = this.researchInfoDiv.querySelector("#researchLabel") ?? this.researchInfoDiv.appendChild(document.createElement("div"));
    label.id = "researchLabel";
    label.innerText = research.name;
    label.style.marginTop = "-30px";
    label.style.textAlign = "center";
    label.style.fontSize = "10pt";
    label.style.color = "white";

    const turnDiv: HTMLDivElement = this.researchInfoDiv.querySelector("#researchTurns") ?? this.researchInfoDiv.appendChild(document.createElement("div"));
    turnDiv.id = "researchTurns";
    const globalResources = await this.manager.calculateResourceRevenue(this.manager.getPlayer());
    const brainsPerTurn = globalResources.brain;
    turnDiv.style.position = "absolute";
    turnDiv.style.top = "10px";
    turnDiv.style.right = "10px";
    turnDiv.style.color = researched ? "#00ffff" : !brainsPerTurn ? "#ff0000" : "silver";
    turnDiv.style.fontSize = "10pt";

    const currentBrains = this.manager.getPlayerResource("brain", this.manager.getPlayer());
    const numTurns = Math.max(0, Math.ceil((research.cost - currentBrains) / brainsPerTurn));
    turnDiv.textContent = researched ? `researched` : !brainsPerTurn ? "research halted" : `${numTurns} turns`;

    const percentage = researched ? 100 : Math.min(100, Math.max(0, Math.floor((currentBrains / research.cost) * 100)));
    //  use percentage to show progress bar on the researchInfoDiv
    const progress: HTMLDivElement = this.researchInfoDiv.querySelector("#researchProgress") ?? this.researchInfoDiv.appendChild(document.createElement("div"));
    progress.id = "researchProgress";
    progress.style.position = "absolute";
    progress.style.bottom = "-10px";
    progress.style.left = "0";
    progress.style.width = "100%";
    progress.style.height = "10px";
    progress.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    const progressBar: HTMLDivElement = this.researchInfoDiv.querySelector("#progressBar") ?? progress.appendChild(document.createElement("div"));
    progressBar.id = "progressBar";
    progressBar.style.width = `${percentage}%`;
    progressBar.style.height = "100%";
    progressBar.style.transition = "width 0.5s, background-color 0.2s";
    progressBar.style.backgroundColor = `rgba(0, ${255 * percentage / 100}, 255, 1)`;
  }
}
