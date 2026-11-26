// 3D wireframe globe drawn with plain WebGL (no libraries).
// Flutter calls window.startWebGLGlobe(canvas) for the hero background.
// It returns a function that stops the animation and frees the GPU objects.
(function () {
  'use strict';

  var VERT = [
    'attribute vec3 aPos;',
    'uniform mat4 uMvp;',
    'uniform float uPointSize;',
    'varying float vDepth;',
    'void main() {',
    '  vec4 p = uMvp * vec4(aPos, 1.0);',
    '  gl_Position = p;',
    // 0 = far side of the globe, 1 = near side: used to fade the back lines.
    '  vDepth = clamp(1.0 - (p.z / p.w + 1.0) * 0.5 + 0.5, 0.0, 1.0);',
    '  gl_PointSize = uPointSize * (0.6 + vDepth);',
    '}'
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'uniform vec3 uColor;',
    'uniform float uAlpha;',
    'uniform float uRound;',
    'varying float vDepth;',
    'void main() {',
    '  float a = uAlpha * (0.25 + 0.75 * vDepth);',
    '  if (uRound > 0.5) {',
    '    vec2 c = gl_PointCoord - 0.5;',
    '    float d = length(c);',
    '    if (d > 0.5) discard;',
    '    a *= smoothstep(0.5, 0.0, d);',
    '  }',
    '  gl_FragColor = vec4(uColor * a, a);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('WebGL globe shader error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  // Latitude and longitude rings of a unit sphere, as line segments.
  function sphereLines(latCount, lonCount, steps) {
    var out = [];
    var i, j, a0, a1, phi, theta;
    for (i = 1; i < latCount; i++) {
      phi = Math.PI * i / latCount - Math.PI / 2;
      for (j = 0; j < steps; j++) {
        a0 = 2 * Math.PI * j / steps;
        a1 = 2 * Math.PI * (j + 1) / steps;
        out.push(Math.cos(phi) * Math.cos(a0), Math.sin(phi), Math.cos(phi) * Math.sin(a0));
        out.push(Math.cos(phi) * Math.cos(a1), Math.sin(phi), Math.cos(phi) * Math.sin(a1));
      }
    }
    for (i = 0; i < lonCount; i++) {
      theta = 2 * Math.PI * i / lonCount;
      for (j = 0; j < steps / 2; j++) {
        a0 = Math.PI * j / (steps / 2) - Math.PI / 2;
        a1 = Math.PI * (j + 1) / (steps / 2) - Math.PI / 2;
        out.push(Math.cos(a0) * Math.cos(theta), Math.sin(a0), Math.cos(a0) * Math.sin(theta));
        out.push(Math.cos(a1) * Math.cos(theta), Math.sin(a1), Math.cos(a1) * Math.sin(theta));
      }
    }
    return new Float32Array(out);
  }

  // Evenly spread points on the sphere (Fibonacci lattice).
  function spherePoints(n, r) {
    var out = [];
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < n; i++) {
      var y = 1 - (i / (n - 1)) * 2;
      var rad = Math.sqrt(1 - y * y);
      var t = golden * i;
      out.push(Math.cos(t) * rad * r, y * r, Math.sin(t) * rad * r);
    }
    return new Float32Array(out);
  }

  // Tilted orbit ring around the globe.
  function orbitRing(radius, tilt, steps) {
    var out = [];
    for (var j = 0; j < steps; j++) {
      var a0 = 2 * Math.PI * j / steps;
      var a1 = 2 * Math.PI * (j + 1) / steps;
      [a0, a1].forEach(function (a) {
        var x = Math.cos(a) * radius;
        var z = Math.sin(a) * radius;
        out.push(x, -z * Math.sin(tilt), z * Math.cos(tilt));
      });
    }
    return new Float32Array(out);
  }

  // Column-major 4x4 matrix helpers.
  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  }
  function multiply(a, b) {
    var o = new Array(16);
    for (var c = 0; c < 4; c++) {
      for (var r = 0; r < 4; r++) {
        o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
      }
    }
    return o;
  }
  function rotY(a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }
  function rotX(a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }
  function translate(x, y, z) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
  }

  window.startWebGLGlobe = function (canvas) {
    var gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) return function () {};

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return function () {};
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return function () {};
    gl.useProgram(prog);

    var aPos = gl.getAttribLocation(prog, 'aPos');
    var uMvp = gl.getUniformLocation(prog, 'uMvp');
    var uColor = gl.getUniformLocation(prog, 'uColor');
    var uAlpha = gl.getUniformLocation(prog, 'uAlpha');
    var uPointSize = gl.getUniformLocation(prog, 'uPointSize');
    var uRound = gl.getUniformLocation(prog, 'uRound');

    function buffer(data) {
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return { buf: b, count: data.length / 3 };
    }

    var globe = buffer(sphereLines(12, 18, 72));
    var dots = buffer(spherePoints(420, 1.0));
    var ring1 = buffer(orbitRing(1.45, 0.45, 128));
    var ring2 = buffer(orbitRing(1.7, -0.3, 128));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mouseX = 0, mouseY = 0, tiltX = 0, tiltY = 0;
    function onMove(e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener('pointermove', onMove, { passive: true });

    var dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    // With reduced motion only one frame is drawn, so redraw when the size changes.
    var ro = window.ResizeObserver ? new ResizeObserver(function () {
      if (reduceMotion && running) requestAnimationFrame(frame);
    }) : null;
    if (ro) ro.observe(canvas);

    function draw(obj, mode, color, alpha, mvp, pointSize) {
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.buf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(uMvp, false, mvp);
      gl.uniform3fv(uColor, color);
      gl.uniform1f(uAlpha, alpha);
      gl.uniform1f(uPointSize, pointSize || 1);
      gl.uniform1f(uRound, mode === gl.POINTS ? 1 : 0);
      gl.drawArrays(mode, 0, obj.count);
    }

    var running = true;
    var start = performance.now();
    var raf = 0;

    function frame(now) {
      if (!running) return;
      resize();
      var w = canvas.width, h = canvas.height;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      var t = reduceMotion ? 0 : (now - start) / 1000;
      tiltX += (mouseY * 0.25 - tiltX) * 0.05;
      tiltY += (mouseX * 0.35 - tiltY) * 0.05;

      // Place the globe around the circular photo. These numbers mirror the
      // hero layout in lib/main.dart (_responsiveHome / _homeImage):
      //   desktop (>= 900px): photo is 35% of the width, in the right column
      //   tablet (600-899px): photo is 40% of the width, top centre
      //   mobile (< 600px):   photo is 60% of the width, top centre
      var cw = canvas.clientWidth, ch = canvas.clientHeight;
      var photo, px, py;
      if (cw >= 900) {
        photo = 0.35 * cw;
        var content = 0.86 * cw - 20;
        px = 0.07 * cw + content * 5 / 6 + 20;
        py = ch / 2;
      } else {
        var top = cw < 600 ? 40 : 80;
        photo = (cw < 600 ? 0.6 : 0.4) * cw;
        px = cw / 2;
        py = top + photo / 2;
      }
      var radiusPx = photo * 0.62; // a little larger than the photo

      var aspect = w / h;
      var fov = Math.PI / 6; // narrow field of view keeps the sphere round
      var proj = perspective(fov, aspect, 0.1, 100);
      var tanHalf = Math.tan(fov / 2);
      var dist = (ch / 2) / (radiusPx * tanHalf);
      var halfH = tanHalf * dist;
      var cx = ((px / cw) * 2 - 1) * halfH * aspect;
      var cy = (1 - (py / ch) * 2) * halfH;
      var view = translate(cx, cy, -dist);

      var spin = rotY(t * 0.18 + tiltY);
      var tilt = rotX(0.35 + tiltX);
      var model = multiply(tilt, spin);
      var mvp = multiply(proj, multiply(view, model));

      var indigo = [0.36, 0.42, 1.0];
      var violet = [0.62, 0.45, 1.0];
      var cyan = [0.35, 0.85, 1.0];

      draw(globe, gl.LINES, indigo, 0.55, mvp);
      draw(dots, gl.POINTS, violet, 0.9, mvp, 2.2 * dpr);

      var ringModel1 = multiply(rotX(0.2 + tiltX), rotY(-t * 0.3 + tiltY));
      var ringModel2 = multiply(rotX(-0.15 + tiltX), rotY(t * 0.22 + tiltY));
      draw(ring1, gl.LINES, cyan, 0.35, multiply(proj, multiply(view, ringModel1)));
      draw(ring2, gl.LINES, violet, 0.25, multiply(proj, multiply(view, ringModel2)));

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return function stop() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      if (ro) ro.disconnect();
      [globe, dots, ring1, ring2].forEach(function (o) { gl.deleteBuffer(o.buf); });
      gl.deleteProgram(prog);
    };
  };
})();
