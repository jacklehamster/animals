import { EngineObject, Vector2 } from "../../lib/littlejs";

export class BaseObject extends EngineObject {
  visible: boolean = true;
  constructor(pos?: Vector2, size?: Vector2) {
    super(pos, size);
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }

  render(): void {
    if (this.visible) {
      super.render();
    }
  }
}
