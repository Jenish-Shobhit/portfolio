import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { dustFrag, dustVert, starFrag, starVert } from "./shaders";
import { KEYS, SPACE, blend } from "./spaceStates";

const FOV = 35;
const damp = (v, t, k, dt) => v + (t - v) * (1 - Math.exp(-k * dt));
const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

function sampleName(w, h) {
  const mobile = w < 768;
  const lines = mobile ? ["JENISH", "SHOBHIT"] : ["JENISH SHOBHIT"];
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  let size = Math.min(mobile ? w * 0.24 : w * 0.11, mobile ? 150 : 200);
  const font = (s) => `700 ${s}px "Space Grotesk", sans-serif`;
  ctx.font = font(size);
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const fit = mobile ? 0.82 : 0.86;
  if (widest > w * fit) size *= (w * fit) / widest;
  ctx.font = font(size);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lh = size * 0.92;
  const y0 = h * 0.44 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, w / 2, y0 + i * lh));

  const data = ctx.getImageData(0, 0, w, h).data;
  const filled = (x, y) => data[(Math.round(y) * w + Math.round(x)) * 4 + 3] > 140;
  const cap = mobile ? 24000 : 32000;
  let n = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 140) n++;
  const step = Math.max(1, Math.sqrt(n / cap));
  const pts = [];
  for (let y = 0; y < h - 1; y += step) {
    for (let x = 0; x < w - 1; x += step) {
      if (filled(x, y)) pts.push(x, y);
    }
  }
  const total = pts.length / 2;
  const keep = Math.min(total, cap);
  const j = 0.9;
  const out = new Float32Array(keep * 3);
  for (let i = 0; i < keep; i++) {
    const k = Math.min(Math.floor((i / keep) * total + Math.random() * (total / keep)), total - 1) * 2;
    out[i * 3] = pts[k] - w / 2 + (Math.random() - 0.5) * step * j;
    out[i * 3 + 1] = -(pts[k + 1] - h / 2) + (Math.random() - 0.5) * step * j;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return { positions: out, count: keep, step, textBottom: y0 + (lines.length - 1) * lh + size * 0.5 };
}

function galaxyPoint() {
  if (Math.random() < 0.16) {
    const r = Math.pow(Math.random(), 2.2) * 0.24;
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return [s * Math.cos(th) * r, u * r * 0.5, s * Math.sin(th) * r, 0];
  }
  const arm = Math.floor(Math.random() * 3);
  const r = 0.1 + Math.pow(Math.random(), 0.85) * 0.9;
  const th = arm * ((Math.PI * 2) / 3) + r * 5.4 + gauss() * 0.2 * (0.4 + r);
  return [Math.cos(th) * r + gauss() * 0.018, gauss() * 0.028 * (1.3 - r), Math.sin(th) * r + gauss() * 0.018, 1];
}

function buildStars(sample) {
  const { positions, count } = sample;
  const g = new THREE.BufferGeometry();
  const gal = new Float32Array(count * 4);
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    gal.set(galaxyPoint(), i * 4);
    rand.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aGalaxy", new THREE.BufferAttribute(gal, 4));
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  return g;
}

function buildDust(count) {
  const g = new THREE.BufferGeometry();
  const p = new Float32Array(count * 3);
  const r = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    p.set([(Math.random() - 0.5) * 3200, (Math.random() - 0.5) * 2000, Math.random() * 3600 - 3000], i * 3);
    r[i] = Math.random();
  }
  g.setAttribute("position", new THREE.BufferAttribute(p, 3));
  g.setAttribute("aRand", new THREE.BufferAttribute(r, 1));
  return g;
}

function readPose(cache) {
  const vh = window.innerHeight;
  const mid = vh * 0.5;
  const els = cache.els;
  if (!els.length) return SPACE.top;
  for (let i = 0; i < els.length; i++) {
    const r = els[i].getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) {
      const a = SPACE[els[i].dataset.space] || SPACE.top;
      const next = els[i + 1] ? SPACE[els[i + 1].dataset.space] : null;
      const frac = (mid - r.top) / r.height;
      const k = next ? Math.min(Math.max((frac - 0.55) / 0.45, 0), 1) : 0;
      return next ? blend(a, next, k * k * (3 - 2 * k)) : a;
    }
  }
  const first = els[0].getBoundingClientRect();
  return SPACE[(first.top > mid ? els[0] : els[els.length - 1]).dataset.space] || SPACE.top;
}

