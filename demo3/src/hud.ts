import { EngineObject } from "littlejsengine";

export class Hud {
  bg?: HTMLDivElement;
  initialize() {
    this.bg = document.body.appendChild(document.createElement("div"));
    this.bg.style.width = "100%";
    this.bg.style.height = "100px";
    this.bg.style.position = "absolute";
    this.bg.style.zIndex = "100";
    this.bg.style.bottom = "-100px";
    this.bg.style.left = "0";
    this.bg.style.background = "rgba(0, 0, 0, 1)";
    this.bg.style.transition = "bottom 0.5s";
  }

  showSelected(obj?: EngineObject) {
    if (!this.bg) return;
    this.bg.style.bottom = obj ? "0" : "-100px";
  }
}
