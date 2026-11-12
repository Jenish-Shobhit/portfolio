import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SplitHeading from "./SplitHeading";
import { BUILD_STEPS } from "../data/portfolio";

const N = BUILD_STEPS.length;
const pad = (n) => String(n).padStart(2, "0");

function Card({ c, offset, onPick, i }) {
  const style = {
    transform: `translate3d(calc(var(--dx) * ${offset}), calc(var(--dy) * ${offset}), ${-offset * 90}px) rotate(${offset * 2.2}deg)`,
    opacity: offset < 0 ? 0 : 1 - offset * 0.22,
    zIndex: 10 - offset,
    pointerEvents: offset < 0 ? "none" : "auto",
  };
  return (
    <article
      style={style}
      className="deck-card"
      onClick={() => offset > 0 && onPick(i)}
      data-testid={`voice-card-${i}`}
      {...(offset > 0 ? { "data-cursor": "bring up", "data-cursor-name": c.title.toLowerCase() } : {})}
    >
      <div className="flex items-center justify-between">
        <span className="mono text-[11px] tracking-[0.25em] text-[#38bdf8]">STEP {pad(i + 1)}</span>
        <span className="mono text-[11px] tracking-[0.25em] text-muted-foreground">{pad(i + 1)} / {pad(N)}</span>
      </div>
      <h3 className="font-display text-4xl md:text-5xl font-semibold mt-8 tracking-[-0.02em]">{c.title}</h3>
      <p className="mt-6 mono text-[10px] tracking-[0.3em] text-muted-foreground">I SAID</p>
      <p className="mt-2 text-xl md:text-2xl text-foreground/90 font-display leading-snug">{c.said}</p>
      <ul className="mt-8 space-y-3">
        {c.points.map((pt) => (
          <li key={pt} className="flex gap-3 text-[15px] text-muted-foreground">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#38bdf8] shrink-0" />
            {pt}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Controls({ idx, go }) {
  return (
    <>
      <div className="mt-12 font-display text-7xl font-bold tabular-nums tracking-[-0.04em]" data-testid="voice-counter">
        {pad(idx + 1)}
        <span className="text-muted-foreground/40 text-3xl ml-3">/ {pad(N)}</span>
      </div>
      <div className="mt-6 flex gap-1.5" data-testid="voice-progress">
        {BUILD_STEPS.map((c, i) => (
          <button key={c.title} type="button" onClick={() => go(i)} data-testid={`voice-seg-${i}`} data-cursor="jump to" data-cursor-name={c.title.toLowerCase()} aria-label={`Step ${i + 1}: ${c.title}`} className="seg flex-1">
            <span style={{ transform: `scaleX(${i <= idx ? 1 : 0})` }} />
          </button>
        ))}
      </div>
      <div className="mt-10 flex items-center gap-3">
        <button type="button" onClick={() => go(idx - 1)} className="icon-btn" data-testid="voice-prev" data-cursor="go to" data-cursor-name="previous step" aria-label="Previous step"><ChevronLeft size={18} /></button>
        <button type="button" onClick={() => go(idx + 1)} className="icon-btn" data-testid="voice-next" data-cursor="go to" data-cursor-name="next step" aria-label="Next step"><ChevronRight size={18} /></button>
        <span className="ml-3 mono text-[10px] tracking-[0.3em] text-muted-foreground hidden md:inline">← → KEYS</span>
      </div>
    </>
  );
}

export default function VoiceBuild() {
  const [idx, setIdx] = useState(0);
  const sectionRef = useRef(null);
  const swipe = useRef(0);
  const go = (i) => setIdx((i + N) % N);

  useEffect(() => {
    const onKey = (e) => {
      const r = sectionRef.current.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.5 || r.bottom < window.innerHeight * 0.5) return;
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % N);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + N) % N);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section ref={sectionRef} id="voice" data-space="video" data-agent-label="listening · built by voice" className="relative py-40 md:py-60 overflow-hidden" data-testid="voice-section">
      <div className="container-x grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
        <div className="lg:col-span-5">
          <p className="eyebrow">05 — BUILT BY VOICE</p>
          <SplitHeading text="How I built this portfolio." className="h-section mt-6" testid="voice-heading" />
          <p className="mt-6 mono text-[10px] md:text-[11px] tracking-[0.18em] md:tracking-[0.3em] text-muted-foreground whitespace-nowrap" data-testid="voice-tagline">I SPOKE · AGENTS BUILT · I APPROVED</p>
          <Controls idx={idx} go={go} />
        </div>
        <div
          className="lg:col-span-7 deck"
          data-testid="voice-deck"
          onTouchStart={(e) => (swipe.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - swipe.current;
            if (Math.abs(dx) > 45) go(idx + (dx < 0 ? 1 : -1));
          }}
        >
          {BUILD_STEPS.map((c, i) => (
            <Card key={c.title} c={c} i={i} offset={i - idx} onPick={go} />
          ))}
        </div>
      </div>
    </section>
  );
}
