// node_modules/littlejsengine/dist/littlejs.esm.js
var ASSERT = function(assert, output) {
  if (enableAsserts)
    output ? console.assert(assert, output) : console.assert(assert);
};
var abs = function(value) {
  return Math.abs(value);
};
var mod = function(dividend, divisor = 1) {
  return (dividend % divisor + divisor) % divisor;
};
var clamp = function(value, min = 0, max = 1) {
  return value < min ? min : value > max ? max : value;
};
var percent = function(value, valueA, valueB) {
  return (valueB -= valueA) ? clamp((value - valueA) / valueB) : 0;
};
var rand = function(valueA = 1, valueB = 0) {
  return valueB + Math.random() * (valueA - valueB);
};
var vec2 = function(x = 0, y) {
  return typeof x == "number" ? new Vector2(x, y == undefined ? x : y) : new Vector2(x.x, x.y);
};
var isVector2 = function(v) {
  return v instanceof Vector2;
};
var rgb = function(r, g, b, a) {
  return new Color(r, g, b, a);
};
var isColor = function(c) {
  return c instanceof Color;
};
var debug = true;
var enableAsserts = true;
class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    ASSERT(this.isValid());
  }
  set(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    ASSERT(this.isValid());
    return this;
  }
  copy() {
    return new Vector2(this.x, this.y);
  }
  add(v) {
    ASSERT(isVector2(v));
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  subtract(v) {
    ASSERT(isVector2(v));
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  multiply(v) {
    ASSERT(isVector2(v));
    return new Vector2(this.x * v.x, this.y * v.y);
  }
  divide(v) {
    ASSERT(isVector2(v));
    return new Vector2(this.x / v.x, this.y / v.y);
  }
  scale(s) {
    ASSERT(!isVector2(s));
    return new Vector2(this.x * s, this.y * s);
  }
  length() {
    return this.lengthSquared() ** 0.5;
  }
  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }
  distance(v) {
    ASSERT(isVector2(v));
    return this.distanceSquared(v) ** 0.5;
  }
  distanceSquared(v) {
    ASSERT(isVector2(v));
    return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
  }
  normalize(length = 1) {
    const l = this.length();
    return l ? this.scale(length / l) : new Vector2(0, length);
  }
  clampLength(length = 1) {
    const l = this.length();
    return l > length ? this.scale(length / l) : this;
  }
  dot(v) {
    ASSERT(isVector2(v));
    return this.x * v.x + this.y * v.y;
  }
  cross(v) {
    ASSERT(isVector2(v));
    return this.x * v.y - this.y * v.x;
  }
  angle() {
    return Math.atan2(this.x, this.y);
  }
  setAngle(angle = 0, length = 1) {
    this.x = length * Math.sin(angle);
    this.y = length * Math.cos(angle);
    return this;
  }
  rotate(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return new Vector2(this.x * c - this.y * s, this.x * s + this.y * c);
  }
  setDirection(direction, length = 1) {
    direction = mod(direction, 4);
    ASSERT(direction == 0 || direction == 1 || direction == 2 || direction == 3);
    return vec2(direction % 2 ? direction - 1 ? -length : length : 0, direction % 2 ? 0 : direction ? -length : length);
  }
  direction() {
    return abs(this.x) > abs(this.y) ? this.x < 0 ? 3 : 1 : this.y < 0 ? 2 : 0;
  }
  invert() {
    return new Vector2(this.y, -this.x);
  }
  floor() {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }
  area() {
    return abs(this.x * this.y);
  }
  lerp(v, percent2) {
    ASSERT(isVector2(v));
    return this.add(v.subtract(this).scale(clamp(percent2)));
  }
  arrayCheck(arraySize) {
    ASSERT(isVector2(arraySize));
    return this.x >= 0 && this.y >= 0 && this.x < arraySize.x && this.y < arraySize.y;
  }
  toString(digits = 3) {
    if (debug)
      return `(${(this.x < 0 ? "" : " ") + this.x.toFixed(digits)},${(this.y < 0 ? "" : " ") + this.y.toFixed(digits)} )`;
  }
  isValid() {
    return typeof this.x == "number" && !isNaN(this.x) && typeof this.y == "number" && !isNaN(this.y);
  }
}

class Color {
  constructor(r = 1, g = 1, b = 1, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    ASSERT(this.isValid());
  }
  set(r = 1, g = 1, b = 1, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    ASSERT(this.isValid());
    return this;
  }
  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }
  add(c) {
    ASSERT(isColor(c));
    return new Color(this.r + c.r, this.g + c.g, this.b + c.b, this.a + c.a);
  }
  subtract(c) {
    ASSERT(isColor(c));
    return new Color(this.r - c.r, this.g - c.g, this.b - c.b, this.a - c.a);
  }
  multiply(c) {
    ASSERT(isColor(c));
    return new Color(this.r * c.r, this.g * c.g, this.b * c.b, this.a * c.a);
  }
  divide(c) {
    ASSERT(isColor(c));
    return new Color(this.r / c.r, this.g / c.g, this.b / c.b, this.a / c.a);
  }
  scale(scale, alphaScale = scale) {
    return new Color(this.r * scale, this.g * scale, this.b * scale, this.a * alphaScale);
  }
  clamp() {
    return new Color(clamp(this.r), clamp(this.g), clamp(this.b), clamp(this.a));
  }
  lerp(c, percent2) {
    ASSERT(isColor(c));
    return this.add(c.subtract(this).scale(clamp(percent2)));
  }
  setHSLA(h = 0, s = 0, l = 1, a = 1) {
    h = mod(h, 1);
    s = clamp(s);
    l = clamp(l);
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = (p2, q2, t) => (t = mod(t, 1)) * 6 < 1 ? p2 + (q2 - p2) * 6 * t : t * 2 < 1 ? q2 : t * 3 < 2 ? p2 + (q2 - p2) * (4 - t * 6) : p2;
    this.r = f(p, q, h + 1 / 3);
    this.g = f(p, q, h);
    this.b = f(p, q, h - 1 / 3);
    this.a = a;
    ASSERT(this.isValid());
    return this;
  }
  HSLA() {
    const r = clamp(this.r);
    const g = clamp(this.g);
    const b = clamp(this.b);
    const a = clamp(this.a);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max != min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (r == max)
        h = (g - b) / d + (g < b ? 6 : 0);
      else if (g == max)
        h = (b - r) / d + 2;
      else if (b == max)
        h = (r - g) / d + 4;
    }
    return [h / 6, s, l, a];
  }
  mutate(amount = 0.05, alphaAmount = 0) {
    return new Color(this.r + rand(amount, -amount), this.g + rand(amount, -amount), this.b + rand(amount, -amount), this.a + rand(alphaAmount, -alphaAmount)).clamp();
  }
  toString(useAlpha = true) {
    const toHex = (c) => ((c = clamp(c) * 255 | 0) < 16 ? "0" : "") + c.toString(16);
    return "#" + toHex(this.r) + toHex(this.g) + toHex(this.b) + (useAlpha ? toHex(this.a) : "");
  }
  setHex(hex) {
    ASSERT(typeof hex == "string" && hex[0] == "#");
    ASSERT([4, 5, 7, 9].includes(hex.length), "Invalid hex");
    if (hex.length < 6) {
      const fromHex = (c) => clamp(parseInt(hex[c], 16) / 15);
      this.r = fromHex(1);
      this.g = fromHex(2), this.b = fromHex(3);
      this.a = hex.length == 5 ? fromHex(4) : 1;
    } else {
      const fromHex = (c) => clamp(parseInt(hex.slice(c, c + 2), 16) / 255);
      this.r = fromHex(1);
      this.g = fromHex(3), this.b = fromHex(5);
      this.a = hex.length == 9 ? fromHex(7) : 1;
    }
    ASSERT(this.isValid());
    return this;
  }
  rgbaInt() {
    const r = clamp(this.r) * 255 | 0;
    const g = clamp(this.g) * 255 << 8;
    const b = clamp(this.b) * 255 << 16;
    const a = clamp(this.a) * 255 << 24;
    return r + g + b + a;
  }
  isValid() {
    return typeof this.r == "number" && !isNaN(this.r) && typeof this.g == "number" && !isNaN(this.g) && typeof this.b == "number" && !isNaN(this.b) && typeof this.a == "number" && !isNaN(this.a);
  }
}
var WHITE = rgb();
var BLACK = rgb(0, 0, 0);
var GRAY = rgb(0.5, 0.5, 0.5);
var RED = rgb(1, 0, 0);
var ORANGE = rgb(1, 0.5, 0);
var YELLOW = rgb(1, 1, 0);
var GREEN = rgb(0, 1, 0);
var CYAN = rgb(0, 1, 1);
var BLUE = rgb(0, 0, 1);
var PURPLE = rgb(0.5, 0, 1);
var MAGENTA = rgb(1, 0, 1);

class Timer {
  constructor(timeLeft) {
    this.time = timeLeft == undefined ? undefined : time + timeLeft;
    this.setTime = timeLeft;
  }
  set(timeLeft = 0) {
    this.time = time + timeLeft;
    this.setTime = timeLeft;
  }
  unset() {
    this.time = undefined;
  }
  isSet() {
    return this.time != null;
  }
  active() {
    return time < this.time;
  }
  elapsed() {
    return time >= this.time;
  }
  get() {
    return this.isSet() ? time - this.time : 0;
  }
  getPercent() {
    return this.isSet() ? percent(this.time - time, this.setTime, 0) : 0;
  }
  toString() {
    if (debug) {
      return this.isSet() ? Math.abs(this.get()) + " seconds " + (this.get() < 0 ? "before" : "after") : "unset";
    }
  }
  valueOf() {
    return this.get();
  }
}
var cameraPos = vec2();
var canvasMaxSize = vec2(1920, 1080);
var canvasFixedSize = vec2();
var tileSizeDefault = vec2(16);
var medalDisplaySize = vec2(640, 80);
var mainCanvasSize = vec2();
var mousePos = vec2();
var mousePosScreen = vec2();
var isTouchDevice = window.ontouchstart !== undefined;
var touchGamepadTimer = new Timer;
var audioContext = new AudioContext;
var tileCollisionSize = vec2();
var gl_INDICIES_PER_INSTANCE = 11;
var gl_MAX_INSTANCES = 1e4;
var gl_INSTANCE_BYTE_STRIDE = gl_INDICIES_PER_INSTANCE * 4;
var gl_INSTANCE_BUFFER_SIZE = gl_MAX_INSTANCES * gl_INSTANCE_BYTE_STRIDE;
var frameRate = 60;
var timeDelta = 1 / frameRate;
var time = 0;

