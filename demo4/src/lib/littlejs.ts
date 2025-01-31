export {
  cameraPos, cameraScale, EngineObject,
  mousePos, mouseWasPressed, mouseWasReleased,
  setCameraPos, setCameraScale,
  Vector2, Color, randColor,
  engineInit, TileInfo,
  Medal, medalsInit,
  ASSERT, setTouchInputEnable,
  isTouchDevice,
  zzfx,
  mainCanvas, mainCanvasSize,
  vec2, setCanvasFixedSize, setEnablePhysicsSolver, setGamepadsEnable, setShowSplashScreen, medals,
  setCanvasPixelated,
} from '../../dist/littlejs.esm.min';
// } from 'littlejsengine';

import { newgrounds } from './external/newgrounds';
export { NewgroundsMedal } from "./external/newgrounds";



export function postScore(board: number, score: number) {
  newgrounds?.postScore(board, score);
}
