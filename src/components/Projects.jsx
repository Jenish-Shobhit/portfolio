import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import SplitHeading from "./SplitHeading";
import { DETAILS, PROFILE, PROJECTS } from "../data/portfolio";

function useDesktop() {
  const q = "(min-width: 1024px)";
  const [ok, setOk] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setOk(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return ok;
}

function Intro() {
  return (
    <div className="shrink-0 w-[34vw] pr-16 flex flex-col justify-center">
      <p className="eyebrow">01 — MY PROJECTS</p>
      <SplitHeading text="Things I built and shipped." className="h-section mt-6" />
      <div className="mt-10 flex items-baseline gap-4">
        <span className="font-display text-[9rem] leading-none font-bold outline-num">08</span>
        <span className="mono text-[11px] tracking-[0.3em] text-muted-foreground">LIVE · OPEN SOURCE</span>
      </div>
    </div>
  );
}

function Outro() {
  return (
    <a
      href={PROFILE.github}
      target="_blank"
      rel="noreferrer"
      data-testid="projects-github-link"
      data-cursor="open"
      data-cursor-name="GitHub"
      className="shrink-0 w-[30vw] flex flex-col justify-center items-start pl-10 group"
    >
      <span className="mono text-[11px] tracking-[0.3em] text-muted-foreground">MORE ON</span>
      <span className="font-display text-7xl font-semibold mt-4 group-hover:text-[#38bdf8] transition-colors duration-300">GitHub ↗</span>
    </a>
  );
}

function Pinned() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const [height, setHeight] = useState("400vh");

  useEffect(() => {
    const track = trackRef.current;
    const imgs = Array.from(track.querySelectorAll(".tilt-media img"));
    let max = 0;
    let raf = 0;
    let x = 0;
    let lastY = window.scrollY;
    let skew = 0;
    let shown = -1;
    const measure = () => {
      max = track.scrollWidth - window.innerWidth;
      setHeight(`${window.innerHeight + max}px`);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const s = sectionRef.current;
      const vw = window.innerWidth;
      const p = Math.min(Math.max(-s.getBoundingClientRect().top / (s.offsetHeight - window.innerHeight), 0), 1);
      x += (p * max - x) * 0.14;
      const v = window.scrollY - lastY;
      lastY = window.scrollY;
      skew += (Math.max(Math.min(v * 0.08, 6), -6) - skew) * 0.1;
      track.style.transform = `translate3d(${-x}px,0,0)`;
      track.style.setProperty("--skew", `${-skew}deg`);
      let best = 0;
      let bd = Infinity;
      imgs.forEach((im, i) => {
        const r = im.parentElement.getBoundingClientRect();
        const n = (r.left + r.width / 2 - vw / 2) / vw;
        im.style.transform = `translate3d(${n * -5}%,0,0) scale(1.14)`;
        if (Math.abs(n) < bd) {
          bd = Math.abs(n);
          best = i;
        }
      });
      if (best !== shown) {
        shown = best;
        countRef.current.textContent = String(best + 1).padStart(2, "0");
      }
      barRef.current.style.transform = `scaleX(${p})`;
    };
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en.isIntersecting) raf = requestAnimationFrame(loop);
    });
    measure();
    io.observe(sectionRef.current);
    window.addEventListener("resize", measure);
    imgs.forEach((im) => im.addEventListener("load", measure));
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" data-space="work" data-agent-label="navigating · the work" style={{ height }} className="relative" data-testid="projects-section">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div ref={trackRef} className="pin-track flex items-center gap-16 will-change-transform h-full" data-testid="projects-track">
          <Intro />
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} d={DETAILS[p.id]} i={i} className="shrink-0 w-[min(58vw,880px,calc((100vh-300px)*1.6))] skew-card" />
          ))}
          <Outro />
        </div>
        <div className="pin-foot">
          <span className="mono text-[10px] tracking-[0.3em] text-muted-foreground tabular-nums" data-testid="projects-counter">
            <span ref={countRef} className="text-foreground">01</span> / 08
          </span>
          <div className="relative flex-1 h-px bg-border">
            <div ref={barRef} className="absolute inset-0 bg-[#38bdf8] origin-left" style={{ transform: "scaleX(0)" }} data-testid="projects-progress" />
          </div>
          <span className="mono text-[10px] tracking-[0.3em] text-muted-foreground">SCROLL ↓</span>
        </div>
      </div>
    </section>
  );
}

function Stacked() {
  return (
    <section id="work" data-space="work" data-agent-label="navigating · the work" className="container-x py-40" data-testid="projects-section">
      <p className="eyebrow">01 — MY PROJECTS</p>
      <SplitHeading text="Things I built and shipped." className="h-section mt-6" />
      <div className="mt-20 grid md:grid-cols-2 gap-x-10 gap-y-28">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} p={p} d={DETAILS[p.id]} i={i} />
        ))}
      </div>
    </section>
  );
}

export default function Projects() {
  return useDesktop() ? <Pinned /> : <Stacked />;
}