// dist/littlejs.esm.min.js
var ASSERT2 = function() {
};
var debugInit = function() {
};
var debugUpdate = function() {
};
var debugRender = function() {
};
var debugRect = function() {
};
var debugOverlap = function() {
};
var abs2 = function(a) {
  return Math.abs(a);
};
var min = function(a, b) {
  return Math.min(a, b);
};
var max = function(a, b) {
  return Math.max(a, b);
};
var sign = function(a) {
  return Math.sign(a);
};
var mod2 = function(a, b = 1) {
  return (a % b + b) % b;
};
var clamp2 = function(a, b = 0, c = 1) {
  return a < b ? b : a > c ? c : a;
};
var percent2 = function(a, b, c) {
  return (c -= b) ? clamp2((a - b) / c) : 0;
};
var lerp = function(a, b, c) {
  return b + clamp2(a) * (c - b);
};
var isOverlapping = function(a, b, c, d = vec22()) {
  return 2 * abs2(a.x - c.x) < b.x + d.x && 2 * abs2(a.y - c.y) < b.y + d.y;
};
var wave = function(a = 1, b = 1, c = time2) {
  return b / 2 * (1 - Math.cos(c * a * 2 * PI));
};
var rand2 = function(a = 1, b = 0) {
  return b + Math.random() * (a - b);
};
var randVector = function(a = 1) {
  return new Vector22().setAngle(rand2(2 * PI), a);
};
var vec22 = function(a = 0, b) {
  return typeof a == "number" ? new Vector22(a, b == undefined ? a : b) : new Vector22(a.x, a.y);
};
var isVector22 = function(a) {
  return a instanceof Vector22;
};
var rgb2 = function(a, b, c, d) {
  return new Color2(a, b, c, d);
};
var hsl = function(a, b, c, d) {
  return new Color2().setHSLA(a, b, c, d);
};
var isColor2 = function(a) {
  return a instanceof Color2;
};
var screenToWorld = function(a) {
  return new Vector22((a.x - mainCanvasSize2.x / 2 + 0.5) / cameraScale + cameraPos2.x, (a.y - mainCanvasSize2.y / 2 + 0.5) / -cameraScale + cameraPos2.y);
};
var worldToScreen = function(a) {
  return new Vector22((a.x - cameraPos2.x) * cameraScale + mainCanvasSize2.x / 2 - 0.5, (a.y - cameraPos2.y) * -cameraScale + mainCanvasSize2.y / 2 - 0.5);
};
var drawTile = function(a, b = vec22(1), c, d = new Color2, e = 0, f, g = new Color2(0, 0, 0, 0), k = glEnable, h, m) {
  ASSERT2(!m || !k, "context only supported in canvas 2D mode");
  ASSERT2(typeof c !== "number" || !c, "this is an old style calls, to fix replace it with tile(tileIndex, tileSize)");
  const n = c && c.getTextureInfo();
  if (k)
    if (h && (a = screenToWorld(a), b = b.scale(1 / cameraScale)), n) {
      var l = vec22(1).divide(n.size);
      k = c.pos.x * l.x;
      h = c.pos.y * l.y;
      m = c.size.x * l.x;
      const p = c.size.y * l.y;
      l = l.scale(tileFixBleedScale);
      glSetTexture(n.glTexture);
      glDraw(a.x, a.y, f ? -b.x : b.x, b.y, e, k + l.x, h + l.y, k - l.x + m, h - l.y + p, d.rgbaInt(), g.rgbaInt());
    } else
      glDraw(a.x, a.y, b.x, b.y, e, 0, 0, 0, 0, 0, d.rgbaInt());
  else
    showWatermark && ++drawCount, b = vec22(b.x, -b.y), drawCanvas2D(a, b, e, f, (p) => {
      if (n) {
        const q = c.pos.x + tileFixBleedScale, r = c.pos.y + tileFixBleedScale, x = c.size.x - 2 * tileFixBleedScale, v = c.size.y - 2 * tileFixBleedScale;
        p.globalAlpha = d.a;
        p.drawImage(n.image, q, r, x, v, -0.5, -0.5, 1, 1);
        p.globalAlpha = 1;
      } else
        p.fillStyle = d, p.fillRect(-0.5, -0.5, 1, 1);
    }, h, m);
};
var drawRect = function(a, b, c, d, e, f, g) {
  drawTile(a, b, undefined, c, d, false, undefined, e, f, g);
};
var drawLine = function(a, b, c = 0.1, d, e, f, g) {
  b = vec22((b.x - a.x) / 2, (b.y - a.y) / 2);
  c = vec22(c, 2 * b.length());
  drawRect(a.add(b), c, d, b.angle(), e, f, g);
};
var drawCanvas2D = function(a, b, c, d, e, f, g = mainContext) {
  f || (a = worldToScreen(a), b = b.scale(cameraScale));
  g.save();
  g.translate(a.x + 0.5, a.y + 0.5);
  g.rotate(c);
  g.scale(d ? -b.x : b.x, -b.y);
  e(g);
  g.restore();
};
var keyIsDown = function(a, b = 0) {
  ASSERT2(0 < b || typeof a !== "number" || 3 > a, "use code string for keyboard");
  return inputData[b] && !!(inputData[b][a] & 1);
};
var clearInput = function() {
  inputData = [[]];
  touchGamepadButtons = [];
};
var gamepadIsDown = function(a, b = 0) {
  return keyIsDown(a, b + 1);
};
var inputUpdate = function() {
  headlessMode || (touchInputEnable && isTouchDevice2 || document.hasFocus() || clearInput(), mousePos2 = screenToWorld(mousePosScreen2), gamepadsUpdate());
};
var inputUpdatePost = function() {
  if (!headlessMode) {
    for (const a of inputData)
      for (const b in a)
        a[b] &= 1;
    mouseWheel = 0;
  }
};
var inputInit = function() {
  function a(b) {
    return inputWASDEmulateDirection ? b == "KeyW" ? "ArrowUp" : b == "KeyS" ? "ArrowDown" : b == "KeyA" ? "ArrowLeft" : b == "KeyD" ? "ArrowRight" : b : b;
  }
  headlessMode || (onkeydown = (b) => {
    b.repeat || (isUsingGamepad = false, inputData[0][b.code] = 3, inputWASDEmulateDirection && (inputData[0][a(b.code)] = 3));
    preventDefaultInput && b.preventDefault();
  }, onkeyup = (b) => {
    inputData[0][b.code] = 4;
    inputWASDEmulateDirection && (inputData[0][a(b.code)] = 4);
  }, onmousedown = (b) => {
    soundEnable && !headlessMode && audioContext2 && audioContext2.state != "running" && audioContext2.resume();
    isUsingGamepad = false;
    inputData[0][b.button] = 3;
    mousePosScreen2 = mouseToScreen(b);
    b.button && b.preventDefault();
  }, onmouseup = (b) => inputData[0][b.button] = inputData[0][b.button] & 2 | 4, onmousemove = (b) => mousePosScreen2 = mouseToScreen(b), onwheel = (b) => mouseWheel = b.ctrlKey ? 0 : sign(b.deltaY), oncontextmenu = (b) => false, onblur = (b) => clearInput(), isTouchDevice2 && touchInputEnable && touchInputInit());
};
var mouseToScreen = function(a) {
  if (!mainCanvas || headlessMode)
    return vec22();
  const b = mainCanvas.getBoundingClientRect();
  return vec22(mainCanvas.width, mainCanvas.height).multiply(vec22(percent2(a.x, b.left, b.right), percent2(a.y, b.top, b.bottom)));
};
var gamepadsUpdate = function() {
  const a = (g) => {
    const k = (h) => 0.3 < h ? percent2(h, 0.3, 0.8) : -0.3 > h ? -percent2(-h, 0.3, 0.8) : 0;
    return vec22(k(g.x), k(-g.y)).clampLength();
  };
  if (touchGamepadEnable && isTouchDevice2 && (ASSERT2(touchGamepadButtons, "set touchGamepadEnable before calling init!"), touchGamepadTimer2.isSet())) {
    var b = gamepadStickData[0] || (gamepadStickData[0] = []);
    b[0] = vec22();
    touchGamepadAnalog ? b[0] = a(touchGamepadStick) : 0.3 < touchGamepadStick.lengthSquared() && (b[0].x = Math.round(touchGamepadStick.x), b[0].y = -Math.round(touchGamepadStick.y), b[0] = b[0].clampLength());
    b = inputData[1] || (inputData[1] = []);
    for (var c = 10;c--; ) {
      var d = c == 3 ? 2 : c == 2 ? 3 : c, e = gamepadIsDown(d, 0);
      b[d] = touchGamepadButtons[c] ? e ? 1 : 3 : e ? 4 : 0;
    }
  }
  if (gamepadsEnable && navigator && navigator.getGamepads && (debug2 || document.hasFocus()))
    for (b = navigator.getGamepads(), c = b.length;c--; ) {
      e = b[c];
      const g = inputData[c + 1] || (inputData[c + 1] = []);
      d = gamepadStickData[c] || (gamepadStickData[c] = []);
      if (e) {
        for (var f = 0;f < e.axes.length - 1; f += 2)
          d[f >> 1] = a(vec22(e.axes[f], e.axes[f + 1]));
        for (f = e.buttons.length;f--; ) {
          const k = e.buttons[f], h = gamepadIsDown(f, c);
          g[f] = k.pressed ? h ? 1 : 3 : h ? 4 : 0;
          isUsingGamepad ||= !c && k.pressed;
        }
        gamepadDirectionEmulateStick && (e = vec22((gamepadIsDown(15, c) && 1) - (gamepadIsDown(14, c) && 1), (gamepadIsDown(12, c) && 1) - (gamepadIsDown(13, c) && 1)), e.lengthSquared() && (d[0] = e.clampLength()));
        touchGamepadEnable && isUsingGamepad && touchGamepadTimer2.unset();
      }
    }
};
var touchInputInit = function() {
  function a(e) {
    soundEnable && !headlessMode && audioContext2 && audioContext2.state != "running" && audioContext2.resume();
    const f = e.touches.length;
    if (f) {
      const g = vec22(e.touches[0].clientX, e.touches[0].clientY);
      mousePosScreen2 = mouseToScreen(g);
      d ? isUsingGamepad = touchGamepadEnable : inputData[0][0] = 3;
    } else
      d && (inputData[0][0] = inputData[0][0] & 2 | 4);
    d = f;
    document.hasFocus() && e.preventDefault();
    return true;
  }
  function b(e) {
    touchGamepadStick = vec22();
    touchGamepadButtons = [];
    isUsingGamepad = true;
    if (e.touches.length && (touchGamepadTimer2.set(), paused && !d)) {
      touchGamepadButtons[9] = 1;
      a(e);
      return;
    }
    const f = vec22(touchGamepadSize, mainCanvasSize2.y - touchGamepadSize), g = mainCanvasSize2.subtract(vec22(touchGamepadSize, touchGamepadSize)), k = mainCanvasSize2.scale(0.5);
    for (const m of e.touches) {
      var h = mouseToScreen(vec22(m.clientX, m.clientY));
      h.distance(f) < touchGamepadSize ? touchGamepadStick = h.subtract(f).scale(2 / touchGamepadSize).clampLength() : h.distance(g) < touchGamepadSize ? (h = h.subtract(g).direction(), touchGamepadButtons[h] = 1) : h.distance(k) < touchGamepadSize && !d && (touchGamepadButtons[9] = 1);
    }
    a(e);
    return true;
  }
  let c = a;
  touchGamepadEnable && (c = b, touchGamepadButtons = [], touchGamepadStick = vec22());
  document.addEventListener("touchstart", (e) => c(e), { passive: false });
  document.addEventListener("touchmove", (e) => c(e), { passive: false });
  document.addEventListener("touchend", (e) => c(e), { passive: false });
  onmousedown = onmouseup = () => 0;
  let d;
};
var touchGamepadRender = function() {
  if (touchInputEnable && isTouchDevice2 && !headlessMode && touchGamepadEnable && touchGamepadTimer2.isSet()) {
    var a = percent2(touchGamepadTimer2.get(), 4, 3);
    if (a && !paused) {
      var b = overlayContext;
      b.save();
      b.globalAlpha = a * touchGamepadAlpha;
      b.strokeStyle = "#fff";
      b.lineWidth = 3;
      b.fillStyle = 0 < touchGamepadStick.lengthSquared() ? "#fff" : "#000";
      b.beginPath();
      a = vec22(touchGamepadSize, mainCanvasSize2.y - touchGamepadSize);
      if (touchGamepadAnalog)
        b.arc(a.x, a.y, touchGamepadSize / 2, 0, 9), b.fill();
      else
        for (var c = 10;c--; ) {
          var d = c * PI / 4;
          b.arc(a.x, a.y, 0.6 * touchGamepadSize, d + PI / 8, d + PI / 8);
          c % 2 && b.arc(a.x, a.y, 0.33 * touchGamepadSize, d, d);
          c == 1 && b.fill();
        }
      b.stroke();
      a = vec22(mainCanvasSize2.x - touchGamepadSize, mainCanvasSize2.y - touchGamepadSize);
      for (c = 4;c--; )
        d = a.add(vec22().setDirection(c, touchGamepadSize / 2)), b.fillStyle = touchGamepadButtons[c] ? "#fff" : "#000", b.beginPath(), b.arc(d.x, d.y, touchGamepadSize / 4, 0, 9), b.fill(), b.stroke();
      b.restore();
    }
  }
};
var audioInit = function() {
  soundEnable && !headlessMode && (audioGainNode = audioContext2.createGain(), audioGainNode.connect(audioContext2.destination), audioGainNode.gain.value = soundVolume);
};
var tileCollisionTest = function(a, b = vec22(), c) {
  const d = max(a.x - b.x / 2 | 0, 0);
  var e = max(a.y - b.y / 2 | 0, 0);
  const f = min(a.x + b.x / 2, tileCollisionSize2.x);
  for (a = min(a.y + b.y / 2, tileCollisionSize2.y);e < a; ++e)
    for (b = d;b < f; ++b) {
      const g = tileCollision[e * tileCollisionSize2.x + b];
      if (g && (!c || c.collideWithTile(g, vec22(b, e))))
        return true;
    }
  return false;
};
var glInit = function() {
  if (glEnable && !headlessMode) {
    glCanvas = document.createElement("canvas");
    glContext = glCanvas.getContext("webgl2", { antialias: glAntialias });
    var a = mainCanvas.parentElement;
    glOverlay && a.appendChild(glCanvas);
    glShader = glCreateProgram("#version 300 es\nprecision highp float;uniform mat4 m;in vec2 g;in vec4 p,u,c,a;in float r;out vec2 v;out vec4 d,e;void main(){vec2 s=(g-.5)*p.zw;gl_Position=m*vec4(p.xy+s*cos(r)-vec2(-s.y,s)*sin(r),1,1);v=mix(u.xw,u.zy,g);d=c;e=a;}", "#version 300 es\nprecision highp float;uniform sampler2D s;in vec2 v;in vec4 d,e;out vec4 c;void main(){c=texture(s,v)*d+e;}");
    a = new ArrayBuffer(gl_INSTANCE_BUFFER_SIZE2);
    glPositionData = new Float32Array(a);
    glColorData = new Uint32Array(a);
    glArrayBuffer = glContext.createBuffer();
    glGeometryBuffer = glContext.createBuffer();
    a = new Float32Array([glInstanceCount = 0, 0, 1, 0, 0, 1, 1, 1]);
    glContext.bindBuffer(gl_ARRAY_BUFFER, glGeometryBuffer);
    glContext.bufferData(gl_ARRAY_BUFFER, a, gl_STATIC_DRAW);
  }
};
var glPreRender = function() {
  if (glEnable && !headlessMode) {
    glContext.viewport(0, 0, glCanvas.width = mainCanvas.width, glCanvas.height = mainCanvas.height);
    glContext.clear(gl_COLOR_BUFFER_BIT);
    glContext.useProgram(glShader);
    glContext.activeTexture(gl_TEXTURE0);
    textureInfos[0] && glContext.bindTexture(gl_TEXTURE_2D, glActiveTexture = textureInfos[0].glTexture);
    var a = glAdditive = glBatchAdditive = 0, b = (d, e, f, g) => {
      d = glContext.getAttribLocation(glShader, d);
      const k = f && gl_INSTANCE_BYTE_STRIDE2, h = f && 1, m = f == 1;
      glContext.enableVertexAttribArray(d);
      glContext.vertexAttribPointer(d, g, e, m, k, a);
      glContext.vertexAttribDivisor(d, h);
      a += g * f;
    };
    glContext.bindBuffer(gl_ARRAY_BUFFER, glGeometryBuffer);
    b("g", gl_FLOAT, 0, 2);
    glContext.bindBuffer(gl_ARRAY_BUFFER, glArrayBuffer);
    glContext.bufferData(gl_ARRAY_BUFFER, gl_INSTANCE_BUFFER_SIZE2, gl_DYNAMIC_DRAW);
    b("p", gl_FLOAT, 4, 4);
    b("u", gl_FLOAT, 4, 4);
    b("c", gl_UNSIGNED_BYTE, 1, 4);
    b("a", gl_UNSIGNED_BYTE, 1, 4);
    b("r", gl_FLOAT, 4, 1);
    b = vec22(2 * cameraScale).divide(mainCanvasSize2);
    var c = vec22(-1).subtract(cameraPos2.multiply(b));
    glContext.uniformMatrix4fv(glContext.getUniformLocation(glShader, "m"), false, [b.x, 0, 0, 0, 0, b.y, 0, 0, 1, 1, 1, 1, c.x, c.y, 0, 0]);
  }
};
var glSetTexture = function(a) {
  headlessMode || a == glActiveTexture || (glFlush(), glContext.bindTexture(gl_TEXTURE_2D, glActiveTexture = a));
};
var glCompileShader = function(a, b) {
  b = glContext.createShader(b);
  glContext.shaderSource(b, a);
  glContext.compileShader(b);
  if (debug2 && !glContext.getShaderParameter(b, gl_COMPILE_STATUS))
    throw glContext.getShaderInfoLog(b);
  return b;
};
var glCreateProgram = function(a, b) {
  const c = glContext.createProgram();
  glContext.attachShader(c, glCompileShader(a, gl_VERTEX_SHADER));
  glContext.attachShader(c, glCompileShader(b, gl_FRAGMENT_SHADER));
  glContext.linkProgram(c);
  if (debug2 && !glContext.getProgramParameter(c, gl_LINK_STATUS))
    throw glContext.getProgramInfoLog(c);
  return c;
};
var glCreateTexture = function(a) {
  const b = glContext.createTexture();
  glContext.bindTexture(gl_TEXTURE_2D, b);
  a && a.width ? glContext.texImage2D(gl_TEXTURE_2D, 0, gl_RGBA, gl_RGBA, gl_UNSIGNED_BYTE, a) : (a = new Uint8Array([255, 255, 255, 255]), glContext.texImage2D(gl_TEXTURE_2D, 0, gl_RGBA, 1, 1, 0, gl_RGBA, gl_UNSIGNED_BYTE, a));
  a = tilesPixelated ? gl_NEAREST : gl_LINEAR;
  glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_MIN_FILTER, a);
  glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_MAG_FILTER, a);
  return b;
};
var glFlush = function() {
  if (glInstanceCount) {
    var a = glBatchAdditive ? gl_ONE : gl_ONE_MINUS_SRC_ALPHA;
    glContext.blendFuncSeparate(gl_SRC_ALPHA, a, gl_ONE, a);
    glContext.enable(gl_BLEND);
    glContext.bufferSubData(gl_ARRAY_BUFFER, 0, glPositionData);
    glContext.drawArraysInstanced(gl_TRIANGLE_STRIP, 0, 4, glInstanceCount);
    showWatermark && (drawCount += glInstanceCount);
    glInstanceCount = 0;
    glBatchAdditive = glAdditive;
  }
};
var glCopyToContext = function(a, b = false) {
  glEnable && (glInstanceCount || b) && (glFlush(), glOverlay && !b || a.drawImage(glCanvas, 0, 0));
};
var glDraw = function(a, b, c, d, e, f, g, k, h, m, n = 0) {
  ASSERT2(typeof m == "number" && typeof n == "number", "invalid color");
  (glInstanceCount >= gl_MAX_INSTANCES2 || glBatchAdditive != glAdditive) && glFlush();
  let l = glInstanceCount * gl_INDICIES_PER_INSTANCE2;
  glPositionData[l++] = a;
  glPositionData[l++] = b;
  glPositionData[l++] = c;
  glPositionData[l++] = d;
  glPositionData[l++] = f;
  glPositionData[l++] = g;
  glPositionData[l++] = k;
  glPositionData[l++] = h;
  glColorData[l++] = m;
  glColorData[l++] = n;
  glPositionData[l++] = e;
  glInstanceCount++;
};
var engineInit = function(a, b, c, d, e, f = [], g = document.body) {
  function k(n = 0) {
    var l = n - frameTimeLastMS;
    frameTimeLastMS = n;
    if (debug2 || showWatermark)
      averageFPS = lerp(0.05, averageFPS, 1000 / (l || 1));
    n = debug2 && keyIsDown("Equal");
    const p = debug2 && keyIsDown("Minus");
    debug2 && (l *= n ? 5 : p ? 0.2 : 1);
    timeReal += l / 1000;
    frameTimeBufferMS += paused ? 0 : l;
    n || (frameTimeBufferMS = min(frameTimeBufferMS, 50));
    h();
    if (paused) {
      for (const r of engineObjects)
        r.parent || r.updateTransforms();
      inputUpdate();
      pluginUpdateList.forEach((r) => r());
      debugUpdate();
      c();
      inputUpdatePost();
    } else {
      l = 0;
      0 > frameTimeBufferMS && -9 < frameTimeBufferMS && (l = frameTimeBufferMS, frameTimeBufferMS = 0);
      for (;0 <= frameTimeBufferMS; frameTimeBufferMS -= 1000 / frameRate2)
        time2 = frame++ / frameRate2, inputUpdate(), b(), pluginUpdateList.forEach((r) => r()), engineObjectsUpdate(), debugUpdate(), c(), inputUpdatePost();
      frameTimeBufferMS += l;
    }
    if (!headlessMode) {
      mainCanvasSize2 = vec22(mainCanvas.width, mainCanvas.height);
      overlayContext.imageSmoothingEnabled = mainContext.imageSmoothingEnabled = !tilesPixelated;
      glPreRender();
      d();
      engineObjects.sort((r, x) => r.renderOrder - x.renderOrder);
      for (var q of engineObjects)
        q.destroyed || q.render();
      e();
      pluginRenderList.forEach((r) => r());
      touchGamepadRender();
      debugRender();
      glCopyToContext(mainContext);
      showWatermark && (overlayContext.textAlign = "right", overlayContext.textBaseline = "top", overlayContext.font = "1em monospace", overlayContext.fillStyle = "#000", q = engineName + " v" + engineVersion + " / " + drawCount + " / " + engineObjects.length + " / " + averageFPS.toFixed(1) + (glEnable ? " GL" : " 2D"), overlayContext.fillText(q, mainCanvas.width - 3, 3), overlayContext.fillStyle = "#fff", overlayContext.fillText(q, mainCanvas.width - 2, 2), drawCount = 0);
    }
    requestAnimationFrame(k);
  }
  function h() {
    if (!headlessMode) {
      if (canvasFixedSize2.x) {
        mainCanvas.width = canvasFixedSize2.x;
        mainCanvas.height = canvasFixedSize2.y;
        const n = innerWidth / innerHeight, l = mainCanvas.width / mainCanvas.height;
        (glCanvas || mainCanvas).style.width = mainCanvas.style.width = overlayCanvas.style.width = n < l ? "100%" : "";
        (glCanvas || mainCanvas).style.height = mainCanvas.style.height = overlayCanvas.style.height = n < l ? "" : "100%";
      } else
        mainCanvas.width = min(innerWidth, canvasMaxSize2.x), mainCanvas.height = min(innerHeight, canvasMaxSize2.y);
      overlayCanvas.width = mainCanvas.width;
      overlayCanvas.height = mainCanvas.height;
      mainCanvasSize2 = vec22(mainCanvas.width, mainCanvas.height);
    }
  }
  function m() {
    new Promise((n) => n(a())).then(k);
  }
  ASSERT2(Array.isArray(f), "pass in images as array");
  headlessMode ? m() : (g.style.cssText = "margin:0;overflow:hidden;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:#000;" + (canvasPixelated ? "image-rendering:pixelated;" : "") + "user-select:none;-webkit-user-select:none;" + (touchInputEnable ? "touch-action:none;-webkit-touch-callout:none" : ""), g.appendChild(mainCanvas = document.createElement("canvas")), mainContext = mainCanvas.getContext("2d"), inputInit(), audioInit(), debugInit(), glInit(), g.appendChild(overlayCanvas = document.createElement("canvas")), overlayContext = overlayCanvas.getContext("2d"), mainCanvas.style.cssText = overlayCanvas.style.cssText = "position:absolute", glCanvas && (glCanvas.style.cssText = "position:absolute"), h(), g = f.map((n, l) => new Promise((p) => {
    const q = new Image;
    q.onerror = q.onload = () => {
      textureInfos[l] = new TextureInfo(q);
      p();
    };
    q.src = n;
  })), f.length || g.push(new Promise((n) => {
    textureInfos[0] = new TextureInfo(new Image);
    n();
  })), showSplashScreen && g.push(new Promise((n) => {
    function l() {
      clearInput();
      drawEngineSplashScreen(p += 0.01);
      1 < p ? n() : setTimeout(l, 16);
    }
    let p = 0;
    console.log(`${engineName} Engine v${engineVersion}`);
    l();
  })), Promise.all(g).then(m));
};
var engineObjectsUpdate = function() {
  function a(b) {
    if (!b.destroyed) {
      b.update();
      for (const c of b.children)
        a(c);
    }
  }
  engineObjectsCollide = engineObjects.filter((b) => b.collideSolidObjects);
  for (const b of engineObjects)
    b.parent || (a(b), b.updateTransforms());
  engineObjects = engineObjects.filter((b) => !b.destroyed);
};
var drawEngineSplashScreen = function(a) {
  const b = overlayContext;
  var c = overlayCanvas.width = innerWidth, d = overlayCanvas.height = innerHeight, e = percent2(a, 1, 0.8), f = percent2(a, 0, 0.5), g = b.createRadialGradient(c / 2, d / 2, 0, c / 2, d / 2, 0.7 * Math.hypot(c, d));
  g.addColorStop(0, hsl(0, 0, lerp(f, 0, e / 2), e).toString());
  g.addColorStop(1, hsl(0, 0, 0, e).toString());
  b.save();
  b.fillStyle = g;
  b.fillRect(0, 0, c, d);
  g = (h, m, n, l, p) => {
    b.beginPath();
    b.rect(h, m, n, p ? l * k : l);
    (b.fillStyle = p) ? b.fill() : b.stroke();
  };
  f = (h, m, n, l = 0, p = 2 * PI, q, r) => {
    const x = (l + p) / 2;
    l = k * (p - l) / 2;
    b.beginPath();
    r && b.lineTo(h, m);
    b.arc(h, m, n, x - l, x + l);
    (b.fillStyle = q) ? b.fill() : b.stroke();
  };
  e = (h = 0, m = 0) => hsl([0.98, 0.3, 0.57, 0.14][h % 4] - 10, 0.8, [0, 0.3, 0.5, 0.8, 0.9][m]).toString();
  a = wave(1, 1, a);
  const k = percent2(a, 0.1, 0.5);
  b.translate(c / 2, d / 2);
  c = min(6, min(c, d) / 99);
  b.scale(c, c);
  b.translate(-40, -35);
  b.lineJoin = b.lineCap = "round";
  b.lineWidth = 0.1 + 1.9 * k;
  c = percent2(a, 0.1, 1);
  b.setLineDash([99 * c, 99]);
  g(7, 16, 18, -8, e(2, 2));
  g(7, 8, 18, 4, e(2, 3));
  g(25, 8, 8, 8, e(2, 1));
  g(25, 8, -18, 8);
  g(25, 8, 8, 8);
  g(25, 16, 7, 23, e());
  g(11, 39, 14, -23, e(1, 1));
  g(11, 16, 14, 18, e(1, 2));
  g(11, 16, 14, 8, e(1, 3));
  g(25, 16, -14, 24);
  g(15, 29, 6, -9, e(2, 2));
  f(15, 21, 5, 0, PI / 2, e(2, 4), 1);
  g(21, 21, -6, 9);
  g(37, 14, 9, 6, e(3, 2));
  g(37, 14, 4.5, 6, e(3, 3));
  g(37, 14, 9, 6);
  g(50, 20, 10, -8, e(0, 1));
  g(50, 20, 6.5, -8, e(0, 2));
  g(50, 20, 3.5, -8, e(0, 3));
  g(50, 20, 10, -8);
  f(55, 2, 11.4, 0.5, PI - 0.5, e(3, 3));
  f(55, 2, 11.4, 0.5, PI / 2, e(3, 2), 1);
  f(55, 2, 11.4, 0.5, PI - 0.5);
  g(45, 7, 20, -7, e(0, 2));
  g(45, -1, 20, 4, e(0, 3));
  g(45, -1, 20, 8);
  for (c = 5;c--; )
    f(60 - 6 * c, 30, 9.9, 0, 2 * PI, e(c + 2, 3)), f(60 - 6 * c, 30, 10, -0.5, PI + 0.5, e(c + 2, 2)), f(60 - 6 * c, 30, 10.1, 0.5, PI - 0.5, e(c + 2, 1));
  f(36, 30, 10, PI / 2, 3 * PI / 2);
  f(48, 30, 10, PI / 2, 3 * PI / 2);
  f(60, 30, 10);
  b.beginPath();
  b.lineTo(36, 20);
  b.lineTo(60, 20);
  b.stroke();
  f(60, 30, 4, PI, 3 * PI, e(3, 2));
  f(60, 30, 4, PI, 2 * PI, e(3, 3));
  f(60, 30, 4, PI, 3 * PI);
  for (c = 6;c--; )
    b.beginPath(), b.lineTo(53, 54), b.lineTo(53, 40), b.lineTo(53 + (1 + 2.9 * c) * k, 40), b.lineTo(53 + (4 + 3.5 * c) * k, 54), b.fillStyle = e(0, c % 2 + 2), b.fill(), c % 2 && b.stroke();
  g(6, 40, 5, 5);
  g(6, 40, 5, 5, e());
  g(15, 54, 38, -14, e());
  for (g = 3;g--; )
    for (c = 2;c--; )
      f(15 * g + 15, 47, c ? 7 : 1, PI, 3 * PI, e(g, 3)), b.stroke(), f(15 * g + 15, 47, c ? 7 : 1, 0, PI, e(g, 2)), b.stroke();
  b.beginPath();
  b.lineTo(6, 40);
  b.lineTo(68, 40);
  b.stroke();
  b.beginPath();
  b.lineTo(77, 54);
  b.lineTo(4, 54);
  b.stroke();
  f = engineName;
  b.font = "900 16px arial";
  b.textAlign = "center";
  b.textBaseline = "top";
  b.lineWidth = 0.1 + 3.9 * k;
  g = 0;
  for (c = 0;c < f.length; ++c)
    g += b.measureText(f[c]).width;
  for (c = 2;c--; )
    for (let h = 0, m = 41 - g / 2;h < f.length; ++h)
      b.fillStyle = e(h, 2), d = b.measureText(f[h]).width, b[c ? "strokeText" : "fillText"](f[h], m + d / 2, 55.5, 17 * k), m += d;
  b.restore();
};
var showWatermark = 0;
var debug2 = 0;
var debugOverlay = 0;
var debugPhysics = 0;
var PI = Math.PI;
class Vector22 {
  constructor(a = 0, b = 0) {
    this.x = a;
    this.y = b;
    ASSERT2(this.isValid());
  }
  set(a = 0, b = 0) {
    this.x = a;
    this.y = b;
    ASSERT2(this.isValid());
    return this;
  }
  copy() {
    return new Vector22(this.x, this.y);
  }
  add(a) {
    ASSERT2(isVector22(a));
    return new Vector22(this.x + a.x, this.y + a.y);
  }
  subtract(a) {
    ASSERT2(isVector22(a));
    return new Vector22(this.x - a.x, this.y - a.y);
  }
  multiply(a) {
    ASSERT2(isVector22(a));
    return new Vector22(this.x * a.x, this.y * a.y);
  }
  divide(a) {
    ASSERT2(isVector22(a));
    return new Vector22(this.x / a.x, this.y / a.y);
  }
  scale(a) {
    ASSERT2(!isVector22(a));
    return new Vector22(this.x * a, this.y * a);
  }
  length() {
    return this.lengthSquared() ** 0.5;
  }
  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }
  distance(a) {
    ASSERT2(isVector22(a));
    return this.distanceSquared(a) ** 0.5;
  }
  distanceSquared(a) {
    ASSERT2(isVector22(a));
    return (this.x - a.x) ** 2 + (this.y - a.y) ** 2;
  }
  normalize(a = 1) {
    const b = this.length();
    return b ? this.scale(a / b) : new Vector22(0, a);
  }
  clampLength(a = 1) {
    const b = this.length();
    return b > a ? this.scale(a / b) : this;
  }
  dot(a) {
    ASSERT2(isVector22(a));
    return this.x * a.x + this.y * a.y;
  }
  cross(a) {
    ASSERT2(isVector22(a));
    return this.x * a.y - this.y * a.x;
  }
  angle() {
    return Math.atan2(this.x, this.y);
  }
  setAngle(a = 0, b = 1) {
    this.x = b * Math.sin(a);
    this.y = b * Math.cos(a);
    return this;
  }
  rotate(a) {
    const b = Math.cos(a);
    a = Math.sin(a);
    return new Vector22(this.x * b - this.y * a, this.x * a + this.y * b);
  }
  setDirection(a, b = 1) {
    a = mod2(a, 4);
    ASSERT2(a == 0 || a == 1 || a == 2 || a == 3);
    return vec22(a % 2 ? a - 1 ? -b : b : 0, a % 2 ? 0 : a ? -b : b);
  }
  direction() {
    return abs2(this.x) > abs2(this.y) ? 0 > this.x ? 3 : 1 : 0 > this.y ? 2 : 0;
  }
  invert() {
    return new Vector22(this.y, -this.x);
  }
  floor() {
    return new Vector22(Math.floor(this.x), Math.floor(this.y));
  }
  area() {
    return abs2(this.x * this.y);
  }
  lerp(a, b) {
    ASSERT2(isVector22(a));
    return this.add(a.subtract(this).scale(clamp2(b)));
  }
  arrayCheck(a) {
    ASSERT2(isVector22(a));
    return 0 <= this.x && 0 <= this.y && this.x < a.x && this.y < a.y;
  }
  toString(a = 3) {
    if (debug2)
      return `(${(0 > this.x ? "" : " ") + this.x.toFixed(a)},${(0 > this.y ? "" : " ") + this.y.toFixed(a)} )`;
  }
  isValid() {
    return typeof this.x == "number" && !isNaN(this.x) && typeof this.y == "number" && !isNaN(this.y);
  }
}

