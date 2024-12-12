// dist/littlejs.esm.min.js
var ASSERT = function() {
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
var abs = function(a) {
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
var mod = function(a, b = 1) {
  return (a % b + b) % b;
};
var clamp = function(a, b = 0, c = 1) {
  return a < b ? b : a > c ? c : a;
};
var percent = function(a, b, c) {
  return (c -= b) ? clamp((a - b) / c) : 0;
};
var lerp = function(a, b, c) {
  return b + clamp(a) * (c - b);
};
var isOverlapping = function(a, b, c, d = vec2()) {
  return 2 * abs(a.x - c.x) < b.x + d.x && 2 * abs(a.y - c.y) < b.y + d.y;
};
var wave = function(a = 1, b = 1, c = time) {
  return b / 2 * (1 - Math.cos(c * a * 2 * PI));
};
var rand = function(a = 1, b = 0) {
  return b + Math.random() * (a - b);
};
var randVector = function(a = 1) {
  return new Vector2().setAngle(rand(2 * PI), a);
};
var randColor = function(a = new Color, b = new Color(0, 0, 0, 1), c = false) {
  return c ? a.lerp(b, rand()) : new Color(rand(a.r, b.r), rand(a.g, b.g), rand(a.b, b.b), rand(a.a, b.a));
};
var vec2 = function(a = 0, b) {
  return typeof a == "number" ? new Vector2(a, b == undefined ? a : b) : new Vector2(a.x, a.y);
};
var isVector2 = function(a) {
  return a instanceof Vector2;
};
var rgb = function(a, b, c, d) {
  return new Color(a, b, c, d);
};
var hsl = function(a, b, c, d) {
  return new Color().setHSLA(a, b, c, d);
};
var isColor = function(a) {
  return a instanceof Color;
};
var setCameraPos = function(a) {
  cameraPos = a;
};
var setCameraScale = function(a) {
  cameraScale = a;
};
var setEnablePhysicsSolver = function(a) {
  enablePhysicsSolver = a;
};
var setGamepadsEnable = function(a) {
  gamepadsEnable = a;
};
var screenToWorld = function(a) {
  return new Vector2((a.x - mainCanvasSize.x / 2 + 0.5) / cameraScale + cameraPos.x, (a.y - mainCanvasSize.y / 2 + 0.5) / -cameraScale + cameraPos.y);
};
var worldToScreen = function(a) {
  return new Vector2((a.x - cameraPos.x) * cameraScale + mainCanvasSize.x / 2 - 0.5, (a.y - cameraPos.y) * -cameraScale + mainCanvasSize.y / 2 - 0.5);
};
var drawTile = function(a, b = vec2(1), c, d = new Color, e = 0, f, g = new Color(0, 0, 0, 0), k = glEnable, h, m) {
  ASSERT(!m || !k, "context only supported in canvas 2D mode");
  ASSERT(typeof c !== "number" || !c, "this is an old style calls, to fix replace it with tile(tileIndex, tileSize)");
  const n = c && c.getTextureInfo();
  if (k)
    if (h && (a = screenToWorld(a), b = b.scale(1 / cameraScale)), n) {
      var l = vec2(1).divide(n.size);
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
    showWatermark && ++drawCount, b = vec2(b.x, -b.y), drawCanvas2D(a, b, e, f, (p) => {
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
  b = vec2((b.x - a.x) / 2, (b.y - a.y) / 2);
  c = vec2(c, 2 * b.length());
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
  ASSERT(0 < b || typeof a !== "number" || 3 > a, "use code string for keyboard");
  return inputData[b] && !!(inputData[b][a] & 1);
};
var keyWasPressed = function(a, b = 0) {
  ASSERT(0 < b || typeof a !== "number" || 3 > a, "use code string for keyboard");
  return inputData[b] && !!(inputData[b][a] & 2);
};
var keyWasReleased = function(a, b = 0) {
  ASSERT(0 < b || typeof a !== "number" || 3 > a, "use code string for keyboard");
  return inputData[b] && !!(inputData[b][a] & 4);
};
var clearInput = function() {
  inputData = [[]];
  touchGamepadButtons = [];
};
var gamepadIsDown = function(a, b = 0) {
  return keyIsDown(a, b + 1);
};
var inputUpdate = function() {
  headlessMode || (touchInputEnable && isTouchDevice || document.hasFocus() || clearInput(), mousePos = screenToWorld(mousePosScreen), gamepadsUpdate());
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
    soundEnable && !headlessMode && audioContext && audioContext.state != "running" && audioContext.resume();
    isUsingGamepad = false;
    inputData[0][b.button] = 3;
    mousePosScreen = mouseToScreen(b);
    b.button && b.preventDefault();
  }, onmouseup = (b) => inputData[0][b.button] = inputData[0][b.button] & 2 | 4, onmousemove = (b) => mousePosScreen = mouseToScreen(b), onwheel = (b) => mouseWheel = b.ctrlKey ? 0 : sign(b.deltaY), oncontextmenu = (b) => false, onblur = (b) => clearInput(), isTouchDevice && touchInputEnable && touchInputInit());
};
var mouseToScreen = function(a) {
  if (!mainCanvas || headlessMode)
    return vec2();
  const b = mainCanvas.getBoundingClientRect();
  return vec2(mainCanvas.width, mainCanvas.height).multiply(vec2(percent(a.x, b.left, b.right), percent(a.y, b.top, b.bottom)));
};
var gamepadsUpdate = function() {
  const a = (g) => {
    const k = (h) => 0.3 < h ? percent(h, 0.3, 0.8) : -0.3 > h ? -percent(-h, 0.3, 0.8) : 0;
    return vec2(k(g.x), k(-g.y)).clampLength();
  };
  if (touchGamepadEnable && isTouchDevice && (ASSERT(touchGamepadButtons, "set touchGamepadEnable before calling init!"), touchGamepadTimer.isSet())) {
    var b = gamepadStickData[0] || (gamepadStickData[0] = []);
    b[0] = vec2();
    touchGamepadAnalog ? b[0] = a(touchGamepadStick) : 0.3 < touchGamepadStick.lengthSquared() && (b[0].x = Math.round(touchGamepadStick.x), b[0].y = -Math.round(touchGamepadStick.y), b[0] = b[0].clampLength());
    b = inputData[1] || (inputData[1] = []);
    for (var c = 10;c--; ) {
      var d = c == 3 ? 2 : c == 2 ? 3 : c, e = gamepadIsDown(d, 0);
      b[d] = touchGamepadButtons[c] ? e ? 1 : 3 : e ? 4 : 0;
    }
  }
  if (gamepadsEnable && navigator && navigator.getGamepads && (debug || document.hasFocus()))
    for (b = navigator.getGamepads(), c = b.length;c--; ) {
      e = b[c];
      const g = inputData[c + 1] || (inputData[c + 1] = []);
      d = gamepadStickData[c] || (gamepadStickData[c] = []);
      if (e) {
        for (var f = 0;f < e.axes.length - 1; f += 2)
          d[f >> 1] = a(vec2(e.axes[f], e.axes[f + 1]));
        for (f = e.buttons.length;f--; ) {
          const k = e.buttons[f], h = gamepadIsDown(f, c);
          g[f] = k.pressed ? h ? 1 : 3 : h ? 4 : 0;
          isUsingGamepad ||= !c && k.pressed;
        }
        gamepadDirectionEmulateStick && (e = vec2((gamepadIsDown(15, c) && 1) - (gamepadIsDown(14, c) && 1), (gamepadIsDown(12, c) && 1) - (gamepadIsDown(13, c) && 1)), e.lengthSquared() && (d[0] = e.clampLength()));
        touchGamepadEnable && isUsingGamepad && touchGamepadTimer.unset();
      }
    }
};
var touchInputInit = function() {
  function a(e) {
    soundEnable && !headlessMode && audioContext && audioContext.state != "running" && audioContext.resume();
    const f = e.touches.length;
    if (f) {
      const g = vec2(e.touches[0].clientX, e.touches[0].clientY);
      mousePosScreen = mouseToScreen(g);
      d ? isUsingGamepad = touchGamepadEnable : inputData[0][0] = 3;
    } else
      d && (inputData[0][0] = inputData[0][0] & 2 | 4);
    d = f;
    document.hasFocus() && e.preventDefault();
    return true;
  }
  function b(e) {
    touchGamepadStick = vec2();
    touchGamepadButtons = [];
    isUsingGamepad = true;
    if (e.touches.length && (touchGamepadTimer.set(), paused && !d)) {
      touchGamepadButtons[9] = 1;
      a(e);
      return;
    }
    const f = vec2(touchGamepadSize, mainCanvasSize.y - touchGamepadSize), g = mainCanvasSize.subtract(vec2(touchGamepadSize, touchGamepadSize)), k = mainCanvasSize.scale(0.5);
    for (const m of e.touches) {
      var h = mouseToScreen(vec2(m.clientX, m.clientY));
      h.distance(f) < touchGamepadSize ? touchGamepadStick = h.subtract(f).scale(2 / touchGamepadSize).clampLength() : h.distance(g) < touchGamepadSize ? (h = h.subtract(g).direction(), touchGamepadButtons[h] = 1) : h.distance(k) < touchGamepadSize && !d && (touchGamepadButtons[9] = 1);
    }
    a(e);
    return true;
  }
  let c = a;
  touchGamepadEnable && (c = b, touchGamepadButtons = [], touchGamepadStick = vec2());
  document.addEventListener("touchstart", (e) => c(e), { passive: false });
  document.addEventListener("touchmove", (e) => c(e), { passive: false });
  document.addEventListener("touchend", (e) => c(e), { passive: false });
  onmousedown = onmouseup = () => 0;
  let d;
};
var touchGamepadRender = function() {
  if (touchInputEnable && isTouchDevice && !headlessMode && touchGamepadEnable && touchGamepadTimer.isSet()) {
    var a = percent(touchGamepadTimer.get(), 4, 3);
    if (a && !paused) {
      var b = overlayContext;
      b.save();
      b.globalAlpha = a * touchGamepadAlpha;
      b.strokeStyle = "#fff";
      b.lineWidth = 3;
      b.fillStyle = 0 < touchGamepadStick.lengthSquared() ? "#fff" : "#000";
      b.beginPath();
      a = vec2(touchGamepadSize, mainCanvasSize.y - touchGamepadSize);
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
      a = vec2(mainCanvasSize.x - touchGamepadSize, mainCanvasSize.y - touchGamepadSize);
      for (c = 4;c--; )
        d = a.add(vec2().setDirection(c, touchGamepadSize / 2)), b.fillStyle = touchGamepadButtons[c] ? "#fff" : "#000", b.beginPath(), b.arc(d.x, d.y, touchGamepadSize / 4, 0, 9), b.fill(), b.stroke();
      b.restore();
    }
  }
};
var audioInit = function() {
  soundEnable && !headlessMode && (audioGainNode = audioContext.createGain(), audioGainNode.connect(audioContext.destination), audioGainNode.gain.value = soundVolume);
};
var tileCollisionTest = function(a, b = vec2(), c) {
  const d = max(a.x - b.x / 2 | 0, 0);
  var e = max(a.y - b.y / 2 | 0, 0);
  const f = min(a.x + b.x / 2, tileCollisionSize.x);
  for (a = min(a.y + b.y / 2, tileCollisionSize.y);e < a; ++e)
    for (b = d;b < f; ++b) {
      const g = tileCollision[e * tileCollisionSize.x + b];
      if (g && (!c || c.collideWithTile(g, vec2(b, e))))
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
    a = new ArrayBuffer(gl_INSTANCE_BUFFER_SIZE);
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
      const k = f && gl_INSTANCE_BYTE_STRIDE, h = f && 1, m = f == 1;
      glContext.enableVertexAttribArray(d);
      glContext.vertexAttribPointer(d, g, e, m, k, a);
      glContext.vertexAttribDivisor(d, h);
      a += g * f;
    };
    glContext.bindBuffer(gl_ARRAY_BUFFER, glGeometryBuffer);
    b("g", gl_FLOAT, 0, 2);
    glContext.bindBuffer(gl_ARRAY_BUFFER, glArrayBuffer);
    glContext.bufferData(gl_ARRAY_BUFFER, gl_INSTANCE_BUFFER_SIZE, gl_DYNAMIC_DRAW);
    b("p", gl_FLOAT, 4, 4);
    b("u", gl_FLOAT, 4, 4);
    b("c", gl_UNSIGNED_BYTE, 1, 4);
    b("a", gl_UNSIGNED_BYTE, 1, 4);
    b("r", gl_FLOAT, 4, 1);
    b = vec2(2 * cameraScale).divide(mainCanvasSize);
    var c = vec2(-1).subtract(cameraPos.multiply(b));
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
  if (debug && !glContext.getShaderParameter(b, gl_COMPILE_STATUS))
    throw glContext.getShaderInfoLog(b);
  return b;
};
var glCreateProgram = function(a, b) {
  const c = glContext.createProgram();
  glContext.attachShader(c, glCompileShader(a, gl_VERTEX_SHADER));
  glContext.attachShader(c, glCompileShader(b, gl_FRAGMENT_SHADER));
  glContext.linkProgram(c);
  if (debug && !glContext.getProgramParameter(c, gl_LINK_STATUS))
    throw glContext.getProgramInfoLog(c);
  return c;
};
var glCreateTexture = function(a) {
  const b = glContext.createTexture();
  glContext.bindTexture(gl_TEXTURE_2D, b);
  a && a.width ? glContext.texImage2D(gl_TEXTURE_2D, 0, gl_RGBA, gl_RGBA, gl_UNSIGNED_BYTE, a) : (a = new Uint8Array([255, 255, 255, 255]), glContext.texImage2D(gl_TEXTURE_2D, 0, gl_RGBA, 1, 1, 0, gl_RGBA, gl_UNSIGNED_BYTE, a));
  a = canvasPixelated ? gl_NEAREST : gl_LINEAR;
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
  ASSERT(typeof m == "number" && typeof n == "number", "invalid color");
  (glInstanceCount >= gl_MAX_INSTANCES || glBatchAdditive != glAdditive) && glFlush();
  let l = glInstanceCount * gl_INDICIES_PER_INSTANCE;
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
    if (debug || showWatermark)
      averageFPS = lerp(0.05, averageFPS, 1000 / (l || 1));
    n = debug && keyIsDown("Equal");
    const p = debug && keyIsDown("Minus");
    debug && (l *= n ? 5 : p ? 0.2 : 1);
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
      for (;0 <= frameTimeBufferMS; frameTimeBufferMS -= 1000 / frameRate)
        time = frame++ / frameRate, inputUpdate(), b(), pluginUpdateList.forEach((r) => r()), engineObjectsUpdate(), debugUpdate(), c(), inputUpdatePost();
      frameTimeBufferMS += l;
    }
    if (!headlessMode) {
      mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);
      mainContext.imageSmoothingEnabled = !canvasPixelated;
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
      if (canvasFixedSize.x) {
        mainCanvas.width = canvasFixedSize.x;
        mainCanvas.height = canvasFixedSize.y;
        const n = innerWidth / innerHeight, l = mainCanvas.width / mainCanvas.height;
        (glCanvas || mainCanvas).style.width = mainCanvas.style.width = overlayCanvas.style.width = n < l ? "100%" : "";
        (glCanvas || mainCanvas).style.height = mainCanvas.style.height = overlayCanvas.style.height = n < l ? "" : "100%";
      } else
        mainCanvas.width = min(innerWidth, canvasMaxSize.x), mainCanvas.height = min(innerHeight, canvasMaxSize.y);
      overlayCanvas.width = mainCanvas.width;
      overlayCanvas.height = mainCanvas.height;
      mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);
    }
  }
  function m() {
    new Promise((n) => n(a())).then(k);
  }
  ASSERT(Array.isArray(f), "pass in images as array");
  headlessMode ? m() : (g.style.cssText = "margin:0;overflow:hidden;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:#000;user-select:none;-webkit-user-select:none;" + (touchInputEnable ? "touch-action:none;-webkit-touch-callout:none" : ""), g.appendChild(mainCanvas = document.createElement("canvas")), mainContext = mainCanvas.getContext("2d"), inputInit(), audioInit(), debugInit(), glInit(), g.appendChild(overlayCanvas = document.createElement("canvas")), overlayContext = overlayCanvas.getContext("2d"), mainCanvas.style.cssText = overlayCanvas.style.cssText = "position:absolute", glCanvas && (glCanvas.style.cssText = "position:absolute"), h(), g = f.map((n, l) => new Promise((p) => {
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
  var c = overlayCanvas.width = innerWidth, d = overlayCanvas.height = innerHeight, e = percent(a, 1, 0.8), f = percent(a, 0, 0.5), g = b.createRadialGradient(c / 2, d / 2, 0, c / 2, d / 2, 0.7 * Math.hypot(c, d));
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
  const k = percent(a, 0.1, 0.5);
  b.translate(c / 2, d / 2);
  c = min(6, min(c, d) / 99);
  b.scale(c, c);
  b.translate(-40, -35);
  b.lineJoin = b.lineCap = "round";
  b.lineWidth = 0.1 + 1.9 * k;
  c = percent(a, 0.1, 1);
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
var debug = 0;
var debugOverlay = 0;
var debugPhysics = 0;
var PI = Math.PI;
class Vector2 {
  constructor(a = 0, b = 0) {
    this.x = a;
    this.y = b;
    ASSERT(this.isValid());
  }
  set(a = 0, b = 0) {
    this.x = a;
    this.y = b;
    ASSERT(this.isValid());
    return this;
  }
  copy() {
    return new Vector2(this.x, this.y);
  }
  add(a) {
    ASSERT(isVector2(a));
    return new Vector2(this.x + a.x, this.y + a.y);
  }
  subtract(a) {
    ASSERT(isVector2(a));
    return new Vector2(this.x - a.x, this.y - a.y);
  }
  multiply(a) {
    ASSERT(isVector2(a));
    return new Vector2(this.x * a.x, this.y * a.y);
  }
  divide(a) {
    ASSERT(isVector2(a));
    return new Vector2(this.x / a.x, this.y / a.y);
  }
  scale(a) {
    ASSERT(!isVector2(a));
    return new Vector2(this.x * a, this.y * a);
  }
  length() {
    return this.lengthSquared() ** 0.5;
  }
  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }
  distance(a) {
    ASSERT(isVector2(a));
    return this.distanceSquared(a) ** 0.5;
  }
  distanceSquared(a) {
    ASSERT(isVector2(a));
    return (this.x - a.x) ** 2 + (this.y - a.y) ** 2;
  }
  normalize(a = 1) {
    const b = this.length();
    return b ? this.scale(a / b) : new Vector2(0, a);
  }
  clampLength(a = 1) {
    const b = this.length();
    return b > a ? this.scale(a / b) : this;
  }
  dot(a) {
    ASSERT(isVector2(a));
    return this.x * a.x + this.y * a.y;
  }
  cross(a) {
    ASSERT(isVector2(a));
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
    return new Vector2(this.x * b - this.y * a, this.x * a + this.y * b);
  }
  setDirection(a, b = 1) {
    a = mod(a, 4);
    ASSERT(a == 0 || a == 1 || a == 2 || a == 3);
    return vec2(a % 2 ? a - 1 ? -b : b : 0, a % 2 ? 0 : a ? -b : b);
  }
  direction() {
    return abs(this.x) > abs(this.y) ? 0 > this.x ? 3 : 1 : 0 > this.y ? 2 : 0;
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
  lerp(a, b) {
    ASSERT(isVector2(a));
    return this.add(a.subtract(this).scale(clamp(b)));
  }
  arrayCheck(a) {
    ASSERT(isVector2(a));
    return 0 <= this.x && 0 <= this.y && this.x < a.x && this.y < a.y;
  }
  toString(a = 3) {
    if (debug)
      return `(${(0 > this.x ? "" : " ") + this.x.toFixed(a)},${(0 > this.y ? "" : " ") + this.y.toFixed(a)} )`;
  }
  isValid() {
    return typeof this.x == "number" && !isNaN(this.x) && typeof this.y == "number" && !isNaN(this.y);
  }
}

class Color {
  constructor(a = 1, b = 1, c = 1, d = 1) {
    this.r = a;
    this.g = b;
    this.b = c;
    this.a = d;
    ASSERT(this.isValid());
  }
  set(a = 1, b = 1, c = 1, d = 1) {
    this.r = a;
    this.g = b;
    this.b = c;
    this.a = d;
    ASSERT(this.isValid());
    return this;
  }
  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }
  add(a) {
    ASSERT(isColor(a));
    return new Color(this.r + a.r, this.g + a.g, this.b + a.b, this.a + a.a);
  }
  subtract(a) {
    ASSERT(isColor(a));
    return new Color(this.r - a.r, this.g - a.g, this.b - a.b, this.a - a.a);
  }
  multiply(a) {
    ASSERT(isColor(a));
    return new Color(this.r * a.r, this.g * a.g, this.b * a.b, this.a * a.a);
  }
  divide(a) {
    ASSERT(isColor(a));
    return new Color(this.r / a.r, this.g / a.g, this.b / a.b, this.a / a.a);
  }
  scale(a, b = a) {
    return new Color(this.r * a, this.g * a, this.b * a, this.a * b);
  }
  clamp() {
    return new Color(clamp(this.r), clamp(this.g), clamp(this.b), clamp(this.a));
  }
  lerp(a, b) {
    ASSERT(isColor(a));
    return this.add(a.subtract(this).scale(clamp(b)));
  }
  setHSLA(a = 0, b = 0, c = 1, d = 1) {
    a = mod(a, 1);
    b = clamp(b);
    c = clamp(c);
    b = 0.5 > c ? c * (1 + b) : c + b - c * b;
    c = 2 * c - b;
    const e = (f, g, k) => 1 > 6 * (k = mod(k, 1)) ? f + 6 * (g - f) * k : 1 > 2 * k ? g : 2 > 3 * k ? f + (g - f) * (4 - 6 * k) : f;
    this.r = e(c, b, a + 1 / 3);
    this.g = e(c, b, a);
    this.b = e(c, b, a - 1 / 3);
    this.a = d;
    ASSERT(this.isValid());
    return this;
  }
  HSLA() {
    const a = clamp(this.r), b = clamp(this.g), c = clamp(this.b), d = clamp(this.a), e = Math.max(a, b, c), f = Math.min(a, b, c), g = (e + f) / 2;
    let k = 0, h = 0;
    if (e != f) {
      let m = e - f;
      h = 0.5 < g ? m / (2 - e - f) : m / (e + f);
      a == e ? k = (b - c) / m + (b < c ? 6 : 0) : b == e ? k = (c - a) / m + 2 : c == e && (k = (a - b) / m + 4);
    }
    return [k / 6, h, g, d];
  }
  mutate(a = 0.05, b = 0) {
    return new Color(this.r + rand(a, -a), this.g + rand(a, -a), this.b + rand(a, -a), this.a + rand(b, -b)).clamp();
  }
  toString(a = true) {
    const b = (c) => (16 > (c = 255 * clamp(c) | 0) ? "0" : "") + c.toString(16);
    return "#" + b(this.r) + b(this.g) + b(this.b) + (a ? b(this.a) : "");
  }
  setHex(a) {
    ASSERT(typeof a == "string" && a[0] == "#");
    ASSERT([4, 5, 7, 9].includes(a.length), "Invalid hex");
    6 > a.length ? (this.r = clamp(parseInt(a[1], 16) / 15), this.g = clamp(parseInt(a[2], 16) / 15), this.b = clamp(parseInt(a[3], 16) / 15), this.a = a.length == 5 ? clamp(parseInt(a[4], 16) / 15) : 1) : (this.r = clamp(parseInt(a.slice(1, 3), 16) / 255), this.g = clamp(parseInt(a.slice(3, 5), 16) / 255), this.b = clamp(parseInt(a.slice(5, 7), 16) / 255), this.a = a.length == 9 ? clamp(parseInt(a.slice(7, 9), 16) / 255) : 1);
    ASSERT(this.isValid());
    return this;
  }
  rgbaInt() {
    const a = 255 * clamp(this.r) | 0, b = 255 * clamp(this.g) << 8, c = 255 * clamp(this.b) << 16, d = 255 * clamp(this.a) << 24;
    return a + b + c + d;
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
  constructor(a) {
    this.time = a == undefined ? undefined : time + a;
    this.setTime = a;
  }
  set(a = 0) {
    this.time = time + a;
    this.setTime = a;
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
    if (debug)
      return this.isSet() ? Math.abs(this.get()) + " seconds " + (0 > this.get() ? "before" : "after") : "unset";
  }
  valueOf() {
    return this.get();
  }
}
var cameraPos = vec2();
var cameraScale = 32;
var canvasMaxSize = vec2(1920, 1080);
var canvasFixedSize = vec2();
var canvasPixelated = true;
var showSplashScreen = false;
var headlessMode = false;
var glEnable = true;
var glOverlay = true;
var tileSizeDefault = vec2(16);
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
var medalDisplaySize = vec2(640, 80);
class EngineObject {
  constructor(a = vec2(), b = vec2(1), c, d = 0, e = new Color, f = 0) {
    ASSERT(isVector2(a) && isVector2(b), "ensure pos and size are vec2s");
    ASSERT(typeof c !== "number" || !c, "old style tile setup");
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
    this.velocity = vec2();
    this.angleVelocity = 0;
    this.spawnTime = time;
    this.children = [];
    this.clampSpeedLinear = true;
    this.parent = undefined;
    this.localPos = vec2();
    this.localAngle = 0;
    this.collideRaycast = this.isSolid = this.collideSolidObjects = this.collideTiles = false;
    engineObjects.push(this);
  }
  updateTransforms() {
    const a = this.parent;
    if (a) {
      const b = a.getMirrorSign();
      this.pos = this.localPos.multiply(vec2(b, 1)).rotate(-a.angle).add(a.pos);
      this.angle = b * this.localAngle + a.angle;
    }
    for (const b of this.children)
      b.updateTransforms();
  }
  update() {
    if (!this.parent) {
      if (this.clampSpeedLinear)
        this.velocity.x = clamp(this.velocity.x, -objectMaxSpeed, objectMaxSpeed), this.velocity.y = clamp(this.velocity.y, -objectMaxSpeed, objectMaxSpeed);
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
      ASSERT(0 <= this.angleDamping && 1 >= this.angleDamping);
      ASSERT(0 <= this.damping && 1 >= this.damping);
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
            const k = 2 * abs(a.y - d.pos.y) < e.y;
            var g = 2 * abs(a.x - d.pos.x) < e.x;
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
          d = tileCollisionTest(vec2(a.x, this.pos.y), this.size, this);
          c = tileCollisionTest(vec2(this.pos.x, a.y), this.size, this);
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
    return time - this.spawnTime;
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
  addChild(a, b = vec2(), c = 0) {
    ASSERT(!a.parent && !this.children.includes(a));
    this.children.push(a);
    a.parent = this;
    a.localPos = b.copy();
    a.localAngle = c;
  }
  removeChild(a) {
    ASSERT(a.parent == this && this.children.includes(a));
    this.children.splice(this.children.indexOf(a), 1);
    a.parent = 0;
  }
  setCollision(a = true, b = true, c = true, d = true) {
    ASSERT(a || !b, "solid objects must be set to collide");
    this.collideSolidObjects = a;
    this.isSolid = b;
    this.collideTiles = c;
    this.collideRaycast = d;
  }
  toString() {
    if (debug) {
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
    if (debug) {
      const a = vec2(max(this.size.x, 0.2), max(this.size.y, 0.2)), b = rgb(this.collideTiles ? 1 : 0, this.collideSolidObjects ? 1 : 0, this.isSolid ? 1 : 0, this.parent ? 0.2 : 0.5), c = this.parent ? rgb(1, 1, 1, 0.5) : rgb(0, 0, 0, 0.8);
      drawRect(this.pos, a, b, this.angle, false);
      drawRect(this.pos, a.scale(0.8), c, this.angle, false);
      this.parent && drawLine(this.pos, this.parent.pos, 0.1, rgb(0, 0, 1, 0.5), false);
    }
  }
}
var mainCanvas;
var mainContext;
var overlayCanvas;
var overlayContext;
var mainCanvasSize = vec2();
var textureInfos = [];
var drawCount;

class TileInfo {
  constructor(a = vec2(), b = tileSizeDefault, c = 0, d = 0) {
    this.pos = a.copy();
    this.size = b.copy();
    this.textureIndex = c;
    this.padding = d;
  }
  offset(a) {
    return new TileInfo(this.pos.add(a), this.size, this.textureIndex);
  }
  frame(a) {
    ASSERT(typeof a == "number");
    return this.offset(vec2(a * (this.size.x + 2 * this.padding), 0));
  }
  getTextureInfo() {
    return textureInfos[this.textureIndex];
  }
}

class TextureInfo {
  constructor(a) {
    this.image = a;
    this.size = vec2(a.width, a.height);
    this.glTexture = glEnable && glCreateTexture(a);
  }
}
var mouseWasPressed = keyWasPressed;
var mouseWasReleased = keyWasReleased;
var mousePos = vec2();
var mousePosScreen = vec2();
var mouseWheel = 0;
var isUsingGamepad = false;
var preventDefaultInput = false;
var inputData = [[]];
var gamepadStickData = [];
var isTouchDevice = window.ontouchstart !== undefined;
var touchGamepadTimer = new Timer;
var touchGamepadButtons;
var touchGamepadStick;
var audioContext = new AudioContext;
var audioGainNode;
var tileCollision = [];
var tileCollisionSize = vec2();
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
var gl_INDICIES_PER_INSTANCE = 11;
var gl_MAX_INSTANCES = 1e4;
var gl_INSTANCE_BYTE_STRIDE = 4 * gl_INDICIES_PER_INSTANCE;
var gl_INSTANCE_BUFFER_SIZE = gl_MAX_INSTANCES * gl_INSTANCE_BYTE_STRIDE;
var engineName = "LittleJS";
var engineVersion = "1.10.7";
var frameRate = 60;
var timeDelta = 1 / frameRate;
var engineObjects = [];
var engineObjectsCollide = [];
var frame = 0;
var time = 0;
var timeReal = 0;
var paused = false;
var frameTimeLastMS = 0;
var frameTimeBufferMS = 0;
var averageFPS = 0;
var pluginUpdateList = [];
var pluginRenderList = [];
// src/lib/littlejs.ts
setEnablePhysicsSolver(false);
setGamepadsEnable(false);

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
        const size = vec2(animation.spriteSize?.[0] ?? 0, animation.spriteSize?.[1] ?? 0);
        animation.frames?.forEach((frame2) => {
          const mul = animation.mul ?? 1;
          for (let i = 0;i < mul; i++) {
            animInfo.tileInfos.push(new TileInfo(undefined, size, this.imageSources.indexOf(imgSource), 2).frame(frame2));
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

// src/game-object.ts
class GameObject extends EngineObject {
  manager;
  gridShift;
  animationInfo;
  hoveredAnimationInfo;
  selectedAnimationInfo;
  moveAnimationInfo;
  harvestAnimationInfo;
  shadowAnimationInfo;
  frameRate = 60;
  mouseFollower;
  px = 0;
  py = 0;
  positionDetached;
  type;
  onHoverHideCursor;
  visible = true;
  elem;
  hovered = false;
  decors = [];
  shadow;
  labels = [];
  updated = false;
  moveOptions;
  clearedCloud;
  lastDx = 1;
  bornTime = Date.now();
  moveQueue;
  resources = [];
  floatResources;
  resourceBars = [];
  moving;
  constructor(manager, gridShift = vec2(0, 0)) {
    super();
    this.manager = manager;
    this.gridShift = gridShift;
  }
  getColor(color) {
    if (color === "random") {
      return randColor();
    } else {
      return new Color().setHex(color);
    }
  }
  refresh(elem) {
    if (!this.elem) {
      const definition = this.manager.scene.definitions.find((def) => def.name === elem.definition);
      if (definition) {
        this.elem = JSON.parse(JSON.stringify(definition));
      } else {
        this.elem = elem;
      }
    }
    elem = this.elem;
    const config = elem.gameObject;
    if (config) {
      this.type = elem.type;
      this.visible = !config.hidden;
      if (this.type === "cursor") {
        this.manager.cursor = this;
      }
      if (!this.positionDetached) {
        const px = this.gridShift.x + (config.pos?.[0] ?? 0);
        const py = this.gridShift.y + (config.pos?.[1] ?? 0);
        this.setPosition(px, py, true);
        const offset = this.elem?.gameObject?.offset ?? [0, 0];
        this.pos.set(px + offset[0], py + offset[1]);
        this.updateSize();
        this.size.set(this.visible ? config.size?.[0] : 0, this.visible ? config.size?.[1] : 0);
        if (config.rotation) {
          this.angle = config.rotation;
        }
      }
      if (config.color) {
        this.color = this.getColor(config.color);
      }
      if (elem.animation) {
        this.animationInfo = this.manager.animation.getInfo(elem.animation.name);
      }
      if (elem.onHover) {
        if (elem.onHover.animation) {
          this.hoveredAnimationInfo = this.manager.animation.getInfo(elem.onHover.animation);
        }
        this.onHoverHideCursor = elem.onHover.hideCursor;
      }
      if (elem.selected) {
        if (elem.selected.animation) {
          this.selectedAnimationInfo = this.manager.animation.getInfo(elem.selected.animation);
        }
      }
      if (elem.move) {
        if (elem.move.animation) {
          this.moveAnimationInfo = this.manager.animation.getInfo(elem.move.animation);
        }
      }
      if (elem.harvest) {
        if (elem.harvest.animation) {
          this.harvestAnimationInfo = this.manager.animation.getInfo(elem.harvest.animation);
        }
      }
      if (elem.shadow) {
        if (elem.shadow.animation) {
          this.shadowAnimationInfo = this.manager.animation.getInfo(elem.shadow.animation);
          if (!this.shadow) {
            this.shadow = new EngineObject;
            this.shadow.size.set(this.size.x, this.size.y);
            this.shadow.tileInfo = this.getTileInfoAnimate(this.shadowAnimationInfo);
            this.addChild(this.shadow);
          }
        }
      }
      if (elem.mouseFollower) {
        this.mouseFollower = {
          offset: vec2(elem.mouseFollower.offset?.[0] ?? 0, elem.mouseFollower.offset?.[1] ?? 0),
          snap: elem.mouseFollower.snap
        };
      }
      if (elem.spread) {
        const { animation, count, radius, color, size } = elem.spread;
        const animInfo = this.manager.animation.getInfo(animation);
        const actualCount = count[0] + Math.floor(Math.random() * (count[1] - count[0]));
        for (let i = 0;i < actualCount; i++) {
          const x = (Math.random() - 0.5) * (size ?? 1);
          const y = (Math.random() - 0.5) * (size ?? 1);
          if (radius && x * x + y * y > radius * radius) {
            continue;
          }
          const decor = new EngineObject;
          decor.tileInfo = this.getTileInfoAnimate(animInfo);
          this.addChild(decor, vec2(x, y));
          if (color) {
            decor.color = this.getColor(color);
          }
          this.decors.push(decor);
        }
        if (elem.branchOut) {
          const shouldBrachOut = Math.random() <= (elem.branchOut.chance ?? 1);
          const { count: count2, element } = elem.branchOut;
          const actualCount2 = !shouldBrachOut ? 1 : count2[0] + Math.floor(Math.random() * (count2[1] - count2[0]));
          let pos = vec2(this.pos.x, this.pos.y);
          const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
          let lastDir;
          let prePos = pos.copy();
          for (let i = 0;i < actualCount2; i++) {
            const oppositeDirIndex = lastDir ? (directions.indexOf(lastDir) + 2) % 4 : undefined;
            const filteredDirections = directions.filter((_dir, index) => index !== oppositeDirIndex);
            const dir = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
            pos.set(pos.x + dir[0], pos.y + dir[1]);
            const rot = Math.atan2(pos.y - prePos.y, -(pos.x - prePos.x));
            this.manager.scene.elems.push(element);
            if (!element.gameObject) {
              element.gameObject = {};
            }
            if (!element.gameObject.noRotation) {
              element.gameObject.rotation = rot;
            }
            element.gameObject.pos = [pos.x, pos.y];
            prePos.set(pos.x, pos.y);
            lastDir = dir;
          }
        }
      }
      if (elem.selfSelect) {
        elem.selfSelect = false;
        setTimeout(() => {
          this.manager.setSelection(this);
        }, 300);
      }
      this.refreshLabel();
      this.refreshBars();
      this.refreshAlpha();
    } else {
      if (this.manager.grid[this.getTag()] === this) {
        delete this.manager.grid[this.getTag()];
      }
      if (this.manager.selected === this) {
        this.manager.setSelection(undefined);
      }
      this.destroy();
    }
  }
  hideBars() {
    this.resourceBars.forEach((bar) => bar.destroy());
    this.resourceBars.length = 0;
  }
  refreshBars() {
    this.hideBars();
    if (!this.elem?.resourcesAccumulated) {
      return;
    }
    const [offX, offY] = this.elem?.gameObject?.offset ?? [0, 0];
    let count = 0;
    Object.entries(this.elem.resourcesAccumulated).forEach(([key, value]) => {
      if (this.manager.scene.resources[key]?.global) {
        return;
      }
      if (!value) {
        return;
      }
      const backBar = new EngineObject(vec2(0, 0), vec2(1, 0.3));
      backBar.color = new Color(0, 0, 0, 0.3);
      this.addChild(backBar, vec2(0 - offX, count * 0.3 - offY - 0.3));
      this.resourceBars.push(backBar);
      const numValuesToShow = Math.min(10, value);
      const spacing = Math.min(0.2, 1 / numValuesToShow);
      for (let j = 0;j < numValuesToShow; j++) {
        const barIcon = new EngineObject(vec2(0, 0), vec2(0.5, 0.5));
        barIcon.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(key));
        this.addChild(barIcon, vec2(-0.4 + j * spacing - offX + Math.floor(j / 5) * 0.1 - Math.floor((numValuesToShow - 1) / 5) * 0.05, count * 0.3 - offY - 0.3));
        this.resourceBars.push(barIcon);
      }
      if (value > 10) {
        const color = new Color(1, 1, 1, 1);
        const digits = this.generateEngineObjectsForDigit(value, 0.4, 0.16, vec2(0.5 - offX, count * 0.3 - offY - 0.3), color);
        this.resourceBars.push(...digits);
      }
      count++;
    });
    this.updated = false;
  }
  refreshLabel() {
    this.labels.forEach((label) => label.destroy());
    this.labels.length = 0;
    if (this.elem?.harvesting && !this.elem?.level) {
      return;
    }
    let numToShow = this.elem?.level ?? this.elem?.hitpoints;
    if (!numToShow) {
      return;
    }
    const size = this.elem?.level ? 0.5 : 0.3;
    const offset = this.elem?.level ? vec2(0, 0.25) : vec2(-0.5, 0.2);
    const charSize = this.elem?.level ? 0.2 : 0.15;
    const color = this.elem?.hitpoints ? this.elem.hitpoints < (this.elem.maxHitPoints ?? 0) ? new Color(1, 1, 0, 1) : new Color(0, 1, 0, 1) : this.canAffordMoreHarvester() ? new Color(1, 0.7, 0.7, 1) : new Color(1, 1, 1, 1);
    if (!this.labels) {
      this.labels = [];
    }
    const digits = this.generateEngineObjectsForDigit(numToShow, size, charSize, offset, color);
    this.labels.push(...digits);
    this.labels.forEach((label) => label.renderOrder = this.renderOrder + 0.2);
  }
  canAffordMoreHarvester() {
    return this.findNearby((obj) => !!obj?.elem?.harvesting).size < (this.elem?.level ?? 0);
  }
  generateDigits(num) {
    const digits = [];
    let l = Math.max(0, num);
    while (l > 0) {
      const d = l % 10;
      digits.push(d);
      l = Math.floor(l / 10);
    }
    return digits;
  }
  generateEngineObjectsForDigit(num, size, charSize, offset, color) {
    const digits = this.generateDigits(num);
    return digits.map((d, i) => {
      const digit = new EngineObject(vec2(0, 0), vec2(size, size));
      digit.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(`num_${d}`));
      digit.color = color;
      this.addChild(digit, offset.add(vec2(-i * charSize, 0)));
      return digit;
    });
  }
  hideResources() {
    this.resources.forEach((resource) => resource.destroy());
    this.resources.length = 0;
  }
  showResources(x, y, owner, floatResources = false) {
    const resources = this.manager.getResources(x, y);
    if (!resources) {
      return;
    }
    const rand2 = floatResources ? (Math.random() - 0.5) * 0.5 : 0;
    const resourceSpacing = 0.15;
    const offset = this.elem?.gameObject?.offset ?? [0, 0];
    const offX = x - this.px - offset[0] + rand2, offY = y - this.py - offset[1];
    const RESOURCES = ["wheat", "wood", "trade"];
    let total = 0;
    RESOURCES.forEach((resource) => {
      for (let i = 0;i < (resources[resource] ?? 0); i++) {
        total++;
      }
    });
    let count = 0;
    RESOURCES.forEach((resource) => {
      const value = resources[resource] ?? 0;
      if (!value) {
        return;
      }
      for (let i = 0;i < value; i++) {
        const indic = new EngineObject(vec2(0, 0), vec2(0.5, 0.5));
        indic.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(resource));
        indic.color = new Color(1, 1, 1, 1);
        this.addChild(indic, vec2(offX + (count - (total - 1) / 2) * resourceSpacing + rand2, offY));
        this.resources.push(indic);
        count++;
      }
    });
    let harvesting = floatResources;
    if (!floatResources) {
      this.manager.iterateGridCell(x, y, (elem) => {
        if (elem.elem?.owner === owner && elem.elem?.harvesting) {
          harvesting = true;
        }
      });
    }
    if (!floatResources) {
      const indic = new EngineObject(vec2(0, 0), vec2(count * resourceSpacing + 0.2, 0.3));
      indic.color = harvesting ? new Color(1, 0.5, 1, 0.8) : new Color(0.5, 0.5, 0.5, 0.8);
      this.addChild(indic, vec2(offX, offY));
      this.resources.push(indic);
    }
    this.updated = false;
    if (floatResources) {
      this.floatResources = Date.now();
    }
  }
  setHarvesting(value) {
    if (this.elem) {
      if (this.elem.harvesting !== value) {
        this.elem.harvesting = value;
        this.home?.refreshLabel();
        if (this.elem.harvesting) {
          this.spendActions();
        } else {
          this.manager.setSelection(this);
        }
      }
    }
  }
  getTag() {
    return GameObject.getTag(this.type, this.px, this.py);
  }
  static getTag(type, px, py) {
    return `${type}_${px}_${py}`;
  }
  updateSize() {
    const age = Date.now() - this.bornTime;
    const scale = Math.min(1, age / 200);
    const config = this.elem?.gameObject;
    this.size.set(scale * (this.visible ? config?.size?.[0] ?? 0 : 0) * (this.lastDx || 1), scale * (this.visible ? config?.size?.[1] ?? 0 : 0));
  }
  hasMove() {
    return this.elem?.turn?.moves;
  }
  hasAttack() {
    return this.elem?.turn?.attacks;
  }
  hasAction() {
    return this.elem?.turn?.actions;
  }
  canAttack() {
    return false;
  }
  spendAttack() {
    const elem = this.elem;
    if (elem && elem.turn?.attacks) {
      elem.turn.attacks--;
    }
  }
  spendMove() {
    if (this.elem?.endlessMove) {
      this.doneMoving();
      return;
    }
    const elem = this.elem;
    if (elem && elem.turn?.moves) {
      elem.turn.moves--;
      this.doneMoving();
    }
  }
  doneMoving() {
    this.refreshAlpha();
    this.manager.checkForAnyMove();
    if (!this.canAct() || this.elem?.harvesting) {
      this.manager.selectNext();
    } else if (this.manager.selected === this) {
      this.showResourcesNearby();
      this.showMoveOptions();
      this.manager.hud.showSelected(this);
    }
  }
  spendActions() {
    const elem = this.elem;
    if (elem && elem.turn?.actions) {
      elem.turn.actions--;
      this.doneMoving();
    }
  }
  canAct() {
    return this.hasMove() || this.hasAttack() && this.canAttack() || this.hasAction();
  }
  refreshAlpha() {
    if (this.elem?.turn && this.elem?.type === "unit") {
      if (!this.canAct()) {
        this.color = new Color(1, 1, 1, 0.5);
      } else {
        this.color = new Color(1, 1, 1, 1);
      }
    }
  }
  giveTurn() {
    const elem = this.elem;
    if (elem?.turn) {
      elem.turn.moves = elem.turn.attacks = 1;
      if (elem.worker) {
        elem.turn.actions = 1;
      }
      this.refreshAlpha();
    }
  }
  moveTo(px, py) {
    this.positionDetached = true;
    const moveOption = this.moveOptions?.[`${px}_${py}`];
    if (!moveOption) {
      if (this.moveQueue)
        this.moveQueue.length = 0;
      return;
    }
    if (!this.moveQueue) {
      this.moveQueue = [];
    }
    this.moveQueue.push(vec2(px, py));
    const from = moveOption.from;
    if (from.x !== this.px || from.y !== this.py) {
      this.moveTo(from.x, from.y);
      return;
    }
    this.hideResources();
    this.hideMoveOptions();
    this.manager.hud.showSelected(undefined);
  }
  setPosition(px, py, force) {
    if (this.px === px && this.py === py && !force)
      return;
    if (this.manager.grid[this.getTag()] === this) {
      delete this.manager.grid[this.getTag()];
    }
    if (this.px !== px) {
      this.lastDx = Math.sign(px - this.px);
      this.updateSize();
    }
    this.px = px;
    this.py = py;
    if (this.manager.grid[this.getTag()] !== this) {
      this.manager.grid[this.getTag()]?.destroy();
      this.manager.grid[this.getTag()] = this;
    }
    if (this.type === "cursor") {
      this.manager.onCursorMove(px, py);
    }
    if (this.type === "cloud") {
      this.manager.revealed.delete(`${px}_${py}`);
    }
    this.clearedCloud = false;
    this.updated = false;
  }
  hasMoveOption(x, y) {
    return this.moveOptions?.[`${x}_${y}`];
  }
  canMoveTo(px, py) {
    if (this.px === px && this.py === py) {
      return false;
    }
    if (!this.manager.revealed.has(`${px}_${py}`)) {
      return false;
    }
    if (this.elem?.type !== "unit") {
      return false;
    }
    if (this.manager.grid[`unit_${px}_${py}`]) {
      return false;
    }
    if (this.manager.grid[`decor_${px}_${py}`]) {
      return false;
    }
    if (this.manager.grid[`tile_overlay_${px}_${py}`]?.elem?.water) {
      return false;
    }
    if (this.elem?.closeToHome && this.home) {
      const home = this.home;
      const dx = px - home.px;
      const dy = py - home.py;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        return false;
      }
    }
    return true;
  }
  hide() {
    if (this.visible) {
      this.visible = false;
      this.size.set(0, 0);
    }
  }
  show() {
    if (!this.visible) {
      this.visible = true;
      this.updateSize();
    }
  }
  hoverIndic;
  onHoverChange() {
    if (this.manager.shifting) {
      return;
    }
    if (this.onHoverHideCursor) {
      if (this.manager.hovering(this)) {
        this.manager.setHovered(this);
        if (this.elem?.onHover?.indic && !this.hoverIndic) {
          this.hoverIndic = new EngineObject;
          const scale = this.elem.onHover.indic.scale ?? 1;
          this.hoverIndic.size.set(this.size.x * scale, this.size.y * scale);
          this.hoverIndic.tileInfo = this.manager.animation.getInfo(this.elem.onHover.indic.animation).tileInfos[0];
          this.hoverIndic.pos.set(this.px, this.py);
          const offset = this.elem?.gameObject?.offset ?? [0, 0];
          this.addChild(this.hoverIndic, vec2(-offset[0], -offset[1]));
          this.updated = false;
        }
      } else {
        this.manager.setHovered(undefined);
        if (this.elem?.onHover?.indic && this.hoverIndic) {
          this.removeChild(this.hoverIndic);
          this.hoverIndic.destroy();
          this.hoverIndic = undefined;
        }
      }
    }
  }
  selectIndic;
  showResourcesNearby() {
    const home = this.elem?.settler ? this : this.elem?.worker ? this.home : undefined;
    if (home) {
      for (let y = -1;y <= 1; y++) {
        for (let x = -1;x <= 1; x++) {
          if (x === 0 && y === 0 || this.canMoveTo(home.px + x, home.py + y)) {
            this.showResources(home.px + x, home.py + y, this.elem?.owner);
          }
        }
      }
    }
  }
  onSelectChange() {
    if (this.manager.selected === this) {
      if (this.elem?.selected?.indic && !this.selectIndic) {
        this.selectIndic = new EngineObject;
        const scale = this.elem.selected.indic.scale ?? 1;
        this.selectIndic.size.set(this.size.x * scale, this.size.y * scale);
        this.selectIndic.renderOrder = this.renderOrder - 0.1;
        this.selectIndic.tileInfo = this.manager.animation.getInfo(this.elem.selected.indic.animation).tileInfos[0];
        const offset = this.elem?.gameObject?.offset ?? [0, 0];
        this.addChild(this.selectIndic, vec2(-offset[0], -offset[1]));
        this.selectIndic.pos.set(this.px, this.py);
        this.showMoveOptions();
        if (!this.moving) {
          this.showResourcesNearby();
        }
        this.hideBars();
      }
    } else {
      if (this.elem?.selected?.indic && this.selectIndic) {
        this.selectIndic.destroy();
        this.selectIndic = undefined;
      }
      this.hideMoveOptions();
      if (this.elem?.animation) {
        this.hideResources();
      }
      this.refreshBars();
    }
  }
  showMoveOptions() {
    if (this.hasMove() && !this.manager.checkCondition(this.elem?.move?.disabled, this)) {
      this.addMoveOptions(this.elem?.move?.distance ?? 1, vec2(this.px, this.py));
    }
  }
  hideMoveOptions() {
    if (this.moveOptions) {
      Object.values(this.moveOptions).forEach((moveOption) => moveOption.destroy());
      delete this.moveOptions;
    }
  }
  addMoveOptions(movePoints, from, revealPotential = 0, distanceTravelled = 0) {
    if (!movePoints) {
      return;
    }
    const DIRECTIONS = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1]
    ];
    const froms = [];
    DIRECTIONS.forEach(([dx, dy]) => {
      if (!this.canMoveTo(from.x + dx, from.y + dy)) {
        return;
      }
      const newDistanceTravelled = distanceTravelled + Math.sqrt(dx * dx + dy * dy);
      const existingMoveOption = this.moveOptions?.[`${from.x + dx}_${from.y + dy}`];
      if (existingMoveOption) {
        const canReveal = revealPotential + this.manager.countRevealPotential(from.x + dx, from.y + dy);
        let shouldReplace = false;
        if (existingMoveOption.movePoints < movePoints) {
          shouldReplace = true;
        } else if (existingMoveOption.movePoints === movePoints) {
          if (existingMoveOption.distanceTravelled > newDistanceTravelled) {
            shouldReplace = true;
          } else if (existingMoveOption.distanceTravelled === newDistanceTravelled && existingMoveOption.canReveal < canReveal) {
            shouldReplace = true;
          }
        }
        if (shouldReplace) {
          existingMoveOption.canReveal = canReveal;
          existingMoveOption.from = from;
          existingMoveOption.movePoints = movePoints;
          existingMoveOption.distanceTravelled = newDistanceTravelled;
          froms.push([vec2(from.x + dx, from.y + dy), canReveal, newDistanceTravelled]);
        }
        return;
      }
      const obj = new EngineObject;
      obj.size.set(this.size.x, this.size.y);
      if (this.elem?.selected?.moveIndic) {
        obj.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.selected.moveIndic.animation));
      } else {
        obj.color = new Color(0, 0, 0, 0.3);
        obj.tileInfo = this.tileInfo;
      }
      obj.from = from;
      obj.canReveal = revealPotential + this.manager.countRevealPotential(from.x + dx, from.y + dy);
      obj.movePoints = movePoints;
      obj.distanceTravelled = newDistanceTravelled;
      const offset = this.elem?.gameObject?.offset ?? [0, 0];
      this.addChild(obj, vec2(from.x + dx - this.px - offset[0], from.y + dy - this.py - offset[1]));
      if (!this.moveOptions) {
        this.moveOptions = {};
      }
      this.moveOptions[`${from.x + dx}_${from.y + dy}`] = obj;
      froms.push([vec2(from.x + dx, from.y + dy), obj.canReveal, obj.distanceTravelled]);
      this.updated = false;
    });
    froms.forEach(([from2, revealing, newDistanceTravelled]) => this.addMoveOptions(movePoints - 1, from2, revealing, newDistanceTravelled));
  }
  getFrame(animInfo) {
    return !animInfo ? 0 : Math.floor(Date.now() / (1000 / this.frameRate)) % animInfo.tileInfos.length;
  }
  getTileInfoAnimate(animInfo) {
    const t = this.getFrame(animInfo);
    return animInfo?.tileInfos?.[t];
  }
  accumulateResources(resources) {
    if (this.doomed) {
      return;
    }
    if (this.home) {
      this.home.accumulateResources(resources);
      return;
    }
    const elem = this.elem;
    if (!elem) {
      return;
    }
    Object.entries(resources).forEach(([key, value]) => {
      const maxCapacity = this.resourceCapacity();
      if (!elem.resourcesAccumulated) {
        elem.resourcesAccumulated = {};
      }
      const k = key;
      elem.resourcesAccumulated[k] = Math.min(maxCapacity, (elem.resourcesAccumulated[k] ?? 0) + value);
    });
    if (elem.type === "house" && elem.resourcesAccumulated) {
      if ((elem.resourcesAccumulated.wheat ?? 0) >= this.nextLevelCost()) {
        elem.resourcesAccumulated.wheat = (elem.resourcesAccumulated.wheat ?? 0) - this.nextLevelCost();
        this.updateLevel((elem.level ?? 0) + 1);
        this.updated = false;
      }
    }
  }
  fixCows() {
    const cows = this.countUnitSupport("cow");
    const maxCows = this.elem?.level ?? 0;
    if (cows > maxCows) {
      let toRemove = cows - maxCows;
      this.manager.iterateRevealedCells((obj) => {
        if (toRemove <= 0) {
          return;
        }
        if (obj.elem?.name === "cow" && obj.home === this) {
          obj.doom(true);
          toRemove--;
        }
      });
    }
  }
  updateLevel(level) {
    if (this.elem?.type === "house") {
      this.elem.level = level;
      this.fixCows();
      this.refreshLabel();
      this.updated = false;
    }
  }
  nextLevelCost() {
    const nextLevel = (this.elem?.level ?? 0) + 1;
    return nextLevel * 10;
  }
  resourceCapacity() {
    const capacity = (this.elem?.level ?? 0) + 1;
    return capacity * 10;
  }
  countUnitSupport(unit) {
    let count = 0;
    this.manager.iterateRevealedCells((obj) => {
      if (obj.elem?.name === unit && obj.home === this) {
        count++;
      }
    });
    return count;
  }
  update() {
    super.update();
    if (this.updated && !this.elem?.dynamic && !this.doomed && Date.now() - this.bornTime < 1000 && !this.floatResources) {
      return;
    }
    const nowHoverered = this.manager.hovering(this);
    if (this.hovered !== nowHoverered) {
      this.hovered = nowHoverered;
      this.onHoverChange();
    }
    if (this.hoverIndic && this.elem?.onHover?.indic) {
      this.hoverIndic.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.onHover.indic.animation));
    }
    if (this.selectIndic && this.elem?.selected?.indic) {
      this.selectIndic.tileInfo = this.getTileInfoAnimate(this.manager.animation.getInfo(this.elem.selected.indic.animation));
    }
    if (this.mouseFollower) {
      let px = mousePos.x + this.mouseFollower.offset.x;
      let py = mousePos.y + this.mouseFollower.offset.y;
      if (this.mouseFollower.snap) {
        px = Math.round(px / this.mouseFollower.snap) * this.mouseFollower.snap;
        py = Math.round(py / this.mouseFollower.snap) * this.mouseFollower.snap;
      }
      this.setPosition(px, py);
    }
    const offset = this.elem?.gameObject?.offset ?? [0, 0];
    const dx = this.px + offset[0] - this.pos.x;
    const dy = this.py + offset[1] - this.pos.y;
    const animInfo = this.harvestAnimationInfo && this.elem?.harvesting ? this.harvestAnimationInfo : this.moveAnimationInfo && (dx || dy) ? this.moveAnimationInfo : this.selectedAnimationInfo && this.manager.selected === this ? this.selectedAnimationInfo : this.hoveredAnimationInfo && this.manager.hovering(this) ? this.hoveredAnimationInfo : this.animationInfo;
    if (animInfo) {
      this.tileInfo = this.getTileInfoAnimate(animInfo);
    }
    if (dx || dy) {
      const doMove = !animInfo?.airFramesSet || animInfo.airFramesSet?.has(this.getFrame(animInfo));
      if (doMove) {
        this.moving = true;
        if (dx * dx + dy * dy > 0.01) {
          const dist = this.elem?.gameObject?.speed ? Math.sqrt(dx * dx + dy * dy) : 1;
          const speed = Math.min(dist, this.elem?.gameObject?.speed ?? 0.5);
          this.pos.set(this.pos.x + dx / dist * speed, this.pos.y + dy / dist * speed);
        } else {
          this.pos.set(this.px + offset[0], this.py + offset[1]);
        }
      }
    } else {
      if (this.moveQueue?.length) {
        const dest = this.moveQueue.pop();
        this.setPosition(dest.x, dest.y);
        if (!this.moveQueue.length) {
          delete this.moveQueue;
        }
      } else if (this.moving) {
        this.moving = false;
        this.spendMove();
      }
    }
    if (this.type === "cursor") {
      if (mouseWasPressed(0)) {
      }
      if (mouseWasReleased(0)) {
        this.manager.onTap(this.px, this.py, mousePos.x, mousePos.y);
        this.manager.mousePosDown = undefined;
      }
    }
    const coLayers = this.manager.scene?.colayers;
    const renderOrder = Math.round(-this.py) + (this.manager.scene.layers?.[this.type ?? ""] ?? 100) * 1e4 + (coLayers?.[this.type ?? ""] ?? 0) * 0.001;
    if (this.renderOrder !== renderOrder || !this.updated) {
      this.renderOrder = renderOrder;
      this.decors.forEach((decor) => {
        decor.renderOrder = this.renderOrder + (this.elem?.spread?.behind ? -0.1 : 0.1);
      });
      if (this.moveOptions) {
        Object.values(this.moveOptions).forEach((moveOption) => moveOption.renderOrder = this.renderOrder - 0.1);
      }
      if (this.shadow) {
        this.shadow.renderOrder = this.renderOrder - 0.1;
      }
      if (this.hoverIndic) {
        this.hoverIndic.renderOrder = this.renderOrder - 0.1;
      }
      this.labels?.forEach((label) => label.renderOrder = this.renderOrder + 0.2);
      this.resources.forEach((resource) => resource.renderOrder = 1e5 + (resource.tileInfo ? 0.1 : -0.1));
      this.resourceBars.forEach((resource) => resource.renderOrder = 1e5 + (resource.tileInfo ? 0.1 : -0.1));
    }
    if (this.elem?.clearCloud && !this.clearedCloud) {
      const SIZE = 1, LIMIT = 2;
      for (let y = -SIZE;y <= SIZE; y++) {
        for (let x = -SIZE;x <= SIZE; x++) {
          if (Math.abs(x * y) < LIMIT * LIMIT) {
            this.manager.clearCloud(this.px + x, this.py + y);
          }
        }
      }
      this.clearedCloud = true;
    }
    this.updated = true;
    if (this.elem?.dynamic && Date.now() - this.bornTime < 1000) {
      this.updateSize();
    }
    if (this.doomed) {
      this.decors.forEach((decor) => {
        const time2 = Date.now() - decor.doomTime;
        if (time2 > 0) {
          decor.size.set(decor.size.x * 0.9, decor.size.y * 0.9);
        }
      });
    }
    if (this.floatResources) {
      if (Date.now() - this.floatResources > 2000) {
        this.floatResources = undefined;
        this.hideResources();
      } else {
        this.resources.forEach((res) => res.localPos.y += 0.005);
      }
    }
  }
  get home() {
    if (this.elem?.home && !this.elem?.building) {
      return this.manager.grid[GameObject.getTag("house", this.elem.home[0], this.elem?.home[1])] ?? undefined;
    }
    return;
  }
  doomed = false;
  doom(immediate) {
    this.doomed = true;
    this.size.set(0, 0);
    const destroy = () => {
      if (this.manager.grid[this.getTag()] === this) {
        delete this.manager.grid[this.getTag()];
      }
      this.decors.forEach((decor) => {
        decor.destroy();
      });
      this.labels?.forEach((label) => label.destroy());
      this.resources.forEach((resource) => resource.destroy());
      this.resourceBars.forEach((bar) => bar.destroy());
      if (this.shadow) {
        this.shadow.destroy();
      }
      this.destroy();
    };
    const DURATION = immediate ? 10 : 300;
    setTimeout(destroy, DURATION * 2);
    if (!immediate) {
      this.decors.forEach((decor) => {
        decor.doomTime = Date.now() + DURATION * Math.random();
      });
    }
  }
  updateLabel(showLabel) {
    if (showLabel) {
      this.refreshLabel();
      this.refreshBars();
      this.refreshAlpha();
    } else {
      this.labels.forEach((label) => label.destroy());
      this.labels.length = 0;
      this.resourceBars.forEach((bar) => bar.destroy());
      this.resourceBars.length = 0;
      this.color = new Color(1, 1, 1, 1);
    }
  }
  findNearby(cellCondition) {
    const set = new Set;
    for (let y = -1;y <= 1; y++) {
      for (let x = -1;x <= 1; x++) {
        if (x === 0 && y === 0) {
          continue;
        }
        this.manager.iterateGridCell(this.px + x, this.py + y, (cell) => {
          if (cellCondition(cell)) {
            set.add(cell);
          }
        });
      }
    }
    return set;
  }
  finalDestination() {
    return this.moveQueue?.[0] ?? vec2(this.px, this.py);
  }
}

