import { useEffect, useRef, useState } from "react";
import SplitHeading from "./SplitHeading";
import Reveal from "./Reveal";
import { AGENTS, createOrbit } from "../lib/orbit";

const LOOP = ["I speak the intent.", "Agents build in parallel.", "Nothing ships without my yes."];
const PROOF = ["Claude Certified Architect", "D agent in production", "This site: spoken, agent-built, test-verified"];

function useOrbit(canvasRef, setLog, setFocus) {
  const apiRef = useRef(null);
  useEffect(() => {
    const cv = canvasRef.current;
    const api = createOrbit(cv, {
      onLog: (text, color) => setLog((l) => [{ text, color, id: performance.now() + Math.random() }, ...l].slice(0, 4)),
      onFocus: setFocus,
    });
    apiRef.current = api;
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? api.start() : api.stop()));
    io.observe(cv);
    return () => {
      io.disconnect();
      api.dispose();
    };
  }, [canvasRef, setLog, setFocus]);
  return apiRef;
}

function Legend({ focus, onFocus }) {
  return (
    <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3" data-testid="mission-legend">
      {AGENTS.map((a) => (
        <li
          key={a.id}
          onPointerEnter={() => onFocus(a.id)}
          onPointerLeave={() => onFocus(null)}
          className={`legend-row ${focus === a.id ? "is-on" : ""}`}
          data-testid={`mission-agent-${a.id}`}
          data-cursor="focus"
          data-cursor-name={a.name}
        >
          <span className="legend-dot" style={{ background: a.color }} />
          <span className="mono text-[10px] tracking-[0.25em]">{a.name.toUpperCase()}</span>
          <span className="text-[13px] text-muted-foreground">{a.role}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MissionControl() {
  const canvasRef = useRef(null);
  const [log, setLog] = useState([]);
  const [focus, setFocus] = useState(null);
  const api = useOrbit(canvasRef, setLog, setFocus);
  const pick = (id) => {
    setFocus(id);
    api.current?.focus(id);
  };

  return (
    <section id="method" data-space="method" data-agent-label="delegating · mission control" className="relative py-40 md:py-60" data-testid="mission-section">
      <div className="container-x grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
        <div className="lg:col-span-5">
          <p className="eyebrow">03 — HOW I WORK WITH AI</p>
          <SplitHeading text="Mission control." className="h-display mt-6" testid="mission-heading" />
          <ol className="mt-14 space-y-6">
            {LOOP.map((t, i) => (
              <Reveal key={t} delay={i * 90}>
                <li className="flex items-baseline gap-5" data-testid={`mission-step-${i}`}>
                  <span className="mono text-[11px] tracking-[0.3em] text-[#38bdf8]">0{i + 1}</span>
                  <span className="font-display text-2xl md:text-3xl font-medium tracking-[-0.02em] text-balance">{t}</span>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-14 flex flex-wrap gap-3">
            {PROOF.map((p) => (
              <span key={p} className="chip">{p}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="orbit-frame">
            <canvas ref={canvasRef} className="orbit-canvas" data-testid="mission-orbit-canvas" data-cursor="inspect" data-cursor-name="the agents" data-no-ripple />
            <div className="orbit-log" data-testid="mission-log" aria-live="off">
              <span className="mono text-[9px] tracking-[0.3em] text-muted-foreground/60">LIVE LOOP · SIMULATED</span>
              {log.map((l, i) => (
                <div key={l.id} className="orbit-log-line mono" style={{ opacity: 1 - i * 0.24, color: i === 0 ? l.color : undefined }}>
                  {l.text}
                </div>
              ))}
            </div>
          </div>
          <Legend focus={focus} onFocus={pick} />
        </div>
      </div>
    </section>
  );
}
