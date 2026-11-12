export const AGENTS = [
  { id: "flow", name: "Wispr Flow", role: "my voice, typed", ring: 0, phase: 0.6, color: "#f43f5e", out: "transcribe the brief", back: "brief ready" },
  { id: "claude", name: "Claude", role: "reasoning and code", ring: 1, phase: 2.2, color: "#fbbf24", out: "draft the shader", back: "draft ready for review" },
  { id: "emergent", name: "Emergent", role: "builds the app", ring: 1, phase: 5.3, color: "#38bdf8", out: "build the section", back: "live on preview" },
  { id: "tests", name: "Test agent", role: "verifies every change", ring: 2, phase: 1.1, color: "#a3e635", out: "check mobile and cursor", back: "all checks pass" },
  { id: "github", name: "GitHub", role: "where it ships", ring: 2, phase: 4.2, color: "#e2e8f0", out: "ship it", back: "release published" },
];

const RINGS = [0.36, 0.6, 0.86];
const TILT = 0.42;

export function createOrbit(canvas, { onLog, onFocus }) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let R = 0;
  let raf;
  let running = false;
  let hover = null;
  let last = performance.now();
  let clock = 0;
  let nextSend = 0.15;
  const packets = [];
  const pulses = [];
  const agents = AGENTS.map((a) => ({ ...a, angle: a.phase, x: 0, y: 0, z: 0, glow: 0 }));

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    R = Math.min((w / 2 - 44) / RINGS[2], (h / 2 - 46) / (RINGS[2] * TILT));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const place = (a) => {
    const r = RINGS[a.ring] * R;
    a.x = w / 2 + Math.cos(a.angle) * r;
    a.y = h / 2 + Math.sin(a.angle) * r * TILT;
    a.z = Math.sin(a.angle);
  };

  const send = () => {
    const a = agents[Math.floor(Math.random() * agents.length)];
    packets.push({ a, p: 0, dir: 1, trail: [] });
    onLog?.(`→ ${a.name.toLowerCase()} · ${a.out}`, a.color);
  };

  const step = (dt) => {
    clock += dt;
    agents.forEach((a) => {
      const slow = hover === a ? 0.15 : 1;
      a.angle += (0.32 / Math.pow(RINGS[a.ring] / RINGS[0], 1.5)) * dt * slow;
      a.glow = Math.max(a.glow - dt * 1.6, 0);
      place(a);
    });
    if (clock > nextSend) {
      send();
      nextSend = clock + 1.1 + Math.random() * 0.9;
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const k = packets[i];
      k.p += dt * 0.9;
      const e = k.p < 0.5 ? 2 * k.p * k.p : 1 - Math.pow(-2 * k.p + 2, 2) / 2;
      const from = k.dir > 0 ? { x: w / 2, y: h / 2 } : k.a;
      const to = k.dir > 0 ? k.a : { x: w / 2, y: h / 2 };
      const bend = Math.sin(e * Math.PI) * 26 * k.dir;
      const x = from.x + (to.x - from.x) * e;
      const y = from.y + (to.y - from.y) * e - bend;
      k.trail.unshift([x, y]);
      if (k.trail.length > 14) k.trail.pop();
      if (k.p >= 1) {
        if (k.dir > 0) {
          k.a.glow = 1;
          pulses.push({ x: k.a.x, y: k.a.y, t: 0, c: k.a.color });
          packets.splice(i, 1);
          setTimeout(() => {
            packets.push({ a: k.a, p: 0, dir: -1, trail: [] });
          }, 420);
        } else {
          pulses.push({ x: w / 2, y: h / 2, t: 0, c: "#f8fafc" });
          onLog?.(`← ${k.a.name.toLowerCase()} · ${k.a.back}`, k.a.color);
          packets.splice(i, 1);
        }
      }
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].t += dt;
      if (pulses[i].t > 1) pulses.splice(i, 1);
    }
  };

  const drawRing = (r) => {
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, r * R, r * R * TILT, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(248,250,252,0.09)";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawAgent = (a) => {
    const size = 5 + (a.z + 1) * 1.6 + (hover === a ? 3 : 0);
    const alpha = 0.55 + (a.z + 1) * 0.22;
    const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, size * 5);
    g.addColorStop(0, a.color + "55");
    g.addColorStop(1, a.color + "00");
    ctx.globalAlpha = alpha * (0.6 + a.glow * 0.8);
    ctx.fillStyle = g;
    ctx.fillRect(a.x - size * 5, a.y - size * 5, size * 10, size * 10);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = a.color;
    ctx.beginPath();
    ctx.arc(a.x, a.y, size, 0, Math.PI * 2);
    ctx.fill();
    if (w >= 480 || hover === a) {
      ctx.globalAlpha = hover === a ? 1 : alpha * 0.9;
      ctx.fillStyle = hover === a ? "#f8fafc" : "#94a3b8";
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText(a.name.toUpperCase(), a.x, a.y + size + 16);
    }
    ctx.globalAlpha = 1;
  };

  const drawCore = () => {
    const pulse = 1 + Math.sin(clock * 2.2) * 0.04;
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, R * 0.3);
    g.addColorStop(0, "rgba(248,250,252,0.35)");
    g.addColorStop(0.25, "rgba(56,189,248,0.12)");
    g.addColorStop(1, "rgba(56,189,248,0)");
    ctx.fillStyle = g;
    ctx.fillRect(w / 2 - R * 0.3, h / 2 - R * 0.3, R * 0.6, R * 0.6);
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 9 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText("ME", w / 2, h / 2 + 28);
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    RINGS.forEach(drawRing);
    const sorted = [...agents].sort((a, b) => a.z - b.z);
    sorted.filter((a) => a.z < 0).forEach(drawAgent);
    drawCore();
    packets.forEach((k) => {
      k.trail.forEach(([x, y], i) => {
        ctx.globalAlpha = (1 - i / k.trail.length) * 0.9;
        ctx.fillStyle = k.dir > 0 ? k.a.color : "#f8fafc";
        ctx.beginPath();
        ctx.arc(x, y, 2.4 * (1 - i / k.trail.length) + 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.globalAlpha = 1;
    pulses.forEach((p) => {
      ctx.globalAlpha = 1 - p.t;
      ctx.strokeStyle = p.c;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 6 + p.t * 34, (6 + p.t * 34) * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    sorted.filter((a) => a.z >= 0).forEach(drawAgent);
  };

  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    step(dt);
    draw();
  };

  const pick = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    const x = cx - r.left;
    const y = cy - r.top;
    let best = null;
    let bd = 30;
    agents.forEach((a) => {
      const d = Math.hypot(a.x - x, a.y - y);
      if (d < bd) {
        bd = d;
        best = a;
      }
    });
    return best;
  };
  const onMove = (e) => {
    const a = pick(e.clientX, e.clientY);
    if (a !== hover) {
      hover = a;
      onFocus?.(a ? a.id : null);
      canvas.dataset.hover = a ? a.id : "";
    }
  };
  const onLeave = () => {
    hover = null;
    onFocus?.(null);
  };

  resize();
  agents.forEach(place);
  draw();
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", resize);

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      nextSend = Math.min(nextSend, clock + 0.15);
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    focus(id) {
      hover = agents.find((a) => a.id === id) || null;
    },
    dispose() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    },
  };
}
