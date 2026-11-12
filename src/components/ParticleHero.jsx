import { useEffect, useRef, useState } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import { universeBus } from "../three/universeBus";
import Magnetic from "./Magnetic";

const TAGS = ["macOS", "Rust", "Agents", "The web"];

export default function ParticleHero() {
  const ref = useRef(null);
  const [info, setInfo] = useState(null);
  const [listening, setListening] = useState(false);

  useEffect(() => universeBus.subscribe(setInfo), []);

  useEffect(() => {
    const els = ref.current.querySelectorAll(".hero-fade");
    const onScroll = () => {
      const p = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
      els.forEach((el) => {
        el.style.opacity = 1 - p;
        el.style.transform = `translate3d(0,${-p * 40}px,0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const speak = () => {
    universeBus.speakAgain();
    setListening(true);
    setTimeout(() => setListening(false), 1600);
  };

  const top = info?.textBottom ? info.textBottom + 40 : null;

  return (
    <section
      ref={ref}
      id="top"
      data-space="top"
      data-agent-label="listening"
      data-testid="hero-section"
      className="relative h-[100svh] min-h-[600px] overflow-hidden touch-pan-y"
    >
      <h1 className="sr-only">Jenish Shobhit</h1>
      <div className={`boot ${info ? "is-done" : ""}`} aria-hidden="true" data-testid="hero-boot">
        <div className="boot-wave">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
        <span className="mono text-[10px] tracking-[0.35em] text-muted-foreground">TUNING IN</span>
      </div>
      {info?.failed && (
        <div className="absolute inset-x-0 top-[44%] -translate-y-1/2 text-center font-display font-bold tracking-[-0.03em] text-[15vw] md:text-[9vw] leading-[0.92]" data-testid="hero-fallback-name">
          JENISH<br className="md:hidden" /> SHOBHIT
        </div>
      )}
      <div className="hero-vignette pointer-events-none absolute inset-0" />

      <div
        className={`hero-fade hero-cta absolute inset-x-0 flex flex-col items-center gap-8 px-6 ${top ? "is-placed" : ""}`}
        style={{ top: top ?? "64%" }}
      >
        <ul className="flex items-center gap-3 md:gap-5 mono text-[10px] md:text-[11px] tracking-[0.3em] text-muted-foreground" data-testid="hero-tags">
          {TAGS.map((t, i) => (
            <li key={t} className="flex items-center gap-3 md:gap-5">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-[#38bdf8]/70" />}
              {t.toUpperCase()}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Magnetic>
            <a href="#work" data-testid="hero-cta-work" data-cursor="scroll to" data-cursor-name="the work" className="btn-pill btn-pill-solid">
              Explore the work
            </a>
          </Magnetic>
          <Magnetic>
            <button
              type="button"
              onClick={speak}
              data-testid="hero-say-again-button"
              data-cursor="replay"
              data-cursor-name="the intro"
              aria-label="Replay the intro"
              className={`btn-pill btn-pill-ghost ${listening ? "is-listening" : ""}`}
            >
              <RotateCcw size={14} className={listening ? "spin-once" : ""} />
              <span className="hidden sm:inline">{listening ? "Re-forming…" : "Replay intro"}</span>
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="hero-fade hero-foot pointer-events-none absolute inset-x-0">
        <div className="container-x flex items-end justify-between mono text-[10px] tracking-[0.3em] text-muted-foreground/70">
          <span data-testid="hero-location-line">HYDERABAD · IN</span>
          <span className="hidden md:block">MOVE · CLICK · SCROLL</span>
          <span className="flex items-center gap-2">
            SCROLL <ArrowDown size={12} className="hero-arrow" />
          </span>
        </div>
      </div>
    </section>
  );
}