// src/hud.ts
class Hud {
  manager;
  ui = document.createElement("div");
  bg = document.createElement("div");
  topBg = document.createElement("div");
  overlay = document.createElement("div");
  resourceOverlay = document.createElement("div");
  itemsToDestroy = new Set;
  scene;
  nextButton = document.createElement("button");
  endButton = document.createElement("button");
  updated = false;
  constructor(manager) {
    this.manager = manager;
    this.scene = manager.scene;
  }
  initialize() {
    this.ui.id = "hud";
    this.ui.classList.add("hud");
    document.body.appendChild(this.ui);
    this.ui.addEventListener("mouseover", (e) => {
      this.manager.inUI = true;
      this.manager.cursor?.hide();
    });
    this.ui.addEventListener("mouseout", (e) => {
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
    document.addEventListener("keyup", (e) => {
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
    const player = this.scene.turn?.player ?? 1;
    const RESOURCES = Object.keys(this.scene.resources).filter((resource) => !this.scene.resources[resource]?.hidden && this.scene.resources[resource]?.global).sort((a, b) => a.localeCompare(b));
    const revenuePerResource = this.manager.calculateResourceRevenue(player);
    RESOURCES.forEach((resource, _) => {
      let taxValue = this.scene.players[player - 1].tax ?? 0;
      let revenueValue = revenuePerResource[resource];
      const taxText = document.getElementById(`${resource}-tax`);
      if (taxText) {
        taxText.textContent = `${revenueValue >= 0 ? "+" : ""}${revenueValue} (${taxValue}%)`;
      }
    });
    let taxKnob = document.getElementById("tax");
    if (!taxKnob) {
      taxKnob = this.resourceOverlay.appendChild(document.createElement("input"));
      taxKnob.id = "tax";
      taxKnob.type = "range";
      taxKnob.min = "0";
      taxKnob.max = "100";
      taxKnob.step = "5";
      taxKnob.value = `${this.scene.players[player - 1].tax ?? 0}`;
      taxKnob.style.width = "60px";
      taxKnob.addEventListener("input", (e) => {
        this.scene.players[player - 1].tax = parseInt(taxKnob.value);
        this.refreshTax();
      });
    }
  }
  refreshResources() {
    const player = this.scene.turn?.player ?? 1;
    const RESOURCES = Object.keys(this.scene.resources).filter((resource) => !this.scene.resources[resource]?.hidden && this.scene.resources[resource]?.global).sort((a, b) => a.localeCompare(b));
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
      const taxText = document.getElementById(`${resource}-tax`) ?? this.resourceOverlay.appendChild(document.createElement("div"));
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
    nextButton.addEventListener("click", (e) => {
      this.manager.selectNext();
    });
    const endButton = this.overlay.appendChild(this.endButton);
    endButton.id = "endButton";
    endButton.addEventListener("click", (e) => {
      this.stopFlashEndTurn();
      this.manager.gotoNextTurn();
    });
    endButton.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    endButton.addEventListener("mouseup", (e) => {
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
    autoEndCheckbox.addEventListener("change", (e) => {
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
  showSelected(obj) {
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
      const spriteWidth = spriteSize[0] + (padding?.[0] ?? 0) * 2;
      let animationFrame;
      const animateIcon = () => {
        animationFrame = requestAnimationFrame(animateIcon);
        const frame2 = frames[Math.floor(performance.now() / 100) % frames.length];
        icon.style.backgroundPosition = `-${spriteWidth * frame2}px 0`;
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
      healthDiv.style.top = "0";
      if (obj.elem?.type === "house") {
        {
          const wheat = healthDiv.appendChild(document.createElement("div"));
          wheat.style.display = "flex";
          wheat.style.flexDirection = "row";
          wheat.style.alignItems = "center";
          wheat.style.justifyContent = "left";
          wheat.style.margin = "3px 10px";
          wheat.style.height = "20px";
          if (this.scene.resources.wheat) {
            const { imageSource: imageSource2, spriteSize: spriteSize2, frames: frames2, padding: padding2 } = this.scene.resources.wheat.icon;
            const icon2 = wheat.appendChild(document.createElement("div"));
            icon2.style.backgroundImage = `url(${imageSource2})`;
            icon2.style.width = `${spriteSize2[0]}px`;
            icon2.style.height = `${spriteSize2[1]}px`;
            icon2.style.transform = "scale(.5)";
            const spriteWidth2 = spriteSize2[0] + (padding2?.[0] ?? 0) * 2;
            icon2.style.backgroundPosition = `-${spriteWidth2 * frames2[0]}px 0`;
          }
          const cost = obj.nextLevelCost();
          const label2 = wheat.appendChild(document.createElement("div"));
          label2.style.fontSize = "10pt";
          label2.style.color = "gold";
          label2.textContent = `${obj.elem.resourcesAccumulated?.wheat ?? 0} / ${cost}`;
        }
        {
          const wood = healthDiv.appendChild(document.createElement("div"));
          wood.style.display = "flex";
          wood.style.flexDirection = "row";
          wood.style.alignItems = "center";
          wood.style.justifyContent = "left";
          wood.style.margin = "3px 10px";
          wood.style.height = "10px";
          if (this.scene.resources.wood) {
            const { imageSource: imageSource2, spriteSize: spriteSize2, frames: frames2, padding: padding2 } = this.scene.resources.wood.icon;
            const icon2 = wood.appendChild(document.createElement("div"));
            icon2.style.backgroundImage = `url(${imageSource2})`;
            icon2.style.width = `${spriteSize2[0]}px`;
            icon2.style.height = `${spriteSize2[1]}px`;
            icon2.style.transform = "scale(.5)";
            const spriteWidth2 = spriteSize2[0] + (padding2?.[0] ?? 0) * 2;
            icon2.style.backgroundPosition = `-${spriteWidth2 * frames2[0]}px 0`;
          }
          const label2 = wood.appendChild(document.createElement("div"));
          label2.style.fontSize = "10pt";
          label2.style.color = "orange";
          const capacity = obj.resourceCapacity();
          label2.textContent = `${obj.elem.resourcesAccumulated?.wood ?? 0} / ${capacity}`;
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
        const spriteWidth = spriteSize[0] + (padding?.[0] ?? 0) * 2;
        let animationFrame;
        const animateIcon = () => {
          animationFrame = requestAnimationFrame(animateIcon);
          const frame2 = frames[Math.floor(performance.now() / 100) % frames.length];
          icon.style.backgroundPosition = `-${spriteWidth * frame2}px 0`;
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
          menuItemDiv.addEventListener("mousedown", (e) => {
            menuItemDiv.style.backgroundColor = "rgba(250, 250, 150, .5)";
            e.preventDefault();
            e.stopPropagation();
          });
          menuItemDiv.addEventListener("mouseup", (e) => {
            menuItemDiv.style.backgroundColor = "rgba(100, 100, 100, 0.5)";
            const actions = item.actions ?? [];
            actions.forEach((action) => {
              if (action.destroy) {
                obj.doom(true);
              }
              if (action.create) {
                this.manager.defineElem(action.create);
                const elem = JSON.parse(JSON.stringify(action.create));
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
                obj.updateLevel((obj.elem.level ?? 0) + action.level);
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

// src/manager.ts
class Manager {
  scene;
  entries = new Map;
  animation;
  grid = {};
  revealed = new Set;
  cursor;
  selected;
  hovered;
  mousePosDown;
  camShift = vec2(0, 0);
  shifting = 0;
  doneShifting = 0;
  hud;
  worldChanged = true;
  inUI;
  resourceIcons = [];
  autoEndTurn = true;
  showLabels = true;
  constructor(scene) {
    this.scene = scene;
    this.animation = new AnimationManager(scene.animations);
    this.hud = new Hud(this);
    if (scene.scale) {
      setCameraScale(scene.scale);
    }
    document.addEventListener("wheel", (e) => {
      this.camShift.x += e.deltaX / cameraScale;
      this.camShift.y -= e.deltaY / cameraScale;
      e.preventDefault();
    }, { passive: false });
    this.hud.initialize();
  }
  updateLabels() {
    this.iterateRevealedCells((gameObject) => {
      gameObject.updateLabel(this.showLabels);
    });
  }
  refresh() {
    this.initializeTurn();
    this.scene.elems.forEach((elem) => {
      this.sanitizeElem(elem);
      this.refreshElem(elem);
    });
    this.shiftCamera();
    if (this.worldChanged) {
      this.fixWorld();
      this.worldChanged = false;
    }
    this.hud.refresh();
  }
  initializeTurn() {
    if (!this.scene.turn) {
      this.scene.turn = {
        player: 1,
        turn: 1
      };
    }
  }
  iterateGridCell(x, y, callback) {
    Object.keys(this.scene.layers).forEach((layer) => {
      const tag = `${layer}_${x}_${y}`;
      const gameObject = this.grid[tag];
      if (gameObject) {
        callback(gameObject);
      }
    });
  }
  getRevealedCells() {
    const cells = [];
    this.revealed.forEach((tag) => {
      const [x, y] = tag.split("_").map(Number);
      cells.push(vec2(x, y));
    });
    return cells;
  }
  iterateRevealedCells(callback) {
    const cells = this.getRevealedCells();
    for (const cell of cells) {
      Object.keys(this.scene.layers).forEach((layer) => {
        const tag = `${layer}_${cell.x}_${cell.y}`;
        const gameObject = this.grid[tag];
        if (gameObject) {
          callback(gameObject);
        }
      });
    }
  }
  fixWorld() {
    Object.entries(this.grid).forEach(([tag, gameObject]) => {
      if (gameObject.elem?.condition) {
        let conditionMet = false;
        if (gameObject.elem.condition.tile) {
          const tiles = Array.isArray(gameObject.elem.condition.tile) ? gameObject.elem.condition.tile : [gameObject.elem.condition.tile];
          tiles.forEach((tile) => {
            this.iterateGridCell(gameObject.px, gameObject.py, (target) => {
              if (target?.elem?.name === tile) {
                conditionMet = true;
              }
            });
          });
        }
        let violationMet = false;
        if (gameObject.elem.condition.noTile) {
          const tiles = Array.isArray(gameObject.elem.condition.noTile) ? gameObject.elem.condition.noTile : [gameObject.elem.condition.noTile];
          tiles.forEach((tile) => {
            Object.keys(this.scene.layers).forEach((layer) => {
              const tag2 = `${layer}_${gameObject.px}_${gameObject.py}`;
              const target = this.grid[tag2];
              if (target?.elem?.name === tile) {
                violationMet = true;
              }
            });
          });
        }
        if (gameObject.elem.condition.zeroUnit) {
          const tag2 = `unit_${gameObject.px}_${gameObject.py}`;
          const target = this.grid[tag2];
          if (target) {
            violationMet = true;
          }
        }
        if (!conditionMet || violationMet) {
          gameObject.doom(true);
          delete this.grid[tag];
        }
      }
    });
  }
  shiftCamera() {
    if (this.inUI) {
      return;
    }
    if (!this.mousePosDown && mouseWasPressed(0)) {
      this.mousePosDown = vec2(mousePos.x, mousePos.y);
    }
    if (this.mousePosDown && mouseWasReleased(0)) {
      this.mousePosDown = undefined;
      if (!this.selected) {
        this.refreshCursor();
      }
      if (this.shifting) {
        this.shifting = 0;
        this.doneShifting = Date.now();
        this.refreshCursor();
      }
    }
    if (this.mousePosDown) {
      const dx2 = mousePos.x - this.mousePosDown.x;
      const dy2 = mousePos.y - this.mousePosDown.y;
      if (dx2 || dy2) {
        const mul2 = 10;
        this.camShift.set(this.camShift.x - dx2 * mul2, this.camShift.y - dy2 * mul2);
        this.mousePosDown.set(mousePos.x, mousePos.y);
        this.cursor?.hide();
        this.shifting = Date.now();
        this.doneShifting = 0;
      }
    }
    const dx = this.camShift.x - cameraPos.x;
    const dy = this.camShift.y - cameraPos.y;
    const mul = 0.1;
    setCameraPos(cameraPos.set(Math.round((cameraPos.x + dx * mul) * cameraScale) / cameraScale, Math.round((cameraPos.y + dy * mul) * cameraScale) / cameraScale));
  }
  defineElem(elem) {
    if (elem.definition) {
      const defintion = this.scene.definitions.find((def) => def.name === elem.definition);
      if (defintion) {
        Object.entries(defintion).forEach(([key, value]) => {
          const e = elem;
          if (e[key] === undefined) {
            e[key] = JSON.parse(JSON.stringify(value));
          }
        });
        delete elem.definition;
      }
    }
  }
  refreshElem(elem) {
    this.defineElem(elem);
    if (elem.gameObject) {
      const entry = this.ensureElem(elem);
      if (entry.updateTime !== elem.lastUpdate) {
        entry.gameObject?.forEach((gameObject) => {
          gameObject.refresh(elem);
        });
        entry.updateTime = elem.lastUpdate;
      }
    } else {
      const entry = this.entries.get(elem);
      if (entry) {
        entry.gameObject?.forEach((gameObject) => gameObject.refresh(elem));
        entry.gameObject.clear();
        this.entries.delete(elem);
      }
    }
  }
  ensureElem(elem) {
    let entry = this.entries.get(elem);
    if (!entry) {
      entry = {
        gameObject: new Set
      };
      this.entries.set(elem, entry);
      if (elem.gameObject && !entry.gameObject.size) {
        const chance = elem.group?.chance ?? 1;
        const [col, row] = elem.group?.grid ?? [1, 1];
        for (let x = 0;x < col; x++) {
          for (let y = 0;y < row; y++) {
            if (Math.random() <= chance) {
              const xx = x - Math.floor(col / 2);
              const yy = y - Math.floor(row / 2);
              if ((elem.type === "decor" || elem.water) && Math.abs(xx) <= 1 && Math.abs(yy) <= 1) {
                continue;
              }
              if (elem.type === "cloud" && this.revealed.has(`${xx}_${yy}`)) {
                continue;
              }
              const gameObject = new GameObject(this, vec2(xx, yy));
              entry.gameObject.add(gameObject);
              gameObject.refresh(elem);
            }
          }
        }
      }
    }
    return entry;
  }
  sanitizeElem(elem) {
    if (!elem.lastUpdate) {
      elem.lastUpdate = Date.now();
    }
    if (elem.gameObject) {
      if (!elem.gameObject.pos) {
        elem.gameObject.pos = [0, 0];
      }
      if (!elem.gameObject.size) {
        elem.gameObject.size = [1, 1];
      }
    }
  }
  countRevealPotential(x, y) {
    let count = 0;
    for (let xx = -1;xx <= 1; xx++) {
      for (let yy = -1;yy <= 1; yy++) {
        if (this.grid[`tile_${x + xx}_${y + yy}`] && !this.revealed.has(`${x + xx}_${y + yy}`)) {
          count++;
        }
      }
    }
    return count;
  }
  getResources(x, y) {
    const resources = {};
    Object.keys(this.scene.layers).forEach((layer) => {
      const tag = `${layer}_${x}_${y}`;
      const gameObject = this.grid[tag];
      if (gameObject && !gameObject?.doomed) {
        resources.wheat = (resources.wheat ?? 0) + (gameObject.elem?.resourcesProduced?.wheat ?? 0);
        resources.wood = (resources.wood ?? 0) + (gameObject.elem?.resourcesProduced?.wood ?? 0);
        resources.brain = (resources.brain ?? 0) + (gameObject.elem?.resourcesProduced?.brain ?? 0);
        resources.gold = (resources.gold ?? 0) + (gameObject.elem?.resourcesProduced?.gold ?? 0);
        resources.trade = (resources.trade ?? 0) + (gameObject.elem?.resourcesProduced?.trade ?? 0);
      }
    });
    return Math.max(resources.wheat ?? 0, 0) + Math.max(resources.wood ?? 0, 0) + Math.max(resources.brain ?? 0, 0) + Math.max(resources.gold ?? 0, 0) + Math.max(resources.trade ?? 0, 0) ? resources : undefined;
  }
  clearCloud(x, y) {
    const tag = `${x}_${y}`;
    if (this.revealed.has(tag)) {
      return;
    }
    this.revealed.add(tag);
    const gameObject = this.grid[`cloud_${x}_${y}`];
    if (gameObject) {
      gameObject.doom();
      const elem = gameObject.elem;
      if (elem) {
        const entry = this.entries.get(elem);
        if (entry) {
          entry.gameObject.delete(gameObject);
        }
      }
      delete this.grid[tag];
    }
  }
  onCursorMove(x, y) {
  }
  onTap(x, y, mouseX, mouseY) {
    if (Date.now() - this.doneShifting < 100) {
      return;
    }
    if (this.inUI) {
      return;
    }
    if (this.selected?.canMoveTo(x, y) && this.selected.hasMoveOption(x, y)) {
      this.selected.moveTo(x, y);
      return;
    }
    let unit = this.grid[`unit_${x}_${y}`];
    if (!unit?.canAct()) {
      unit = undefined;
    }
    const house = this.grid[`house_${x}_${y}`];
    this.setSelection(!unit || unit === this.selected ? house : unit);
  }
  setSelection(gameObject) {
    if (this.selected === gameObject) {
      return;
    }
    const previousSelected = this.selected;
    this.selected = gameObject;
    previousSelected?.onSelectChange();
    this.selected?.onSelectChange();
    this.hud.showSelected(this.selected);
    if (!this.shifting && this.selected) {
      this.makeWithinView(this.selected);
    }
  }
  makeWithinView(gameObject) {
    const finalDestination = gameObject.finalDestination();
    const dx = finalDestination.x - this.camShift.x;
    const dy = finalDestination.y - this.camShift.y;
    const diffX = 4, diffY = 2;
    if (Math.abs(dx) > diffX) {
      this.camShift.set(finalDestination.x, this.camShift.y);
    }
    if (Math.abs(dy) > diffY) {
      this.camShift.set(this.camShift.x, finalDestination.y);
    }
  }
  hovering(gameObject) {
    return gameObject.px === this.cursor?.px && gameObject.py === this.cursor?.py;
  }
  refreshCursor() {
    if (this.hovered) {
      this.cursor?.hide();
    } else {
      this.cursor?.show();
    }
  }
  setHovered(gameObject) {
    if (this.hovered === gameObject) {
      return;
    }
    this.hovered = gameObject;
    this.refreshCursor();
  }
  checkCondition(condition, obj) {
    if (!condition) {
      return null;
    }
    if (condition.levelBelowEqual && (obj?.elem?.level ?? 0) <= condition.levelBelowEqual[0]) {
      return condition.levelBelowEqual[1] ?? "true";
    }
    if (condition.occupied && obj) {
      const tag = GameObject.getTag(condition.occupied[0], obj?.px, obj?.py);
      if (this.grid[tag]) {
        return condition.occupied[1] ?? "true";
      }
    }
    if (condition.harvesting && obj && obj.elem?.harvesting) {
      return "true";
    }
    if (condition.notHarvesting && obj && !obj.elem?.harvesting) {
      return "true";
    }
    if (obj) {
      let proxyCheck = null;
      const PROXY_CHECK = [condition.proximity, condition.nonProximity];
      PROXY_CHECK.forEach((check) => {
        if (check && !proxyCheck) {
          const [item, message] = check;
          if (item) {
            const nearby = obj.findNearby((obj2) => obj2.elem?.name === item);
            if (condition.proximity && nearby.size) {
              proxyCheck = message ?? "true";
            }
            if (condition.nonProximity && !nearby.size) {
              proxyCheck = message ?? "true";
            }
          }
        }
      });
      if (proxyCheck) {
        return proxyCheck;
      }
    }
    if (condition.cannotAct) {
      return !obj?.canAct() ? condition.cannotAct[1] : null;
    }
    if (condition.unitLimit) {
      const level = obj?.elem?.level ?? 0;
      const [unit, message] = condition.unitLimit;
      const support = obj?.countUnitSupport(unit);
      if (support && support >= level) {
        return message ?? "true";
      }
    }
    return null;
  }
  gotoNextTurn() {
    if (this.scene.turn) {
      if (this.scene.turn.player < this.scene.players.length) {
        this.scene.turn.player++;
      } else {
        this.scene.turn.player = 1;
        this.scene.turn.turn++;
      }
      this.collectResources(this.scene.turn.player);
      this.giveUnitsTurns();
      this.selectNext();
    }
    this.hud.updated = false;
  }
  giveUnitsTurns() {
    this.iterateRevealedCells((gameObject) => {
      if (gameObject.elem?.owner === this.scene.turn?.player) {
        gameObject.giveTurn();
      }
    });
  }
  calculateRevenue(player) {
    const playerResources = this.scene.players[player - 1]?.resources;
    if (!playerResources) {
      return 0;
    }
    let trade = 0;
    const visited = new Set;
    this.iterateRevealedCells((gameObject) => {
      const elem = gameObject.elem;
      if (elem?.owner === player && elem.harvesting) {
        if (!visited.has(`${gameObject.px}_${gameObject.py}`)) {
          visited.add(`${gameObject.px}_${gameObject.py}`);
          const resources = this.getResources(gameObject.px, gameObject.py);
          if (resources) {
            trade += resources.trade ?? 0;
          }
        }
      }
    });
    return trade;
  }
  collectResources(player) {
    const playerResources = this.scene.players[player - 1]?.resources;
    if (!playerResources) {
      return;
    }
    this.iterateRevealedCells((gameObject) => {
      const elem = gameObject.elem;
      if (elem?.owner === player && elem.harvesting) {
        const resources = this.getResources(gameObject.px, gameObject.py);
        if (resources) {
          gameObject.showResources(gameObject.px, gameObject.py, player, true);
          gameObject.accumulateResources(resources);
          delete elem.lastUpdate;
        }
      }
    });
    const globalResources = this.calculateResourceRevenue(player);
    Object.entries(globalResources).forEach(([resource, value]) => {
      const r = resource;
      playerResources[r] = (playerResources[r] ?? 0) + value;
    });
    this.hud.updated = true;
  }
  checkForAnyMove() {
    let canMove = false;
    this.iterateRevealedCells((gameObject) => {
      if (gameObject.elem?.owner === this.scene.turn?.player && gameObject.canAct() && !gameObject.elem?.harvesting) {
        canMove = true;
      }
    });
    if (!canMove) {
      if (this.autoEndTurn) {
        this.hud.flashEndTurn(true);
        setTimeout(() => {
          this.gotoNextTurn();
        }, 500);
      } else {
        this.hud.flashEndTurn();
      }
    }
  }
  calculateResourceRevenue(player) {
    const revenue = this.calculateRevenue(player);
    const RESOURCES = Object.keys(this.scene.resources).filter((resource) => !this.scene.resources[resource]?.hidden && this.scene.resources[resource]?.global).sort((a, b) => a.localeCompare(b));
    const resources = {
      wheat: 0,
      wood: 0,
      gold: 0,
      brain: 0,
      trade: 0
    };
    RESOURCES.forEach((resource, index) => {
      let taxValue = this.scene.players[player - 1].tax ?? 0;
      let revenueValue = Math.round(revenue * taxValue / 100);
      if (index === 0) {
        taxValue = 100 - taxValue;
        revenueValue = revenue - revenueValue;
      }
      resources[resource] = revenueValue;
    });
    return resources;
  }
  selectNext() {
    const cellsRotation = [];
    this.iterateRevealedCells((gameObject) => {
      let include = false;
      if (this.selected === gameObject) {
        include = true;
      } else if (gameObject.elem?.owner === this.scene.turn?.player && gameObject.canAct()) {
        if (gameObject.elem?.type === "unit" && !gameObject.elem?.harvesting) {
          include = true;
        } else if (gameObject?.elem?.type === "house" && gameObject.canAffordMoreHarvester()) {
          include = true;
        }
      }
      if (include) {
        cellsRotation.push(gameObject);
      }
    });
    const currentIndex = this.selected ? cellsRotation.indexOf(this.selected) : -1;
    let nextIndex = (currentIndex + 1) % cellsRotation.length;
    this.setSelection(this.selected === cellsRotation[nextIndex] ? undefined : cellsRotation[nextIndex]);
  }
}

// src/content/definitions/cabana.ts
var CABANA = {
  name: "cabana",
  type: "house",
  gameObject: {
    offset: [0, 0.2],
    size: [2, 2]
  },
  animation: {
    name: "cabana"
  }
};

// src/content/definitions/cow.ts
var COW = {
  name: "cow",
  type: "unit",
  hitpoints: 15,
  maxHitPoints: 15,
  gameObject: {
    size: [1.8, 1.8],
    speed: 0.06
  },
  animation: {
    name: "cow"
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover"
    }
  },
  selected: {
    animation: "cow_wait",
    indic: {
      animation: "indic"
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected"
    }
  },
  clearCloud: true,
  move: {
    animation: "cow_jump",
    distance: 2,
    disabled: {
      harvesting: true
    }
  },
  harvest: {
    animation: "cow_sleep"
  },
  shadow: {
    animation: "shadow"
  },
  worker: true,
  turn: {
    moves: 1,
    attacks: 0,
    actions: 1
  },
  closeToHome: true,
  endlessMove: true
};

// src/content/definitions/dog.ts
var DOG = {
  name: "dog",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    size: [1.8, 1.8],
    speed: 0.08
  },
  animation: {
    name: "dog"
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover"
    }
  },
  selected: {
    animation: "dog_wait",
    indic: {
      animation: "indic"
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected"
    }
  },
  move: {
    animation: "dog_jump",
    distance: 2
  },
  shadow: {
    animation: "shadow"
  },
  clearCloud: true,
  dynamic: true,
  turn: {
    moves: 1,
    attacks: 1
  }
};

// src/content/definitions/house.ts
var HOUSE = {
  name: "house",
  type: "house",
  level: 1,
  gameObject: {
    offset: [0, 0.7],
    size: [2, 2]
  },
  animation: {
    name: "house"
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover"
    }
  },
  selected: {
    animation: "house",
    indic: {
      animation: "indic"
    }
  },
  dynamic: true,
  settler: true,
  harvesting: true,
  building: true,
  turn: {
    moves: 0,
    attacks: 0
  },
  resourcesProduced: {
    trade: 1
  }
};

// src/content/definitions/river.ts
var RIVER = {
  name: "river",
  type: "road",
  resourcesProduced: {
    wheat: 1,
    trade: 1
  },
  gameObject: {
    size: [2, 2]
  },
  animation: {
    name: "river"
  },
  condition: {
    noTile: "lake"
  }
};

// src/content/definitions/sheep.ts
var SHEEP = {
  name: "sheep",
  type: "unit",
  hitpoints: 10,
  maxHitPoints: 10,
  gameObject: {
    pos: [0, 0],
    size: [1.8, 1.8],
    speed: 0.08
  },
  animation: {
    name: "sheep"
  },
  onHover: {
    hideCursor: true,
    indic: {
      animation: "hover"
    }
  },
  selected: {
    animation: "sheep_wait",
    indic: {
      animation: "indic"
    },
    moveIndic: {
      animation: "blue",
      selectedAnimation: "blue_selected"
    }
  },
  move: {
    animation: "sheep_jump"
  },
  shadow: {
    animation: "shadow"
  },
  clearCloud: true,
  dynamic: true,
  settler: true,
  turn: {
    moves: 1,
    attacks: 1
  }
};

// src/content/menu/cow-menu.ts
var COW_MENU = {
  name: "cow",
  description: "Cows are your workers.\nUse them to harvest resources.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  items: [
    {
      name: "harvest",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      padding: [2, 2],
      frames: [55],
      label: "harvest",
      hidden: {
        occupied: ["house", "No harvest on house"],
        harvesting: true
      },
      disabled: {
        nonProximity: ["house", "Must be\nnext to a house"]
      },
      actions: [
        {
          deselect: true
        },
        {
          harvest: true
        }
      ]
    },
    {
      name: "stopHarvest",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      padding: [2, 2],
      frames: [51],
      label: "stop harvest",
      hidden: {
        notHarvesting: true
      },
      actions: [
        {
          deselect: true
        },
        {
          stopHarvest: true
        }
      ]
    }
  ]
};

// src/content/menu/house-menu.ts
var HOUSE_MENU = {
  name: "house",
  description: "Use settlements to grow your animal kingdom.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [27, 28, 29]
  },
  items: [
    {
      name: "sheep",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      padding: [2, 2],
      frames: [6],
      label: "spawn\nsheep",
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"]
      },
      disabled: {
        levelBelowEqual: [1, "Settlement\nlevel too low"],
        cannotAct: [true, "Wait next turn"]
      },
      actions: [
        {
          deselect: true,
          level: -1,
          create: {
            definition: "sheep",
            selfSelect: true
          }
        }
      ]
    },
    {
      name: "dog",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      padding: [2, 2],
      frames: [46],
      label: "spawn\ndog",
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"]
      },
      disabled: {
        cannotAct: [true, "Wait next turn"]
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "dog",
            selfSelect: true
          }
        }
      ]
    },
    {
      name: "cow",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      padding: [2, 2],
      frames: [51],
      label: "spawn\ncow",
      hidden: {
        occupied: ["unit", "Tile occupied\nby a unit"],
        unitLimit: ["cow", "Increase level\nto spawn more"]
      },
      disabled: {},
      actions: [
        {
          deselect: true,
          create: {
            definition: "cow",
            selfSelect: true
          }
        }
      ]
    }
  ]
};

// src/content/menu/sheep-menu.ts
var SHEEP_MENU = {
  name: "sheep",
  description: "The sheep is your settler.\nUse it to build settlements.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [6, 7]
  },
  items: [
    {
      name: "build",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      padding: [2, 2],
      frames: [27, 28, 29],
      label: "build\nsettlement",
      disabled: {
        proximity: ["house", "Too close to\nanother house"]
      },
      actions: [
        {
          deselect: true,
          create: {
            definition: "house",
            selfSelect: true
          }
        },
        {
          destroy: true
        }
      ]
    }
  ]
};

// src/content/research/beaver.ts
var BEAVER_RESEARCH = {
  name: "beaver",
  description: "Beavers can build dams.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["squirrel"]
};

// src/content/research/bovine.ts
var BOVINE_RESEARCH = {
  name: "bovine",
  description: "Cows are your workers.\nUse them to harvest resources.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: []
};

// src/content/research/canine.ts
var CANINE_RESEARCH = {
  name: "canine",
  description: "Dogs are your scouts.\nUse them to explore the world.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [46]
  },
  dependency: []
};

// src/content/research/elephant.ts
var ELEPHANT_RESEARCH = {
  name: "elephant",
  description: "Elephants can trample enemies.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["pig"]
};

// src/content/research/eagle.ts
var EAGLE_RESEARCH = {
  name: "eagle",
  description: "Eagles are airborn fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["owl"]
};

// src/content/research/goat.ts
var GOAT_RESEARCH = {
  name: "goat",
  description: "Goats can climb mountains.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: []
};

// src/content/research/horse.ts
var HORSE_RESEARCH = {
  name: "horse",
  description: "Horses a fast fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: []
};

// src/content/research/lama.ts
var LAMA_RESEARCH = {
  name: "lama",
  description: "Lamas spit at their enemies.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: []
};

// src/content/research/monkey.ts
var MONKEY_RESEARCH = {
  name: "monkey",
  description: "Monkeys throw projectiles.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: []
};

// src/content/research/owl.ts
var OWL_RESEARCH = {
  name: "owl",
  description: "Owls are flying scouts.\nThey hide in trees.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["tortoise", "squirrel"]
};

// src/content/research/panda.ts
var PANDA_RESEARCH = {
  name: "panda",
  description: "Pandas are strong fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["squirrel"]
};

// src/content/research/pig.ts
var PIG_RESEARCH = {
  name: "pig",
  description: "Pigs can harvest resources faster.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["bovine"]
};

// src/content/research/skunk.ts
var SKUNK_RESEARCH = {
  name: "skunk",
  description: "Skunks can spray enemies.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["squirrel"]
};

// src/content/research/squirrel.ts
var SQUIRREL_RESEARCH = {
  name: "squirrel",
  description: "Squirrels can climb trees.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: []
};

// src/content/research/tortoise.ts
var TORTOISE_RESEARCH = {
  name: "tortoise",
  description: "Turtles can carry others on water.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: []
};

// src/content/research/wolves.ts
var WOLVES_RESEARCH = {
  name: "wolves",
  description: "Wolves are ferocious fighters.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [46]
  },
  dependency: ["canine"]
};

// src/content/resources/brain.ts
var BRAIN_RESOURCE = {
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [58]
  },
  global: true
};

// src/content/resources/gold.ts
var GOLD_RESOURCE = {
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [59]
  },
  global: true
};

// src/content/resources/trade.ts
var TRADE_RESOURCE = {
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [60]
  },
  global: true,
  hidden: true
};

// src/content/resources/wheat.ts
var WHEAT_RESOURCE = {
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [56]
  }
};

// src/content/resources/wood.ts
var WOOD_RESOURCE = {
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [57]
  }
};

// src/content/research/rabbit.ts
var RABBIT_RESEARCH = {
  name: "rabbit",
  description: "Rabbits cast magic spells to heal.",
  icon: {
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64],
    padding: [2, 2],
    frames: [51]
  },
  dependency: ["beaver"]
};

// src/content/animations/indicators.ts
var TRIANGLE_ANIMATION = {
  name: "triangle",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  mul: 2,
  frames: [
    0,
    1,
    2,
    3
  ]
};
var HOVER_ANIMATION = {
  name: "hover",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    20
  ]
};
var INDIC_ANIMATION = {
  name: "indic",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  mul: 3,
  frames: [
    9,
    9,
    10,
    11,
    12,
    11,
    10
  ]
};
var BLUE_ANIMATION = {
  name: "blue",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    13
  ]
};