class Color2 {
  constructor(a = 1, b = 1, c = 1, d = 1) {
    this.r = a;
    this.g = b;
    this.b = c;
    this.a = d;
    ASSERT2(this.isValid());
  }
  set(a = 1, b = 1, c = 1, d = 1) {
    this.r = a;
    this.g = b;
    this.b = c;
    this.a = d;
    ASSERT2(this.isValid());
    return this;
  }
  copy() {
    return new Color2(this.r, this.g, this.b, this.a);
  }
  add(a) {
    ASSERT2(isColor2(a));
    return new Color2(this.r + a.r, this.g + a.g, this.b + a.b, this.a + a.a);
  }
  subtract(a) {
    ASSERT2(isColor2(a));
    return new Color2(this.r - a.r, this.g - a.g, this.b - a.b, this.a - a.a);
  }
  multiply(a) {
    ASSERT2(isColor2(a));
    return new Color2(this.r * a.r, this.g * a.g, this.b * a.b, this.a * a.a);
  }
  divide(a) {
    ASSERT2(isColor2(a));
    return new Color2(this.r / a.r, this.g / a.g, this.b / a.b, this.a / a.a);
  }
  scale(a, b = a) {
    return new Color2(this.r * a, this.g * a, this.b * a, this.a * b);
  }
  clamp() {
    return new Color2(clamp2(this.r), clamp2(this.g), clamp2(this.b), clamp2(this.a));
  }
  lerp(a, b) {
    ASSERT2(isColor2(a));
    return this.add(a.subtract(this).scale(clamp2(b)));
  }
  setHSLA(a = 0, b = 0, c = 1, d = 1) {
    a = mod2(a, 1);
    b = clamp2(b);
    c = clamp2(c);
    b = 0.5 > c ? c * (1 + b) : c + b - c * b;
    c = 2 * c - b;
    const e = (f, g, k) => 1 > 6 * (k = mod2(k, 1)) ? f + 6 * (g - f) * k : 1 > 2 * k ? g : 2 > 3 * k ? f + (g - f) * (4 - 6 * k) : f;
    this.r = e(c, b, a + 1 / 3);
    this.g = e(c, b, a);
    this.b = e(c, b, a - 1 / 3);
    this.a = d;
    ASSERT2(this.isValid());
    return this;
  }
  HSLA() {
    const a = clamp2(this.r), b = clamp2(this.g), c = clamp2(this.b), d = clamp2(this.a), e = Math.max(a, b, c), f = Math.min(a, b, c), g = (e + f) / 2;
    let k = 0, h = 0;
    if (e != f) {
      let m = e - f;
      h = 0.5 < g ? m / (2 - e - f) : m / (e + f);
      a == e ? k = (b - c) / m + (b < c ? 6 : 0) : b == e ? k = (c - a) / m + 2 : c == e && (k = (a - b) / m + 4);
    }
    return [k / 6, h, g, d];
  }
  mutate(a = 0.05, b = 0) {
    return new Color2(this.r + rand2(a, -a), this.g + rand2(a, -a), this.b + rand2(a, -a), this.a + rand2(b, -b)).clamp();
  }
  toString(a = true) {
    const b = (c) => (16 > (c = 255 * clamp2(c) | 0) ? "0" : "") + c.toString(16);
    return "#" + b(this.r) + b(this.g) + b(this.b) + (a ? b(this.a) : "");
  }
  setHex(a) {
    ASSERT2(typeof a == "string" && a[0] == "#");
    ASSERT2([4, 5, 7, 9].includes(a.length), "Invalid hex");
    6 > a.length ? (this.r = clamp2(parseInt(a[1], 16) / 15), this.g = clamp2(parseInt(a[2], 16) / 15), this.b = clamp2(parseInt(a[3], 16) / 15), this.a = a.length == 5 ? clamp2(parseInt(a[4], 16) / 15) : 1) : (this.r = clamp2(parseInt(a.slice(1, 3), 16) / 255), this.g = clamp2(parseInt(a.slice(3, 5), 16) / 255), this.b = clamp2(parseInt(a.slice(5, 7), 16) / 255), this.a = a.length == 9 ? clamp2(parseInt(a.slice(7, 9), 16) / 255) : 1);
    ASSERT2(this.isValid());
    return this;
  }
  rgbaInt() {
    const a = 255 * clamp2(this.r) | 0, b = 255 * clamp2(this.g) << 8, c = 255 * clamp2(this.b) << 16, d = 255 * clamp2(this.a) << 24;
    return a + b + c + d;
  }
  isValid() {
    return typeof this.r == "number" && !isNaN(this.r) && typeof this.g == "number" && !isNaN(this.g) && typeof this.b == "number" && !isNaN(this.b) && typeof this.a == "number" && !isNaN(this.a);
  }
}
var WHITE2 = rgb2();
var BLACK2 = rgb2(0, 0, 0);
var GRAY2 = rgb2(0.5, 0.5, 0.5);
var RED2 = rgb2(1, 0, 0);
var ORANGE2 = rgb2(1, 0.5, 0);
var YELLOW2 = rgb2(1, 1, 0);
var GREEN2 = rgb2(0, 1, 0);
var CYAN2 = rgb2(0, 1, 1);
var BLUE2 = rgb2(0, 0, 1);
var PURPLE2 = rgb2(0.5, 0, 1);
var MAGENTA2 = rgb2(1, 0, 1);

