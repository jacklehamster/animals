export {
  cameraPos, cameraScale, EngineObject,
  mousePos, mouseWasPressed, mouseWasReleased,
  setCameraPos, setCameraScale, vec2,
  Vector2, Color, randColor,
  engineInit, TileInfo,
} from '../../dist/littlejs.esm.min';
// } from 'littlejsengine';
import { setEnablePhysicsSolver, setGamepadsEnable } from '../../dist/littlejs.esm.min';
export * as LittleJS from "../../dist/littlejs.esm.min";

setEnablePhysicsSolver(false);
setGamepadsEnable(false);