// src/content/animations/sheep.ts
var SHEEP_ANIMATION = {
  name: "sheep",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    6
  ]
};
var SHEEP_WAIT_ANIMATION = {
  name: "sheep_wait",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  mul: 20,
  frames: [
    6,
    7
  ]
};
var SHEEP_JUMP_ANIMATION = {
  name: "sheep_jump",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  mul: 2,
  frames: [
    6,
    7,
    8,
    8
  ],
  airFrames: [8]
};

// src/content/animations/terrain.ts
var GRASSLAND_ANIMATION = {
  name: "grassland",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    14
  ]
};
var PLAIN_ANIMATION = {
  name: "plain",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    30
  ]
};
var GRASS_ANIMATION = {
  name: "grass",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    15
  ]
};
var TREE_ANIMATION = {
  name: "tree",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    16
  ]
};
var TREE_LEAF_ANIMATION = {
  name: "tree_leaf",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    17
  ]
};
var MOUNTAIN_ANIMATION = {
  name: "mountain",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    25
  ]
};

// src/content/animations/cloud.ts
var CLOUD_ANIMATION = {
  name: "cloud",
  imageSource: "./assets/tiles.png",
  spriteSize: [64, 64],
  frames: [
    18
  ]
};

// src/content/world.ts
var SIZE = 30;
var worldData = {
  scale: 80,
  players: [
    {
      tax: 50,
      resources: {
        brain: 0,
        gold: 0
      }
    }
  ],
  layers: {
    tile: 0,
    tile_overlay: 1,
    road: 3,
    house: 4,
    unit: 4,
    decor: 4,
    cloud: 6,
    cursor: 7
  },
  colayers: {
    house: 1,
    decor: 2,
    unit: 3
  },
  definitions: [
    SHEEP,
    DOG,
    COW,
    RIVER,
    HOUSE,
    CABANA
  ],
  animations: [
    TRIANGLE_ANIMATION,
    SHEEP_ANIMATION,
    SHEEP_WAIT_ANIMATION,
    SHEEP_JUMP_ANIMATION,
    HOVER_ANIMATION,
    INDIC_ANIMATION,
    BLUE_ANIMATION,
    GRASSLAND_ANIMATION,
    PLAIN_ANIMATION,
    GRASS_ANIMATION,
    TREE_ANIMATION,
    TREE_LEAF_ANIMATION,
    MOUNTAIN_ANIMATION,
    CLOUD_ANIMATION,
    {
      name: "shadow",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        19
      ]
    },
    {
      name: "blue_selected",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        21,
        22,
        23,
        24,
        23,
        22,
        21
      ],
      mul: 3
    },
    {
      name: "lake",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        33
      ]
    },
    {
      name: "wave",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        34
      ]
    },
    {
      name: "river",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        32
      ]
    },
    {
      name: "house",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        27,
        28,
        29
      ],
      mul: 20
    },
    {
      name: "cabana",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        61
      ]
    },
    ...new Array(10).fill(36).map((base, i) => ({
      name: `num_${i}`,
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        base + i
      ]
    })),
    {
      name: "dog",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        46
      ]
    },
    {
      name: "dog_wait",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      mul: 20,
      frames: [
        46,
        47
      ]
    },
    {
      name: "dog_jump",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      mul: 2,
      frames: [
        47,
        48,
        49,
        49,
        50
      ],
      airFrames: [48, 49]
    },
    {
      name: "cow",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        51
      ]
    },
    {
      name: "cow_wait",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      mul: 20,
      frames: [
        51,
        52,
        51
      ]
    },
    {
      name: "cow_jump",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      mul: 5,
      frames: [
        51,
        53,
        54
      ],
      airFrames: [54]
    },
    {
      name: "cow_sleep",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      mul: 10,
      frames: [
        55
      ]
    },
    {
      name: "wheat",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        56
      ]
    },
    {
      name: "wood",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        57
      ]
    },
    {
      name: "brain",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        58
      ]
    },
    {
      name: "gold",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        59
      ]
    },
    {
      name: "trade",
      imageSource: "./assets/tiles.png",
      spriteSize: [64, 64],
      frames: [
        60
      ]
    }
  ],
  elems: [
    {
      name: "cursor",
      type: "cursor",
      gameObject: {
        pos: [0, 0],
        size: [2, 2]
      },
      animation: {
        name: "triangle"
      },
      mouseFollower: {
        snap: 1
      },
      dynamic: true
    },
    {
      name: "cloud",
      type: "cloud",
      gameObject: {
        pos: [0, 0],
        size: [2, 2]
      },
      group: {
        grid: [SIZE + 1, SIZE + 1]
      },
      animation: {
        name: "cloud"
      },
      spread: {
        animation: "cloud",
        count: [4, 5],
        color: "#ffffffaa",
        size: 1.2
      }
    },
    {
      definition: "sheep",
      owner: 1,
      turn: {
        moves: 1,
        attacks: 1
      }
    },
    {
      name: "grass",
      type: "tile",
      resourcesProduced: {
        wheat: 2
      },
      group: {
        grid: [SIZE + 1, SIZE + 1]
      },
      gameObject: {
        pos: [0, 0],
        size: [2, 2]
      },
      animation: {
        name: "grassland"
      },
      spread: {
        animation: "grass",
        count: [3, 7]
      }
    },
    {
      name: "plain",
      type: "tile_overlay",
      resourcesProduced: {
        wood: 1,
        wheat: -1
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.9
      },
      gameObject: {
        pos: [0, 0],
        size: [2, 2]
      },
      animation: {
        name: "plain"
      },
      spread: {
        animation: "grass",
        count: [3, 7]
      }
    },
    {
      name: "lake",
      type: "tile_overlay",
      resourcesProduced: {
        wheat: -1,
        trade: 2
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.1
      },
      gameObject: {
        pos: [0, 0],
        size: [2, 2]
      },
      animation: {
        name: "lake"
      },
      spread: {
        animation: "wave",
        count: [3, 7]
      },
      branchOut: {
        count: [1, 5],
        chance: 0.2,
        element: {
          definition: "river"
        }
      },
      water: true
    },
    {
      name: "tree",
      type: "decor",
      resourcesProduced: {
        wheat: -1,
        wood: 1
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.1
      },
      condition: {
        tile: "plain",
        noTile: "lake"
      },
      gameObject: {
        pos: [0, 0],
        size: [2, 2]
      },
      animation: {
        name: "tree"
      },
      spread: {
        animation: "tree_leaf",
        count: [50, 100],
        radius: 0.25
      }
    },
    {
      name: "mountain",
      type: "decor",
      resourcesProduced: {
        wheat: -2
      },
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.1
      },
      condition: {
        tile: "plain"
      },
      gameObject: {
        pos: [0, 0],
        size: [2, 2]
      },
      animation: {
        name: "mountain"
      },
      spread: {
        animation: "mountain",
        count: [8, 10],
        radius: 0.3,
        behind: true
      }
    },
    {
      name: "cabana",
      group: {
        grid: [SIZE + 1, SIZE + 1],
        chance: 0.01
      },
      condition: {
        tile: "plain",
        noTile: "lake",
        zeroUnit: true
      },
      definition: "cabana"
    }
  ],
  menu: [
    SHEEP_MENU,
    HOUSE_MENU,
    COW_MENU
  ],
  resources: {
    wheat: WHEAT_RESOURCE,
    wood: WOOD_RESOURCE,
    brain: BRAIN_RESOURCE,
    gold: GOLD_RESOURCE,
    trade: TRADE_RESOURCE
  },
  research: [
    CANINE_RESEARCH,
    BOVINE_RESEARCH,
    WOLVES_RESEARCH,
    BOVINE_RESEARCH,
    TORTOISE_RESEARCH,
    GOAT_RESEARCH,
    SQUIRREL_RESEARCH,
    SKUNK_RESEARCH,
    HORSE_RESEARCH,
    MONKEY_RESEARCH,
    PANDA_RESEARCH,
    PIG_RESEARCH,
    ELEPHANT_RESEARCH,
    BEAVER_RESEARCH,
    OWL_RESEARCH,
    LAMA_RESEARCH,
    EAGLE_RESEARCH,
    RABBIT_RESEARCH
  ]
};
window.worldData = worldData;

// src/index.ts
var gameInit = function() {
};
var gameUpdate = function() {
  manager2.refresh();
};
var postUpdate = function() {
};
var render = function() {
};
var renderPost = function() {
};
var manager2 = new Manager(worldData);
window.manager = manager2;
engineInit(gameInit, gameUpdate, postUpdate, render, renderPost, manager2.animation.imageSources);

//# debugId=E5AB271D23D09AED64756e2164756e21