class Timer2 {
  constructor(a) {
    this.time = a == undefined ? undefined : time2 + a;
    this.setTime = a;
  }
  set(a = 0) {
    this.time = time2 + a;
    this.setTime = a;
  }
  unset() {
    this.time = undefined;
  }
  isSet() {
    return this.time != null;
  }
  active() {
    return time2 < this.time;
  }
  elapsed() {
    return time2 >= this.time;
  }
  get() {
    return this.isSet() ? time2 - this.time : 0;
  }
  getPercent() {
    return this.isSet() ? percent2(this.time - time2, this.setTime, 0) : 0;
  }
  toString() {
    if (debug2)
      return this.isSet() ? Math.abs(this.get()) + " seconds " + (0 > this.get() ? "before" : "after") : "unset";
  }
  valueOf() {
    return this.get();
  }
}
var cameraPos2 = vec22();
var cameraScale = 32;
var canvasMaxSize2 = vec22(1920, 1080);
var canvasFixedSize2 = vec22();
var canvasPixelated = true;
var tilesPixelated = true;
var showSplashScreen = false;
var headlessMode = false;
var glEnable = true;
var glOverlay = true;
var tileSizeDefault2 = vec22(16);
var tileFixBleedScale = 0;
var enablePhysicsSolver = true;
var objectDefaultMass = 1;
var objectDefaultDamping = 1;
var objectDefaultAngleDamping = 1;
var objectDefaultElasticity = 0;
var objectDefaultFriction = 0.8;
var objectMaxSpeed = 1;
var gravity = 0;
var gamepadsEnable = true;
var gamepadDirectionEmulateStick = true;
var inputWASDEmulateDirection = true;
var touchInputEnable = true;
var touchGamepadEnable = false;
var touchGamepadAnalog = true;
var touchGamepadSize = 99;
var touchGamepadAlpha = 0.3;
var soundEnable = true;
var soundVolume = 0.3;
var medalDisplaySize2 = vec22(640, 80);
class EngineObject {
  constructor(a = vec22(), b = vec22(1), c, d = 0, e = new Color2, f = 0) {
    ASSERT2(isVector22(a) && isVector22(b), "ensure pos and size are vec2s");
    ASSERT2(typeof c !== "number" || !c, "old style tile setup");
    this.pos = a.copy();
    this.size = b;
    this.drawSize = undefined;
    this.tileInfo = c;
    this.angle = d;
    this.color = e;
    this.additiveColor = undefined;
    this.mirror = false;
    this.mass = objectDefaultMass;
    this.damping = objectDefaultDamping;
    this.angleDamping = objectDefaultAngleDamping;
    this.elasticity = objectDefaultElasticity;
    this.friction = objectDefaultFriction;
    this.gravityScale = 1;
    this.renderOrder = f;
    this.velocity = vec22();
    this.angleVelocity = 0;
    this.spawnTime = time2;
    this.children = [];
    this.clampSpeedLinear = true;
    this.parent = undefined;
    this.localPos = vec22();
    this.localAngle = 0;
    this.collideRaycast = this.isSolid = this.collideSolidObjects = this.collideTiles = false;
    engineObjects.push(this);
  }
  updateTransforms() {
    const a = this.parent;
    if (a) {
      const b = a.getMirrorSign();
      this.pos = this.localPos.multiply(vec22(b, 1)).rotate(-a.angle).add(a.pos);
      this.angle = b * this.localAngle + a.angle;
    }
    for (const b of this.children)
      b.updateTransforms();
  }
  update() {
    if (!this.parent) {
      if (this.clampSpeedLinear)
        this.velocity.x = clamp2(this.velocity.x, -objectMaxSpeed, objectMaxSpeed), this.velocity.y = clamp2(this.velocity.y, -objectMaxSpeed, objectMaxSpeed);
      else {
        var a = this.velocity.lengthSquared();
        a > objectMaxSpeed * objectMaxSpeed && (a = objectMaxSpeed / a ** 0.5, this.velocity.x *= a, this.velocity.y *= a);
      }
      a = this.pos.copy();
      this.velocity.x *= this.damping;
      this.velocity.y *= this.damping;
      this.mass && (this.velocity.y += gravity * this.gravityScale);
      this.pos.x += this.velocity.x;
      this.pos.y += this.velocity.y;
      this.angle += this.angleVelocity *= this.angleDamping;
      ASSERT2(0 <= this.angleDamping && 1 >= this.angleDamping);
      ASSERT2(0 <= this.damping && 1 >= this.damping);
      if (enablePhysicsSolver && this.mass) {
        var b = 0 > this.velocity.y;
        if (this.groundObject) {
          var c = this.groundObject.velocity ? this.groundObject.velocity.x : 0;
          this.velocity.x = c + (this.velocity.x - c) * this.friction;
          this.groundObject = 0;
        }
        if (this.collideSolidObjects)
          for (var d of engineObjectsCollide) {
            if (!this.isSolid && !d.isSolid || d.destroyed || d.parent || d == this)
              continue;
            if (!isOverlapping(this.pos, this.size, d.pos, d.size))
              continue;
            c = this.collideWithObject(d);
            var e = d.collideWithObject(this);
            if (!c || !e)
              continue;
            if (isOverlapping(a, this.size, d.pos, d.size)) {
              c = a.subtract(d.pos);
              e = c.length();
              c = 0.01 > e ? randVector(0.001) : c.scale(0.001 / e);
              this.velocity = this.velocity.add(c);
              d.mass && (d.velocity = d.velocity.subtract(c));
              debugOverlay && debugPhysics && debugOverlap(this.pos, this.size, d.pos, d.size, "#f00");
              continue;
            }
            e = this.size.add(d.size);
            var f = 2 * (a.y - d.pos.y) > e.y + gravity;
            const k = 2 * abs2(a.y - d.pos.y) < e.y;
            var g = 2 * abs2(a.x - d.pos.x) < e.x;
            c = max(this.elasticity, d.elasticity);
            if (f || g || !k) {
              if (this.pos.y = d.pos.y + (e.y / 2 + 0.001) * sign(a.y - d.pos.y), d.groundObject && b || !d.mass)
                b && (this.groundObject = d), this.velocity.y *= -c;
              else if (d.mass) {
                g = (this.mass * this.velocity.y + d.mass * d.velocity.y) / (this.mass + d.mass);
                const h = d.velocity.y * (d.mass - this.mass) / (this.mass + d.mass) + 2 * this.velocity.y * this.mass / (this.mass + d.mass);
                this.velocity.y = lerp(c, g, this.velocity.y * (this.mass - d.mass) / (this.mass + d.mass) + 2 * d.velocity.y * d.mass / (this.mass + d.mass));
                d.velocity.y = lerp(c, g, h);
              }
            }
            !f && k && (this.pos.x = d.pos.x + (e.x / 2 + 0.001) * sign(a.x - d.pos.x), d.mass ? (e = (this.mass * this.velocity.x + d.mass * d.velocity.x) / (this.mass + d.mass), f = d.velocity.x * (d.mass - this.mass) / (this.mass + d.mass) + 2 * this.velocity.x * this.mass / (this.mass + d.mass), this.velocity.x = lerp(c, e, this.velocity.x * (this.mass - d.mass) / (this.mass + d.mass) + 2 * d.velocity.x * d.mass / (this.mass + d.mass)), d.velocity.x = lerp(c, e, f)) : this.velocity.x *= -c);
            debugOverlay && debugPhysics && debugOverlap(this.pos, this.size, d.pos, d.size, "#f0f");
          }
        if (this.collideTiles && tileCollisionTest(this.pos, this.size, this) && !tileCollisionTest(a, this.size, this)) {
          d = tileCollisionTest(vec22(a.x, this.pos.y), this.size, this);
          c = tileCollisionTest(vec22(this.pos.x, a.y), this.size, this);
          if (d || !c)
            this.velocity.y *= -this.elasticity, (this.groundObject = b) ? this.pos.y = (a.y - this.size.y / 2 | 0) + this.size.y / 2 + 0.0001 : this.pos.y = a.y;
          c && (this.pos.x = a.x, this.velocity.x *= -this.elasticity);
          debugOverlay && debugPhysics && debugRect(this.pos, this.size, "#f00");
        }
      }
    }
  }
  render() {
    drawTile(this.pos, this.drawSize || this.size, this.tileInfo, this.color, this.angle, this.mirror, this.additiveColor);
  }
  destroy() {
    if (!this.destroyed) {
      this.destroyed = 1;
      this.parent && this.parent.removeChild(this);
      for (const a of this.children)
        a.destroy(a.parent = 0);
    }
  }
  localToWorld(a) {
    return this.pos.add(a.rotate(-this.angle));
  }
  worldToLocal(a) {
    return a.subtract(this.pos).rotate(this.angle);
  }
  localToWorldVector(a) {
    return a.rotate(this.angle);
  }
  worldToLocalVector(a) {
    return a.rotate(-this.angle);
  }
  collideWithTile(a, b) {
    return 0 < a;
  }
  collideWithObject(a) {
    return true;
  }
  getAliveTime() {
    return time2 - this.spawnTime;
  }
  applyAcceleration(a) {
    this.mass && (this.velocity = this.velocity.add(a));
  }
  applyForce(a) {
    this.applyAcceleration(a.scale(1 / this.mass));
  }
  getMirrorSign() {
    return this.mirror ? -1 : 1;
  }
  addChild(a, b = vec22(), c = 0) {
    ASSERT2(!a.parent && !this.children.includes(a));
    this.children.push(a);
    a.parent = this;
    a.localPos = b.copy();
    a.localAngle = c;
  }
  removeChild(a) {
    ASSERT2(a.parent == this && this.children.includes(a));
    this.children.splice(this.children.indexOf(a), 1);
    a.parent = 0;
  }
  setCollision(a = true, b = true, c = true, d = true) {
    ASSERT2(a || !b, "solid objects must be set to collide");
    this.collideSolidObjects = a;
    this.isSolid = b;
    this.collideTiles = c;
    this.collideRaycast = d;
  }
  toString() {
    if (debug2) {
      let a = "type = " + this.constructor.name;
      if (this.pos.x || this.pos.y)
        a += "\npos = " + this.pos;
      if (this.velocity.x || this.velocity.y)
        a += "\nvelocity = " + this.velocity;
      if (this.size.x || this.size.y)
        a += "\nsize = " + this.size;
      this.angle && (a += "\nangle = " + this.angle.toFixed(3));
      this.color && (a += "\ncolor = " + this.color);
      return a;
    }
  }
  renderDebugInfo() {
    if (debug2) {
      const a = vec22(max(this.size.x, 0.2), max(this.size.y, 0.2)), b = rgb2(this.collideTiles ? 1 : 0, this.collideSolidObjects ? 1 : 0, this.isSolid ? 1 : 0, this.parent ? 0.2 : 0.5), c = this.parent ? rgb2(1, 1, 1, 0.5) : rgb2(0, 0, 0, 0.8);
      drawRect(this.pos, a, b, this.angle, false);
      drawRect(this.pos, a.scale(0.8), c, this.angle, false);
      this.parent && drawLine(this.pos, this.parent.pos, 0.1, rgb2(0, 0, 1, 0.5), false);
    }
  }
}
var mainCanvas;
var mainContext;
var overlayCanvas;
var overlayContext;
var mainCanvasSize2 = vec22();
var textureInfos = [];
var drawCount;

