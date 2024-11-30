import { debugClear, engineInit, engineObjects, engineObjectsDestroy, mainContext, mouseWasPressed, setCameraScale } from "littlejsengine";
import { GameObject } from "./game-object";
import type { Scene } from "./type/scene";
import type { Processor } from "./processors/processor";
import type { Element } from "./type/element";

export class GameWorld {
  textures: string[] = [];
  gameObjs: Map<Element, GameObject[]> = new Map();
  changeScene?: (index: number | ((index: number) => number)) => void;
  updateProcessors: Processor[] = [];

  constructor(private processors: Processor[]) {
    this.processors.sort((a, b) => a.priority - b.priority);
    this.updateProcessors = this.processors.filter((processor) => processor.update);
  }

  setScene(scene: Scene, changeScene: (index: number | ((index: number) => number)) => void) {
    this.destroy();
    this.changeScene = changeScene;
    this.processors.forEach((processor) => {
      scene.world.elements?.forEach((element) => {
        const objs: GameObject[] = [];
        this.gameObjs.set(element, objs);
        processor.init?.(element, this);
      });
    });

    scene.world.elements?.forEach((element) => {
      if (element.world?.animation) {
        const anim = element.world?.animation[0];
        const texture = anim.texture;
        if (!this.textures.includes(texture)) {
          this.textures.push(texture);
        }
      }
    });

    engineInit(
      () => this.createWorld(),
      () => this.refreshWorld(),
      () => { },
      () => this.postUpdate(),
      () => this.refreshHud(),
      this.textures);
  }

  createWorld() {
    this.gameObjs.forEach((objs, element) => {
      this.processors.forEach((processor) => {
        processor.process?.(element, this, objs);
      });
    });
  }
  refreshWorld() {
    this.gameObjs.forEach((objs, element) => {
      this.updateProcessors.forEach((processor) => {
        processor.update?.(element, this, objs);
      });
    });
  }
  refreshHud() {
    this.gameObjs.forEach((_objs, element) => {
      this.processors.forEach((processor) => {
        processor.refreshHud?.(element, this);
      });
    });
  }
  postUpdate() {
    this.gameObjs.forEach((objs, element) => {
      this.processors.forEach((processor) => {
        processor.postUpdate?.(element, this, objs);
      });
    });
  }
  async destroy() {
    this.gameObjs.forEach((objs) => {
      this.processors.forEach((processor) => {
        processor.destroy?.(this, objs);
      });
      objs.length = 0;
    });
    this.gameObjs.clear();
    this.textures.length = 0;
    engineObjectsDestroy();
    debugClear();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
