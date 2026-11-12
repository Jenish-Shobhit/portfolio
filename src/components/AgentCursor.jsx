import { useEffect, useRef, useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz/·_<>";
const SELECTOR = "a, button, [data-cursor]";
const MAX_W = 440;
const MAX_H = 170;

function spring(s, target, k, c, dt) {
  const a = k * (target - s.x) - c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
}

function labelFor(el) {
  const name = (el.dataset.cursorName || el.getAttribute("aria-label") || el.textContent || "link").trim().replace(/\s+/g, " ").slice(0, 30);
  return `${el.dataset.cursor || "open"} ${name}`;
}

function radiusOf(el) {
  const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
  return Math.min(r + 6, 40);
}

export default function AgentCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const tagRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("agent-cursor");
    const st = {
      mx: window.innerWidth / 2, my: window.innerHeight / 2, seen: false,
      x: { x: 0, v: 0 }, y: { x: 0, v: 0 }, w: { x: 34, v: 0 }, h: { x: 34, v: 0 },
      tx: { x: 0, v: 0 }, ty: { x: 0, v: 0 },
      el: null, big: false, label: "exploring the page", section: "exploring the page", shown: "", scr: 0, down: false,
    };
    let raf;
    let last = performance.now();

    const setLabel = (text) => {
      if (text === st.label) return;
      st.label = text;
      st.scr = performance.now();
    };
    const onMove = (e) => {
      st.mx = e.clientX;
      st.my = e.clientY;
      if (!st.seen) {
        st.seen = true;
        [st.x.x, st.y.x, st.tx.x, st.ty.x] = [st.mx, st.my, st.mx, st.my];
        document.documentElement.classList.add("cursor-in");
      }
    };
    const onOver = (e) => {
      const el = e.target.closest?.(SELECTOR) || null;
      st.el = el;
      if (el) {
        const r = el.getBoundingClientRect();
        st.big = r.width > MAX_W || r.height > MAX_H;
        st.radius = radiusOf(el);
        setLabel(labelFor(el));
      } else setLabel(st.section);
    };
    const onLeaveDoc = () => document.documentElement.classList.remove("cursor-in");
    const onEnterDoc = () => st.seen && document.documentElement.classList.add("cursor-in");
    const onDown = () => (st.down = true);
    const onUp = () => (st.down = false);

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting || !en.target.dataset.agentLabel) return;
          st.section = en.target.dataset.agentLabel;
          if (!st.el) setLabel(st.section);
        }),
      { rootMargin: "-45% 0px -45% 0px" }
    );

    const scramble = (now) => {
      const p = Math.min((now - st.scr) / 320, 1);
      const full = `▸ ${st.label}`;
      if (p >= 1) return full;
      const n = Math.floor(full.length * p);
      let out = full.slice(0, n);
      for (let i = n; i < full.length; i++) out += full[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      return out;
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      let cx = st.mx;
      let cy = st.my;
      let tw = st.down ? 26 : 34;
      let th = tw;
      let radius = 999;
      const targeting = st.el && st.el.isConnected && !st.big;
      if (st.el && !st.el.isConnected) {
        st.el = null;
        setLabel(st.section);
      }
      if (targeting) {
        const r = st.el.getBoundingClientRect();
        cx = r.left + r.width / 2 + (st.mx - (r.left + r.width / 2)) * 0.12;
        cy = r.top + r.height / 2 + (st.my - (r.top + r.height / 2)) * 0.12;
        tw = r.width + 14;
        th = r.height + 14;
        radius = st.radius;
      } else if (st.el && st.big) {
        tw = th = st.down ? 52 : 64;
      }
      spring(st.x, cx, 420, 30, dt);
      spring(st.y, cy, 420, 30, dt);
      spring(st.w, tw, 300, 26, dt);
      spring(st.h, th, 300, 26, dt);
      spring(st.tx, st.mx, 140, 22, dt);
      spring(st.ty, st.my, 140, 22, dt);

      const ring = ringRef.current;
      const dot = dotRef.current;
      const tag = tagRef.current;
      if (!ring || !dot || !tag) return;
      const speed = Math.hypot(st.x.v, st.y.v);
      const stretch = targeting ? 0 : Math.min(speed / 3200, 0.4);
      const ang = Math.atan2(st.y.v, st.x.v);
      ring.style.width = `${st.w.x}px`;
      ring.style.height = `${st.h.x}px`;
      ring.style.borderRadius = radius === 999 ? "999px" : `${radius}px`;
      ring.style.transform = `translate3d(${st.x.x - st.w.x / 2}px,${st.y.x - st.h.x / 2}px,0) rotate(${ang}rad) scale(${1 + stretch},${1 - stretch * 0.55}) rotate(${-ang}rad)`;
      ring.classList.toggle("is-target", !!targeting);
      ring.classList.toggle("is-big", !!(st.el && st.big));
      dot.style.transform = `translate3d(${st.mx}px,${st.my}px,0) scale(${targeting ? 0 : 1})`;
      const text = scramble(now);
      if (text !== st.shown) {
        tag.textContent = text;
        st.shown = text;
      }
      const flip = st.tx.x > window.innerWidth - tag.offsetWidth - 48;
      const ox = flip ? -tag.offsetWidth - 18 : 18;
      tag.style.transform = `translate3d(${st.tx.x + ox}px,${st.ty.x + 22}px,0)`;
      tag.classList.toggle("is-hot", !!st.el);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    document.documentElement.addEventListener("mouseenter", onEnterDoc);
    const observe = () => document.querySelectorAll("[data-agent-label]").forEach((el) => io.observe(el));
    observe();
    const t = setTimeout(observe, 800);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      document.documentElement.removeEventListener("mouseenter", onEnterDoc);
      io.disconnect();
      document.documentElement.classList.remove("agent-cursor", "cursor-in");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div className="agent-cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="agent-ring" data-testid="agent-cursor-ring" />
      <div ref={dotRef} className="agent-dot" data-testid="agent-cursor-dot" />
      <div ref={tagRef} className="agent-tag" data-testid="agent-cursor-tag">
        ▸ exploring the page
      </div>
    </div>
  );
}