class TileInfo {
  constructor(a = vec22(), b = tileSizeDefault2, c = 0, d = 0) {
    this.pos = a.copy();
    this.size = b.copy();
    this.textureIndex = c;
    this.padding = d;
  }
  offset(a) {
    return new TileInfo(this.pos.add(a), this.size, this.textureIndex);
  }
  frame(a) {
    ASSERT2(typeof a == "number");
    return this.offset(vec22(a * (this.size.x + 2 * this.padding), 0));
  }
  getTextureInfo() {
    return textureInfos[this.textureIndex];
  }
}

class TextureInfo {
  constructor(a) {
    this.image = a;
    this.size = vec22(a.width, a.height);
    this.glTexture = glEnable && glCreateTexture(a);
  }
}
var mousePos2 = vec22();
var mousePosScreen2 = vec22();
var mouseWheel = 0;
var isUsingGamepad = false;
var preventDefaultInput = false;
var inputData = [[]];
var gamepadStickData = [];
var isTouchDevice2 = window.ontouchstart !== undefined;
var touchGamepadTimer2 = new Timer2;
var touchGamepadButtons;
var touchGamepadStick;
var audioContext2 = new AudioContext;
var audioGainNode;
var tileCollision = [];
var tileCollisionSize2 = vec22();
var glCanvas;
var glContext;
var glAntialias = true;
var glShader;
var glActiveTexture;
var glArrayBuffer;
var glGeometryBuffer;
var glPositionData;
var glColorData;
var glInstanceCount;
var glAdditive;
var glBatchAdditive;
var gl_ONE = 1;
var gl_TRIANGLE_STRIP = 5;
var gl_SRC_ALPHA = 770;
var gl_ONE_MINUS_SRC_ALPHA = 771;
var gl_BLEND = 3042;
var gl_TEXTURE_2D = 3553;
var gl_UNSIGNED_BYTE = 5121;
var gl_FLOAT = 5126;
var gl_RGBA = 6408;
var gl_NEAREST = 9728;
var gl_LINEAR = 9729;
var gl_TEXTURE_MAG_FILTER = 10240;
var gl_TEXTURE_MIN_FILTER = 10241;
var gl_COLOR_BUFFER_BIT = 16384;
var gl_TEXTURE0 = 33984;
var gl_ARRAY_BUFFER = 34962;
var gl_STATIC_DRAW = 35044;
var gl_DYNAMIC_DRAW = 35048;
var gl_FRAGMENT_SHADER = 35632;
var gl_VERTEX_SHADER = 35633;
var gl_COMPILE_STATUS = 35713;
var gl_LINK_STATUS = 35714;
var gl_INDICIES_PER_INSTANCE2 = 11;
var gl_MAX_INSTANCES2 = 1e4;
var gl_INSTANCE_BYTE_STRIDE2 = 4 * gl_INDICIES_PER_INSTANCE2;
var gl_INSTANCE_BUFFER_SIZE2 = gl_MAX_INSTANCES2 * gl_INSTANCE_BYTE_STRIDE2;
var engineName = "LittleJS";
var engineVersion = "1.11.2";
var frameRate2 = 60;
var timeDelta2 = 1 / frameRate2;
var engineObjects = [];
var engineObjectsCollide = [];
var frame = 0;
var time2 = 0;
var timeReal = 0;
var paused = false;
var frameTimeLastMS = 0;
var frameTimeBufferMS = 0;
var averageFPS = 0;
var pluginUpdateList = [];
var pluginRenderList = [];
// src/animation/animation-manager.ts
class AnimationManager {
  animationInfos = {};
  imageSources = [];
  constructor(animations) {
    this.saveImageSource(animations);
    this.registerAnimations(animations);
    this.registerTileInfos(animations);
    this.updateExtra(animations);
  }
  saveImageSource(animations) {
    animations?.forEach((animation) => {
      if (animation.imageSource && !this.imageSources.includes(animation.imageSource)) {
        this.imageSources.push(animation.imageSource);
      }
    });
  }
  ensureAnimationInfos(name) {
    if (!this.animationInfos[name]) {
      this.animationInfos[name] = {
        animation: undefined,
        tileInfos: []
      };
    }
    return this.animationInfos[name];
  }
  registerTileInfos(animations) {
    animations.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      const imgSource = animation.imageSource;
      if (imgSource) {
        const size = vec22(animation.spriteSize?.[0] ?? 0, animation.spriteSize?.[1] ?? 0);
        animation.frames?.forEach((frame2) => {
          const mul = animation.mul ?? 1;
          const cols = 30;
          for (let i = 0;i < mul; i++) {
            animInfo.tileInfos.push(new TileInfo(undefined, size, this.imageSources.indexOf(imgSource), 2).frame(frame2 % cols).offset(vec22(0, Math.floor(frame2 / cols) * (size.y + 4))));
          }
        });
      }
    });
    animations.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      animation.children?.forEach((child) => {
        const childAnimInfo = this.getInfo(child);
        animInfo.tileInfos.push(...childAnimInfo.tileInfos);
      });
    });
  }
  registerAnimations(animations) {
    animations?.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      animInfo.animation = animation;
    });
  }
  updateExtra(animations) {
    animations.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      if (animation.airFrames?.length) {
        let count = 0;
        animInfo.airFramesSet = new Set;
        animation.frames?.forEach((frame2) => {
          const mul = animation.mul ?? 1;
          for (let i = 0;i < mul; i++) {
            if (animation.airFrames?.includes(frame2)) {
              animInfo.airFramesSet?.add(count);
            }
            count++;
          }
        });
      }
    });
  }
  getInfo(name) {
    return this.animationInfos[name];
  }
}