export function createUniverse(container, { getMode, onLost, onReady }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  let pr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(pr);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("data-testid", "universe-canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 8000);
  const u = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uScatter: { value: 0 },
    uSize: { value: 1.9 },
    uGalSize: { value: 1.9 },
    uPR: { value: pr },
    uMouse: { value: new THREE.Vector2(-9999, -9999) },
    uVel: { value: new THREE.Vector2() },
    uHover: { value: 0 },
    uClick: { value: new THREE.Vector3(0, 0, 99) },
    uView: { value: new THREE.Vector2(1, 1) },
    uCamDist: { value: 1000 },
    uScrollY: { value: 0 },
    uGal: { value: new THREE.Vector4(0.5, -0.6, -700, 1.15) },
    uGalRot: { value: new THREE.Vector3(1.3, -0.35, 0) },
    uDim: { value: 0.5 },
    uLens: { value: 0.55 },
  };
  const du = { uTime: u.uTime, uPR: u.uPR, uTravel: { value: 0 }, uWarp: { value: 0 }, uDust: { value: 1 } };
  const starMat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: starVert, fragmentShader: starFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const dustMat = new THREE.ShaderMaterial({ uniforms: du, vertexShader: dustVert, fragmentShader: dustFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const dust = new THREE.Points(buildDust(window.innerWidth < 768 ? 1400 : 2600), dustMat);
  dust.frustumCulled = false;
  scene.add(dust);
  let stars = null;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.26, 0.32, 0.32);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const mode0 = getMode();
  const s = {
    w: 0, h: 0, mx: -9999, my: -9999, smx: -9999, smy: -9999, px: 0, py: 0,
    morph: mode0 === "home" && !reduced ? 0 : 1, tw: { from: mode0 === "home" && !reduced ? 0 : 1, to: 1, at: performance.now() + 900, dur: 2600 },
    scatter: mode0 === "home" ? 0 : 1, clickAt: -99, spin: 0, travel: 0, warp: 0, vel: 0,
    lastY: window.scrollY, pose: { ...SPACE[mode0 === "home" ? "top" : "case"] },
    frames: 0, slow: 0, degraded: false,
  };
  const cache = { els: [], at: 0 };

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    // DevTools and orientation changes can briefly give the canvas no size.
    if (w <= 0 || h <= 0) return;
    const rebuild = !stars || w !== s.w || Math.abs(h - s.h) > 120;
    s.w = w;
    s.h = h;
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    camera.aspect = w / h;
    const dist = h / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    camera.position.set(0, 0, dist);
    camera.updateProjectionMatrix();
    u.uView.value.set(w, h);
    u.uCamDist.value = dist;
    bloom.strength = w < 768 ? 0.12 : 0.16;
    bloom.radius = w < 768 ? 0.16 : 0.22;
    if (!rebuild) return;
    const sample = sampleName(w, h);
    u.uSize.value = sample.step * 2.3;
    u.uGalSize.value = w < 768 ? 1.35 : 1.9;
    if (stars) {
      stars.geometry.dispose();
      scene.remove(stars);
    }
    stars = new THREE.Points(buildStars(sample), starMat);
    stars.frustumCulled = false;
    scene.add(stars);
    onReady?.({ textBottom: sample.textBottom });
  };

  const onMove = (e) => {
    if (e.pointerType === "touch" && (s.scatter > 0.4 || !s.touching)) return;
    s.mx = e.clientX - s.w / 2;
    s.my = -(e.clientY - s.h / 2);
    if (s.smx < -9000) {
      s.smx = s.mx;
      s.smy = s.my;
    }
    s.px = (s.mx / s.w) * 2;
    s.py = (s.my / s.h) * 2;
  };
  const onLeave = () => {
    s.mx = -9999;
    s.my = -9999;
  };
  const onTouchEnd = (e) => {
    if (e.pointerType !== "touch") return;
    s.touching = false;
    onLeave();
  };
  const onDown = (e) => {
    if (e.pointerType === "touch") {
      s.touching = true;
      if (s.scatter < 0.4) {
        s.mx = s.smx = e.clientX - s.w / 2;
        s.my = s.smy = -(e.clientY - s.h / 2);
      }
    }
    if (e.target.closest?.("a,button,input,textarea,[data-no-ripple]")) return;
    u.uClick.value.set(e.clientX - s.w / 2, -(e.clientY - s.h / 2), 0);
    s.clickAt = performance.now();
  };

  let raf;
  let last = performance.now();
  const t0 = last;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (document.hidden) {
      last = now;
      return;
    }
    const raw = Math.min((now - last) / 1000, 0.25);
    const dt = Math.min(raw, 0.05);
    last = now;
    const t = ((now - t0) / 1000) * (reduced ? 0.15 : 1);
    u.uTime.value = t;
    const mode = getMode();
    const y = window.scrollY;

    const tw = s.tw;
    const kk = Math.min(Math.max((now - tw.at) / tw.dur, 0), 1);
    s.morph = tw.from + (tw.to - tw.from) * kk;
    u.uMorph.value = s.morph;

    const scT = mode === "home" ? Math.min(y / (s.h * 0.85), 1) : 1;
    s.scatter = damp(s.scatter, scT, Math.abs(scT - s.scatter) > 0.45 ? 1.3 : 7, raw);
    u.uScatter.value = s.scatter;
    u.uScrollY.value = mode === "home" ? y : 0;

    if (now - cache.at > 400) {
      cache.els = Array.from(document.querySelectorAll("[data-space]"));
      cache.at = now;
    }
    const target = readPose(cache);
    KEYS.forEach((k) => (s.pose[k] = damp(s.pose[k], target[k], 2.4, raw)));
    const p = s.pose;
    const phone = s.w < 768;
    const quiet = phone && p.dim < 0.9;
    u.uGal.value.set(p.x * (quiet ? 1.35 : 1), p.y, p.z, p.s);
    s.spin = damp(s.spin, y * 0.00032, 3, raw);
    u.uGalRot.value.set(p.tilt + s.py * 0.04, p.roll + s.px * 0.04, s.spin);
    u.uDim.value = p.dim * (quiet ? 0.65 : 1);

    const v = y - s.lastY;
    s.lastY = y;
    s.vel = damp(s.vel, v, 10, raw);
    s.warp = damp(s.warp, Math.min(Math.abs(s.vel) / 45, 1), 5, raw);
    du.uWarp.value = reduced ? 0 : s.warp;
    s.travel = damp(s.travel, y * 0.45, 4, raw);
    du.uTravel.value = s.travel;
    du.uDust.value = 0.5 + 0.5 * Math.max(1 - s.scatter, p.dim);

    const has = s.mx > -9000;
    const pmx = s.smx;
    const pmy = s.smy;
    if (has) {
      s.smx = damp(s.smx, s.mx, 9, dt);
      s.smy = damp(s.smy, s.my, 9, dt);
    }
    u.uMouse.value.set(s.smx, s.smy);
    const vel = u.uVel.value;
    vel.x += ((s.smx - pmx) * 6 - vel.x) * 0.15;
    vel.y += ((s.smy - pmy) * 6 - vel.y) * 0.15;
    u.uHover.value = damp(u.uHover.value, has ? 1 : 0, 4, dt);
    u.uClick.value.z = (now - s.clickAt) / 1000;

    const dist = u.uCamDist.value;
    camera.position.x = damp(camera.position.x, s.px * 28, 2.5, dt);
    camera.position.y = damp(camera.position.y, s.py * 18, 2.5, dt);
    camera.position.z = dist - Math.min(s.scatter, 1) * dist * 0.12;
    camera.lookAt(0, 0, 0);
    const calm = s.scatter > 0.995 && p.dim < 0.6 && s.warp < 0.02 && Math.abs(vel.x) + Math.abs(vel.y) < 1 && now - s.clickAt > 2000;
    s.odd = !s.odd;
    if (calm && s.odd) return;
    composer.render();

    s.frames++;
    if (!s.degraded && s.frames > 60 && s.frames < 180) {
      s.slow = s.slow * 0.95 + (raw > 0.034 ? 1 : 0) * 0.05;
      if (s.frames === 179 && s.slow > 0.6) {
        s.degraded = true;
        pr = 1;
        renderer.setPixelRatio(1);
        composer.setPixelRatio(1);
        u.uPR.value = 1;
        bloom.enabled = false;
      }
    }
  };

  const onLostCtx = (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    onLost?.();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLostCtx);
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onTouchEnd, { passive: true });
  window.addEventListener("pointercancel", onTouchEnd, { passive: true });
  resize();
  raf = requestAnimationFrame(tick);

  return {
    speakAgain() {
      const now = performance.now();
      s.tw = { from: s.morph, to: 0, at: now, dur: 900 };
      setTimeout(() => (s.tw = { from: s.morph, to: 1, at: performance.now(), dur: 2400 }), 1300);
    },
    debug: () => ({ scatter: s.scatter, morph: s.morph, pose: { ...s.pose }, degraded: s.degraded, warp: s.warp }),
    dispose() {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("webglcontextlost", onLostCtx);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onTouchEnd);
      window.removeEventListener("pointercancel", onTouchEnd);
      window.removeEventListener("pointerdown", onDown);
      stars?.geometry.dispose();
      dust.geometry.dispose();
      starMat.dispose();
      dustMat.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
