/* Norva living data sculpture — dependency-free WebGL. */
(function () {
  "use strict";

  var canvas = document.querySelector("[data-hero-sculpture]");
  var hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  var gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false
  });
  if (!gl) {
    canvas.classList.add("is-fallback");
    return;
  }

  var ext = gl.getExtension("OES_standard_derivatives");
  if (!ext) {
    canvas.classList.add("is-fallback");
    return;
  }

  var vertexSource = [
    "precision highp float;",
    "attribute vec2 aUv;",
    "attribute vec3 aBary;",
    "uniform float uTime;",
    "uniform float uAspect;",
    "uniform float uLayer;",
    "uniform vec2 uPointer;",
    "varying vec3 vBary;",
    "varying float vDepth;",
    "varying float vPulse;",
    "varying float vSignal;",
    "varying vec3 vPosition;",
    "mat2 rotate2d(float a) {",
    "  float s = sin(a); float c = cos(a);",
    "  return mat2(c, -s, s, c);",
    "}",
    "void main() {",
    "  float longitude = aUv.x * 6.28318530718;",
    "  float latitude = (aUv.y - 0.5) * 3.14159265359;",
    "  float vertical = sin(latitude) * 1.46;",
    "  float ring = cos(latitude) * (0.52 + 0.92 * abs(sin(latitude)));",
    "  float waveA = sin(longitude * 3.0 + latitude * 2.2 + uTime * 0.72);",
    "  float waveB = sin(latitude * 7.0 - longitude * 1.4 - uTime * 0.48);",
    "  float pulse = (1.0 + waveA * 0.16 + waveB * 0.055) * mix(0.76, 1.0, uLayer);",
    "  float twist = longitude + vertical * 1.72 + sin(uTime * 0.42 + vertical * 2.4) * 0.24;",
    "  vec3 p = vec3(",
    "    ring * cos(twist) * pulse,",
    "    vertical + sin(longitude * 2.0 + uTime * 0.55) * ring * 0.055,",
    "    ring * sin(twist) * pulse",
    "  );",
    "  p.x += sin(vertical * 2.7 + uTime * 0.5) * 0.08;",
    "  p.z += cos(longitude * 2.0 - uTime * 0.38) * ring * 0.07;",
    "  p.yz = rotate2d(-0.18 + uPointer.y * 0.2) * p.yz;",
    "  p.xz = rotate2d(uTime * 0.19 + uPointer.x * 0.5 + (1.0 - uLayer) * 0.35) * p.xz;",
    "  float depth = 4.15 - p.z;",
    "  vec2 projected = p.xy / depth * 2.62;",
    "  projected.x /= uAspect;",
    "  gl_Position = vec4(projected, (depth - 4.15) / 2.2, 1.0);",
    "  vBary = aBary;",
    "  vDepth = smoothstep(5.25, 3.1, depth);",
    "  vPulse = waveA * 0.5 + 0.5;",
    "  vSignal = sin(longitude * 1.7 + vertical * 3.4 - uTime * 1.25) * 0.5 + 0.5;",
    "  vPosition = p;",
    "}"
  ].join("\n");

  var fragmentSource = [
    "#extension GL_OES_standard_derivatives : enable",
    "precision highp float;",
    "varying vec3 vBary;",
    "varying float vDepth;",
    "varying float vPulse;",
    "varying float vSignal;",
    "varying vec3 vPosition;",
    "uniform float uLayer;",
    "void main() {",
    "  vec3 derivative = fwidth(vBary);",
    "  vec3 smoothEdge = smoothstep(vec3(0.0), derivative * 1.22, vBary);",
    "  float edge = 1.0 - min(min(smoothEdge.x, smoothEdge.y), smoothEdge.z);",
    "  vec3 ink = vec3(0.055, 0.08, 0.11);",
    "  vec3 blue = vec3(0.184, 0.42, 1.0);",
    "  vec3 electric = vec3(0.36, 0.67, 1.0);",
    "  vec3 color = mix(ink, blue, 0.34 + vDepth * 0.5);",
    "  color = mix(color, electric, vPulse * edge * 0.28);",
    "  float signal = smoothstep(0.9, 1.0, vSignal) * edge;",
    "  color = mix(color, electric, signal * 0.72);",
    "  float fill = 0.024 + vDepth * 0.032;",
    "  float alpha = fill + edge * (0.46 + vDepth * 0.44) + signal * 0.18;",
    "  alpha *= mix(0.34, 1.0, uLayer);",
    "  alpha *= smoothstep(-1.58, -1.28, vPosition.y) * smoothstep(1.58, 1.28, vPosition.y);",
    "  gl_FragColor = vec4(color, alpha);",
    "}"
  ].join("\n");

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("Norva sculpture shader:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  var vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  var fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Norva sculpture program:", gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  var columns = 38;
  var rows = 25;
  var uv = [];
  var bary = [];
  function point(x, y, bx, by, bz) {
    uv.push(x / columns, y / rows);
    bary.push(bx, by, bz);
  }
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns; x++) {
      point(x, y, 1, 0, 0);
      point(x + 1, y, 0, 1, 0);
      point(x, y + 1, 0, 0, 1);
      point(x + 1, y, 1, 0, 0);
      point(x + 1, y + 1, 0, 1, 0);
      point(x, y + 1, 0, 0, 1);
    }
  }

  function bufferAttribute(name, size, values) {
    var location = gl.getAttribLocation(program, name);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }
  bufferAttribute("aUv", 2, uv);
  bufferAttribute("aBary", 3, bary);

  var uTime = gl.getUniformLocation(program, "uTime");
  var uAspect = gl.getUniformLocation(program, "uAspect");
  var uLayer = gl.getUniformLocation(program, "uLayer");
  var uPointer = gl.getUniformLocation(program, "uPointer");
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var visible = true;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(1, Math.round(rect.width * ratio));
    var height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  hero.addEventListener("pointermove", function (event) {
    var rect = hero.getBoundingClientRect();
    pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * -2;
  });
  hero.addEventListener("pointerleave", function () {
    pointer.tx = 0;
    pointer.ty = 0;
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(hero);
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  function draw(now) {
    requestAnimationFrame(draw);
    if (!visible) return;
    resize();
    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(uAspect, canvas.width / canvas.height);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.uniform1f(uTime, reduced ? 1.1 : now * 0.001 + 0.7);
    gl.uniform1f(uLayer, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, uv.length / 2);
    gl.uniform1f(uTime, reduced ? 0.7 : now * 0.001);
    gl.uniform1f(uLayer, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, uv.length / 2);
  }
  requestAnimationFrame(draw);
})();