// src/core/GameObject.ts
var EDGES = [-25, 25];
var GROUND = 0;

class GameObject extends EngineObject {
  socketClient;
  isPlayer;
  data;
  mov = vec22(0, 0);
  acc = vec22(0, -0.01);
  grounded = false;
  spins = 1;
  desiredMove = 0;
  goalPos = vec22(0, 0);
  constructor(socketClient, isPlayer, data = {}) {
    super();
    this.socketClient = socketClient;
    this.isPlayer = isPlayer;
    this.data = data;
    this.angleDamping = 0.99;
    this.size = vec22(3, 3);
  }
  refreshFromSocket() {
    if (!this.data.pos) {
      return;
    }
    if (this.data.pos.x !== this.goalPos.x || this.data.pos.y !== this.goalPos.y) {
      this.goalPos.set(this.data.pos.x, this.data.pos.y);
    }
    this.pos.x += (this.goalPos.x - this.pos.x) * 0.1;
    this.pos.y += (this.goalPos.y - this.pos.y) * 0.1;
    this.size.x = this.data.size?.x || this.size.x;
    this.size.y = this.data.size?.y || this.size.y;
  }
  shareUpdate() {
    if (!this.isPlayer) {
      return;
    }
    const selfState = this.socketClient.self.state;
    if (selfState.pos?.x !== this.pos.x || selfState.pos?.y !== this.pos.y) {
      this.socketClient.self.setData("pos", this.pos);
    }
    if (selfState.size?.x !== this.size.x || selfState.size?.y !== this.size.y) {
      this.socketClient.self.setData("size", this.size);
    }
  }
  spin() {
    if (this.spins) {
      this.angleVelocity = this.size.x < 0 ? -0.5 : 0.5;
      this.mov.y = 0;
      this.acc.y = 0;
      this.mov.x = Math.sign(this.size.x) * 0.5;
      this.spins--;
      this.pos.y = Math.max(this.pos.y, GROUND + 1);
      this.grounded = false;
      this.shareUpdate();
    }
  }
  jump() {
    this.mov.y = -1;
    this.shareUpdate();
    if (!this.grounded) {
      return;
    }
  }
  moveX(val) {
    if (this.angleVelocity) {
      return;
    }
    if (this.size.x * val < 0) {
      this.size.x *= -1;
    }
    this.desiredMove = val;
    if (this.grounded) {
      if (this.mov.x !== val * 0.1) {
        this.mov.x = val * 0.1;
        this.shareUpdate();
      }
    }
  }
  update() {
    super.update();
    if (!this.isPlayer) {
      this.refreshFromSocket();
      return;
    }
    this.mov = this.mov.add(vec22(this.acc.x, this.mov.y < 0 ? this.acc.y * 2 : this.acc.y));
    this.pos = this.pos.add(vec22(this.mov.x * (this.angleVelocity ? 1.5 : 1), this.mov.y));
    this.mov.multiply(vec22(0.99, 0.99));
    if (this.pos.y < GROUND) {
      this.pos.y = GROUND;
      this.mov.y = Math.abs(this.mov.y * 0.4);
      if (this.mov.y < 0.4) {
        this.angleVelocity = 0;
        this.angle = 0;
        this.grounded = true;
        this.spins = 1;
        this.mov.x = this.desiredMove * 0.1;
      } else {
        this.grounded = false;
      }
    }
    if (this.pos.x < EDGES[0]) {
      this.pos.x = EDGES[0];
      this.mov.x = Math.abs(this.mov.x * 0.1);
      if (!this.grounded) {
        this.mov.y = 0.3;
        this.acc.y = -0.01;
      }
    } else if (this.pos.x > EDGES[1]) {
      this.pos.x = EDGES[1];
      this.mov.x = -Math.abs(this.mov.x * 0.1);
      if (!this.grounded) {
        this.mov.y = 0.3;
        this.acc.y = -0.01;
      }
    }
    this.shareUpdate();
  }
}

