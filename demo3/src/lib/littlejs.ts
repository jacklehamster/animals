export {
  cameraPos, cameraScale, EngineObject,
  mousePos, mouseWasPressed, mouseWasReleased,
  setCameraPos, setCameraScale, vec2,
  Vector2, Color, randColor,
  engineInit, TileInfo,
  Medal, medalsInit, medals,
  ASSERT, setTouchInputEnable,
  isTouchDevice,
  zzfx,
} from '../../dist/littlejs.esm.min';
// } from 'littlejsengine';
import { setEnablePhysicsSolver, setGamepadsEnable, setShowSplashScreen, medals } from '../../dist/littlejs.esm.min';
export * as LittleJS from "../../dist/littlejs.esm.min";

import { newgrounds } from './external/newgrounds';
export { NewgroundsMedal } from "./external/newgrounds";

setShowSplashScreen(true);
setEnablePhysicsSolver(false);
setGamepadsEnable(false);

export function postScore(board: number, score: number) {
  newgrounds?.postScore(board, score);
}