// node_modules/napl/dist/index.js
var commitUpdates = function(root, updates) {
  const confirmedUpdates = getConfirmedUpdates(updates);
  confirmedUpdates?.forEach((update) => {
    const parts = update.path.split("/");
    const leaf = getLeafObject(root, parts, 1, true);
    const prop = parts[parts.length - 1];
    if (update.push) {
      if (!Array.isArray(leaf[prop])) {
        leaf[prop] = [];
      }
      leaf[prop] = [...leaf[prop], update.value];
    } else if ((update.insert ?? -1) >= 0) {
      if (!Array.isArray(leaf[prop])) {
        leaf[prop] = [];
      }
      leaf[prop] = [...leaf[prop].slice(0, update.insert ?? -1), update.value, ...leaf[prop].slice(update.insert)];
    } else if ((update.delete ?? -1) >= 0) {
      if (Array.isArray(leaf[prop])) {
        leaf[prop] = [...leaf[prop].slice(0, update.delete), ...leaf[prop].slice((update.delete ?? -1) + 1)];
      }
    } else if (update.value === undefined) {
      delete leaf[prop];
    } else {
      leaf[prop] = update.value;
    }
  });
};
var getConfirmedUpdates = function(updates) {
  const confirmedUpdates = updates.filter((update) => update.confirmed);
  confirmedUpdates?.sort((a, b) => {
    const confirmedA = a.confirmed ?? 0;
    const confirmedB = b.confirmed ?? 0;
    if (confirmedA !== confirmedB) {
      return confirmedA - confirmedB;
    }
    return a.path.localeCompare(b.path);
  });
  return confirmedUpdates;
};
var getLeafObject = function(obj, path, offset, autoCreate, selfId) {
  const parts = Array.isArray(path) ? path : path.split("/");
  let current = obj;
  for (let i = 0;i < parts.length - offset; i++) {
    let prop = selfId && parts[i] === "{self}" ? selfId : parts[i];
    if (prop === "{keys}") {
      return Object.keys(current);
    }
    if (prop === "{values}") {
      return Object.values(current);
    }
    if (current[prop] === undefined) {
      if (autoCreate) {
        current[prop] = {};
      } else {
        return;
      }
    }
    current = current[prop];
  }
  return current;
};
var G = function(n, h) {
  let [c, t] = T(n, h);
  return [J.decode(new Uint8Array(n, t, c)), t + c];
};
var H = function(n, h) {
  let [c, t] = E(n, h);
  return [J.decode(new Uint8Array(n, t, c)), t + c];
};
var I = function(n, h) {
  let [c, t] = E(n, h);
  return [new Blob([new Uint8Array(n, t, c)], { type: "application/octet-stream" }), t + c];
};
var E = function(n, h) {
  return [new Uint32Array(n.slice(h, h + Uint32Array.BYTES_PER_ELEMENT), 0, 1)[0], h + Uint32Array.BYTES_PER_ELEMENT];
};
var T = function(n, h) {
  return [new Uint8Array(n, h, 1)[0], h + Uint8Array.BYTES_PER_ELEMENT];
};
async function W(n) {
  let h = {}, c = 0, t;
  while (c < n.size) {
    t = t ?? await n.arrayBuffer();
    let [i, w] = G(t, c);
    c = w;
    let [j, K] = T(t, c);
    switch (c = K, j) {
      case 1:
        try {
          let [m, C] = H(t, c);
          c = C, h[i] = JSON.parse(m);
        } catch (m) {
          console.warn("Failed to parse JSON payload", m);
        }
        break;
      case 2:
        let [g, q] = I(t, c);
        c = q, h[i] = g;
        break;
    }
  }
  return h;
}
async function N(n, h, c = () => globalThis.crypto.randomUUID()) {
  if (typeof n === "string" && n.startsWith("blob:")) {
    let t = await fetch(n).then((w) => w.blob());
    URL.revokeObjectURL(n);
    let i = `{blobUrl:${c()}}`;
    return h[i] = t, i;
  }
  if (typeof n === "object" && n instanceof Blob) {
    let t = `{blob:${c()}}`;
    return h[t] = n, t;
  }
  if (Array.isArray(n))
    await Promise.all(n.map(async (t, i) => {
      n[i] = await N(t, h, c);
    }));
  else if (typeof n === "object" && n)
    await Promise.all(Object.entries(n).map(async ([t, i]) => {
      n[t] = await N(i, h, c);
    }));
  return n;
}
var addMessageReceiver = function(socket, payloadReceived) {
  socket.on("message", async (message) => {
    if (message instanceof Buffer) {
      const blob = new Blob([message]);
      const { payload, ...blobs } = await W(blob);
      if (payload) {
        payloadReceived(payload, blobs);
      }
    }
  });
};
class A {
  data = [];
  #n = new TextEncoder;
  static payload(n, h) {
    return new A().payload(n, h);
  }
  static blob(n, h) {
    return new A().blob(n, h);
  }
  #h(n) {
    let h = this.#n.encode(n), c = new Uint8Array([h.byteLength]);
    this.data.push(c.buffer), this.data.push(h.buffer);
  }
  payload(n, h) {
    this.#h(n);
    let c = new Uint8Array([1]);
    this.data.push(c.buffer);
    let t = JSON.stringify(h), i = this.#n.encode(t), w = new Uint32Array([i.byteLength]);
    return this.data.push(w.buffer), this.data.push(i.buffer), this;
  }
  blob(n, h) {
    this.#h(n);
    let c = new Uint8Array([2]);
    this.data.push(c.buffer);
    let t = new Uint32Array([h.size]);
    return this.data.push(t.buffer), this.data.push(h), this;
  }
  build() {
    return new Blob(this.data);
  }
}
var J = new TextDecoder;

class SyncRoom {
  room;
  #sockets = new Map;
  #state;
  #onRoomChange = new Set;
  #updates = [];
  constructor(room) {
    this.room = room;
    this.#state = {
      clients: {},
      blobs: {}
    };
  }
  addRoomChangeListener(callback) {
    this.#onRoomChange.add(callback);
  }
  async welcomeClient(client) {
    const clientId = crypto.randomUUID();
    const clientPath = `clients/${clientId}`;
    const clientState = {};
    this.#sockets.set(client, clientState);
    const newUpdates = [{
      path: clientPath,
      value: clientState,
      confirmed: Date.now(),
      blobs: {}
    }];
    this.#shareUpdates(newUpdates, client);
    addMessageReceiver(client, (payload, blobs) => {
      Object.entries(blobs).forEach(([key, blob]) => this.#state.blobs[key] = blob);
      payload.updates?.forEach((update) => {
        const blobs2 = update.blobs ?? {};
        Object.keys(blobs2).forEach((key) => blobs2[key] = this.#state.blobs[key]);
      });
      this.#shareUpdates(payload.updates, client);
      setImmediate(() => this.#cleanupBlobs());
    });
    client.on("close", () => {
      this.#sockets.delete(client);
      this.#shareUpdates([{
        path: clientPath,
        value: undefined,
        confirmed: Date.now(),
        blobs: {}
      }]);
      console.log(`client ${clientId} disconnected from room ${this.room}`);
      this.#onRoomChange.forEach((callback) => callback(this.#state));
    });
    commitUpdates(this.#state, this.#updates);
    this.#updates = this.#updates.filter((update) => !update.confirmed);
    const blobBuilder = A.payload("payload", {
      myClientId: clientId,
      state: { ...this.#state, blobs: undefined },
      updates: this.#updates
    });
    Object.entries(this.#state.blobs).forEach(([key, blob]) => blobBuilder.blob(key, blob));
    this.#updates.forEach((update) => Object.entries(update.blobs ?? {}).forEach(([key, blob]) => blobBuilder.blob(key, blob)));
    client.send(await blobBuilder.build().arrayBuffer());
    return { clientId };
  }
  #shareUpdates(newUpdates, sender) {
    if (!newUpdates?.length) {
      return;
    }
    const updatesForSender = newUpdates.filter((update) => !update.confirmed);
    this.#markCommonUpdatesConfirmed(newUpdates);
    this.#pushUpdates(newUpdates);
    commitUpdates(this.#state, this.#updates);
    this.#updates = this.#updates.filter((update) => !update.confirmed);
    this.#broadcastUpdates(newUpdates, (client) => client !== sender);
    this.#broadcastUpdates(updatesForSender, (client) => client === sender);
  }
  #pushUpdates(newUpdates) {
    newUpdates?.forEach((update) => this.#updates.push(update));
  }
  async#broadcastUpdates(newUpdates, senderFilter) {
    if (!newUpdates?.length) {
      return;
    }
    const blobBuilder = A.payload("payload", { updates: newUpdates });
    newUpdates.forEach((update) => Object.entries(update.blobs ?? {}).forEach(([key, blob]) => blobBuilder.blob(key, blob)));
    const buffer = await blobBuilder.build().arrayBuffer();
    this.#sockets.keys().forEach((client) => {
      if (senderFilter && !senderFilter(client)) {
        return;
      }
      client.send(buffer);
    });
  }
  #markCommonUpdatesConfirmed(updates) {
    updates.forEach((update) => {
      if (!this.#restrictedPath(update.path)) {
        update.confirmed = Date.now();
      }
    });
  }
  #restrictedPath(path) {
    return path.startsWith("clients/") || path.startsWith("blobs/");
  }
  #cleanupBlobs() {
    const blobSet = new Set(Object.keys(this.#state.blobs));
    this.#findUsedBlobs(this.#state, blobSet);
    if (blobSet.size) {
      const updates = [];
      const now = Date.now();
      blobSet.forEach((key) => {
        updates.push({
          path: `blobs/${key}`,
          value: undefined,
          confirmed: now
        });
      });
      this.#shareUpdates(updates);
    }
  }
  #findUsedBlobs(root, blobSet) {
    if (typeof root === "string") {
      if (blobSet.has(root)) {
        blobSet.delete(root);
      }
    } else if (Array.isArray(root)) {
      root.forEach((value) => this.#findUsedBlobs(value, blobSet));
    } else if (typeof root === "object") {
      Object.values(root).forEach((value) => this.#findUsedBlobs(value, blobSet));
    }
  }
}

class SyncSocket {
  #rooms = {};
  constructor(server) {
    this.#hookupSocketServer(server);
  }
  #hookupSocketServer(websocketServer) {
    websocketServer.on("listening", () => {
      const address = websocketServer.address();
      if (typeof address === "string") {
        console.log(`WebSocket server listening on ${address}`);
      } else if (address && typeof address === "object") {
        const host = address.address === "::" ? "localhost" : address.address;
        console.log(`WebSocket server listening on ws://${host}:${address.port}`);
      }
    });
    websocketServer.on("connection", async (socket, req) => {
      const parameters = new URLSearchParams(req.url?.split("?")[1]);
      const roomName = parameters.get("room") ?? "default";
      const room = this.#getRoom(roomName);
      const { clientId } = await room.welcomeClient(socket);
      console.log(`client ${clientId} connected in room ${roomName}.`);
    });
  }
  #getRoom(roomName) {
    if (!this.#rooms[roomName]) {
      this.#rooms[roomName] = new SyncRoom(roomName);
      this.#rooms[roomName].addRoomChangeListener((roomState) => {
        setTimeout(() => {
          if (!Object.values(roomState.clients).length) {
            console.log("closing room", roomName);
            delete this.#rooms[roomName];
          }
        }, 1e4);
      });
    }
    return this.#rooms[roomName];
  }
}

class ClientData {
  socketClient;
  id = "";
  constructor(socketClient) {
    this.socketClient = socketClient;
  }
  #getAbsolutePath(path) {
    return path ? `clients/{self}/${path}` : "clients/{self}";
  }
  observe(...paths) {
    const updatedPaths = paths.map((path) => this.#getAbsolutePath(path));
    return this.socketClient.observe(...updatedPaths);
  }
  async setData(path, value, options) {
    return this.socketClient.setData(this.#getAbsolutePath(path), value, options);
  }
  get state() {
    return this.socketClient.state.clients?.[this.id] ?? {};
  }
}

class SubData {
  path;
  socketClient;
  parts = [];
  constructor(path, socketClient) {
    this.path = path;
    this.socketClient = socketClient;
    this.parts = path.split("/");
  }
  #getAbsolutePath(path) {
    return path ? `${this.path}/${path}` : this.path;
  }
  observe(...paths) {
    const updatedPaths = paths.map((path) => this.#getAbsolutePath(path));
    return this.socketClient.observe(...updatedPaths);
  }
  async setData(path, value, options) {
    return this.socketClient.setData(this.#getAbsolutePath(path), value, options);
  }
  get state() {
    return getLeafObject(this.socketClient.state, this.parts, 0, false) ?? {};
  }
}

class Observer {
  socketClient;
  pathArrays;
  observations;
  changeCallbacks = new Set;
  #addedElementsCallback;
  #deletedElementsCallback;
  constructor(socketClient, paths) {
    this.socketClient = socketClient;
    this.pathArrays = paths.map((p) => p === undefined ? [] : p.split("/"));
    this.observations = paths.map(() => {
      const observation = {
        previous: undefined,
        value: undefined
      };
      return observation;
    });
    requestAnimationFrame(() => {
      this.triggerIfChanged();
    });
  }
  onChange(callback) {
    this.changeCallbacks.add(callback);
    return this;
  }
  onElementsAdded(callback) {
    this.#addedElementsCallback = callback;
    return this;
  }
  onElementsDeleted(callback) {
    this.#deletedElementsCallback = callback;
    return this;
  }
  #updatedObservations() {
    const newValues = this.pathArrays.map((p) => getLeafObject(this.socketClient.state, p, 0, false, this.socketClient.clientId));
    if (this.observations.length && this.observations.every((ob, index) => {
      const newValue = newValues[index];
      if (ob.value === newValue) {
        return true;
      }
      if (Array.isArray(ob.value) && Array.isArray(newValue) && ob.value.length === newValue.length && ob.value.every((elem, idx) => elem === newValue[idx])) {
        return true;
      }
      return false;
    })) {
      return false;
    }
    this.observations.forEach((observation, index) => {
      observation.previous = observation.value;
      observation.value = newValues[index];
    });
    return true;
  }
  triggerIfChanged() {
    if (!this.#updatedObservations()) {
      return;
    }
    this.changeCallbacks.forEach((callback) => callback(...this.observations));
    if (this.#addedElementsCallback && this.observations.some((observation) => Array.isArray(observation.value))) {
      let hasNewElements = false;
      const newElementsArray = this.observations.map((observation) => {
        if (Array.isArray(observation.value)) {
          const previousSet = new Set(Array.isArray(observation.previous) ? observation.previous : []);
          const newElements = observation.value.filter((clientId) => !previousSet.has(clientId));
          if (newElements.length) {
            hasNewElements = true;
          }
          return newElements;
        }
      });
      if (hasNewElements) {
        this.#addedElementsCallback(...newElementsArray);
      }
    }
    if (this.#deletedElementsCallback && this.observations.some((observation) => Array.isArray(observation.previous))) {
      let hasDeletedElements = false;
      const deletedElementsArray = this.observations.map((observation) => {
        if (Array.isArray(observation.previous)) {
          const currentSet = new Set(Array.isArray(observation.value) ? observation.value : []);
          const deletedElements = observation.previous.filter((clientId) => !currentSet.has(clientId));
          if (deletedElements.length) {
            hasDeletedElements = true;
          }
          return deletedElements;
        }
      });
      if (hasDeletedElements) {
        this.#deletedElementsCallback(...deletedElementsArray);
      }
    }
  }
  close() {
    console.log("Closed observer " + this.pathArrays.join("/"));
    this.socketClient.removeObserver(this);
  }
}

class ObserverManager {
  socketClient;
  #observers = new Set;
  constructor(socketClient) {
    this.socketClient = socketClient;
  }
  observe(...paths) {
    const observer = new Observer(this.socketClient, paths);
    this.#observers.add(observer);
    return observer;
  }
  triggerObservers() {
    this.#observers.forEach((o) => o.triggerIfChanged());
  }
  removeObserver(observer) {
    this.#observers.delete(observer);
  }
}

class SocketClient {
  state = {};
  #socket;
  #connectionPromise;
  #connectionUrl;
  #outgoingUpdates = [];
  #incomingUpdates = [];
  #selfData = new ClientData(this);
  #observerManager = new ObserverManager(this);
  constructor(host, room) {
    const prefix = host.startsWith("ws://") || host.startsWith("wss://") ? "" : globalThis.location.protocol === "https:" ? "wss://" : "ws://";
    this.#connectionUrl = `${prefix}${host}${room ? `?room=${room}` : ""}`;
    this.#connect();
    globalThis.addEventListener("focus", () => {
      if (!this.#socket) {
        this.#connect();
      }
    });
  }
  #fixPath(path) {
    const split = path.split("/");
    return split.map((part) => part === "{self}" ? this.#selfData.id : part).join("/");
  }
  #usefulUpdate(update) {
    const currentValue = getLeafObject(this.state, update.path, 0, false, this.#selfData.id);
    return update.value !== currentValue;
  }
  async setData(path, value, options) {
    await this.#waitForConnection();
    const payloadBlobs = {};
    value = await N(value, payloadBlobs);
    const update = {
      path: this.#fixPath(path),
      value: options?.delete ? undefined : value,
      confirmed: options?.passive ? undefined : Date.now(),
      push: options?.push,
      insert: options?.insert,
      blobs: payloadBlobs
    };
    if (!this.#usefulUpdate(update)) {
      return;
    }
    if (!options?.passive) {
      this.#queueIncomingUpdates(update);
    }
    this.#queueOutgoingUpdates(update);
  }
  get clientId() {
    return this.#selfData.id;
  }
  get self() {
    return this.#selfData;
  }
  access(path) {
    return new SubData(path, this);
  }
  observe(...paths) {
    return this.#observerManager.observe(...paths);
  }
  async#waitForConnection() {
    if (!this.#socket) {
      this.#connect();
    }
    return this.#connectionPromise;
  }
  async#connect() {
    const socket = this.#socket = new WebSocket(this.#connectionUrl);
    return this.#connectionPromise = new Promise((resolve, reject) => {
      socket.addEventListener("open", () => {
        console.log("Connected to WebSocket server", this.#connectionUrl);
      });
      socket.addEventListener("error", (event) => {
        console.error("Error connecting to WebSocket server", event);
        reject(event);
      });
      socket.addEventListener("message", async (event) => {
        const { payload, ...blobs } = await W(event.data);
        if (payload?.myClientId) {
          this.#selfData.id = payload.myClientId;
          this.#connectionPromise = undefined;
          resolve();
        }
        if (payload?.state) {
          this.state = payload.state;
          this.state.blobs = blobs;
        }
        if (payload?.updates) {
          const updates = payload.updates;
          updates.forEach((update) => {
            const updateBlobs = update.blobs ?? {};
            Object.keys(updateBlobs).forEach((key) => updateBlobs[key] = blobs[key]);
          });
          this.#queueIncomingUpdates(...payload.updates);
        }
        this.#observerManager.triggerObservers();
      });
      socket.addEventListener("close", () => {
        console.log("Disconnected from WebSocket server");
        this.#socket = undefined;
        this.#selfData.id = "";
      });
    });
  }
  #queueOutgoingUpdates(...updates) {
    if (!this.#outgoingUpdates.length) {
      requestAnimationFrame(() => this.#broadcastUpdates());
    }
    this.#outgoingUpdates.push(...updates);
  }
  #queueIncomingUpdates(...updates) {
    if (!this.#incomingUpdates.length) {
      requestAnimationFrame(() => this.#applyUpdates());
    }
    this.#incomingUpdates.push(...updates);
  }
  async#broadcastUpdates() {
    await this.#waitForConnection();
    const blobBuilder = A.payload("payload", { updates: this.#outgoingUpdates });
    const addedBlob = new Set;
    this.#outgoingUpdates.forEach((update) => {
      Object.entries(update.blobs ?? {}).forEach(([key, blob]) => {
        if (!addedBlob.has(key)) {
          blobBuilder.blob(key, blob);
          addedBlob.add(key);
        }
      });
    });
    this.#socket?.send(blobBuilder.build());
    this.#outgoingUpdates.length = 0;
  }
  #saveBlobsFromUpdates(updates) {
    updates.forEach((update) => Object.entries(update.blobs ?? {}).forEach(([key, blob]) => {
      this.state.blobs[key] = blob;
    }));
  }
  #applyUpdates() {
    this.#saveBlobsFromUpdates(this.#incomingUpdates);
    commitUpdates(this.state, this.#incomingUpdates);
    this.#incomingUpdates.length = 0;
    this.#observerManager.triggerObservers();
  }
  removeObserver(observer) {
    this.#observerManager.removeObserver(observer);
  }
}

// src/index.ts
var updateMovement = function() {
  let dx = 0;
  if (keys["ArrowRight"] || keys["KeyD"]) {
    dx += 1;
  }
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    dx += -1;
  }
  obj.moveX(dx);
};
var gameInit = function() {
  cameraPos.set(0, 10);
  obj.size = vec22(3, 3);
};
var gameUpdate = function() {
  obj.update();
  obj.tileInfo = animationManager.getInfo("spincasters").tileInfos[0];
  otherPlayers.forEach((player) => {
    player.update();
    player.tileInfo = animationManager.getInfo("ogre").tileInfos[0];
  });
};
var postUpdate = function() {
};
var render = function() {
};
var renderPost = function() {
  obj.render();
  otherPlayers.forEach((player) => {
    player.render();
  });
};
var client = new SocketClient("wss://api.dobuki.net", "sample");
client.observe(undefined).onChange((update) => {
  console.log(update.value);
});
var animationManager = new AnimationManager([
  {
    name: "spincasters",
    imageSource: "assets/spincasters.png",
    spriteSize: [512, 512],
    frames: [0],
    mul: 1
  },
  {
    name: "ogre",
    imageSource: "assets/spincasters.png",
    spriteSize: [512, 512],
    frames: [1],
    mul: 1
  }
]);
var obj = new GameObject(client, true);
var otherPlayers = [];
client.observe("clients/{keys}").onElementsAdded((clientIds) => {
  clientIds?.forEach((clientId) => {
    const isSelf = clientId === client.clientId;
    if (!isSelf) {
      otherPlayers.push(new GameObject(client, false, client.state.clients[clientId]));
    }
  });
});
var keys = {};
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp" || e.code === "KeyW") {
    obj.jump();
  }
  if (e.code === "ArrowRight" || e.code === "KeyD" || e.code === "ArrowLeft" || e.code === "KeyA") {
    keys[e.code] = true;
    updateMovement();
  }
  if (e.key === "x") {
    obj.spin();
  }
});
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight" || e.code === "KeyD" || e.code === "ArrowLeft" || e.code === "KeyA") {
    keys[e.code] = false;
    updateMovement();
  }
});
var imageSources = [
  "assets/spincasters.png"
];
engineInit(gameInit, gameUpdate, postUpdate, render, renderPost, imageSources);

//# debugId=BEBB0A30ADEAA38764756e2164756e21
