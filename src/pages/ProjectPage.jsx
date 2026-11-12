import { useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import Reveal from "../components/Reveal";
import CompareSlider from "../components/CompareSlider";
import Footer from "../components/Footer";
import Magnetic from "../components/Magnetic";
import useInViewLoop from "../lib/useInViewLoop";
import { DETAILS, PROJECTS } from "../data/portfolio";
import { homeSection } from "../lib/navigation";

function Letters({ text }) {
  let k = 0;
  return (
    <h1 className="case-title font-display" aria-label={text} data-testid="case-title">
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="case-word" aria-hidden="true">
          {word.split("").map((ch, i) => (
            <span key={i} style={{ animationDelay: `${120 + k++ * 38}ms` }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

const scaleFrame = (el) => {
  const r = el.getBoundingClientRect();
  const p = Math.min(Math.max(1 - r.top / window.innerHeight, 0), 1);
  el.style.setProperty("--s", 0.86 + p * 0.14);
  el.style.setProperty("--y", `${(1 - p) * 60}px`);
};

function ScaleShot({ src, alt }) {
  const ref = useRef(null);
  useInViewLoop(ref, scaleFrame);
  return (
    <div ref={ref} className="scale-shot" data-testid="case-hero-image">
      <img src={src} alt={alt} />
    </div>
  );
}

function Chapters({ items }) {
  return (
    <ol className="chapters" data-testid="case-chapters">
      {items.map(([t, d], i) => (
        <Reveal key={t} delay={i * 80} className="chapter">
          <span className="mono text-[11px] tracking-[0.3em] text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-2xl md:text-3xl font-semibold mt-4 tracking-[-0.02em]">{t}</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{d}</p>
        </Reveal>
      ))}
    </ol>
  );
}

function Trio({ p }) {
  const rows = [["Problem", p.problem], ["I owned", p.owned], ["Outcome", p.outcome]];
  return (
    <div className="grid md:grid-cols-3 gap-12 md:gap-10" data-testid="case-trio">
      {rows.map(([k, v], i) => (
        <Reveal key={k} delay={i * 100}>
          <div className={`mono text-[10px] tracking-[0.3em] ${i === 1 ? "text-[var(--accent)]" : "text-muted-foreground"}`}>{k.toUpperCase()}</div>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">{v}</p>
        </Reveal>
      ))}
    </div>
  );
}

function NextProject({ p }) {
  return (
    <Link to={`/work/${p.id}`} className="next-proj group" data-testid="case-next-link" data-cursor="open" data-cursor-name={p.name}>
      <span className="mono text-[11px] tracking-[0.3em] text-muted-foreground">NEXT PROJECT</span>
      <span className="font-display font-bold tracking-[-0.04em] text-[14vw] md:text-[9vw] leading-[0.95] mt-4 block next-proj-name">{p.name}</span>
      <img src={p.img} alt="" className="next-proj-img" />
    </Link>
  );
}

export default function ProjectPage() {
  const { id } = useParams();
  const i = PROJECTS.findIndex((x) => x.id === id);
  if (i < 0) return <Navigate to="/" replace />;
  const p = PROJECTS[i];
  const d = DETAILS[id];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const light = p.img.replace("-dark.png", "-light.png");

  return (
    <div style={{ "--accent": d.accent }} data-testid={`case-page-${id}`}>
      <main>
        <section data-space="case" data-agent-label={`reading · ${p.name}`} className="container-x pt-36 md:pt-44">
          <div className="flex items-center justify-between">
            <Link to={homeSection("work")} className="link-line flex items-center gap-2 mono text-[11px] tracking-[0.25em] text-muted-foreground hover:text-foreground" data-testid="case-back-link" data-cursor="go" data-cursor-name="all work">
              <ArrowLeft size={14} /> ALL WORK
            </Link>
            <span className="mono text-[11px] tracking-[0.25em] text-muted-foreground">{String(i + 1).padStart(2, "0")} / 08</span>
          </div>
          <div className="mt-16 md:mt-24">
            <Letters text={p.name} />
            <p className="case-sub mt-6 text-xl md:text-2xl text-muted-foreground font-display">{d.tagline}</p>
          </div>
          <div className="case-sub mt-10 flex flex-wrap items-center gap-3">
            {d.stack.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
          <div className="case-sub mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href={p.live.url} target="_blank" rel="noreferrer" className="btn-pill btn-pill-solid" data-testid="case-live-link" data-cursor="open" data-cursor-name={p.live.label}>
                {p.live.label} <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <a href={p.source} target="_blank" rel="noreferrer" className="btn-pill btn-pill-ghost" data-testid="case-source-link" data-cursor="open" data-cursor-name="the source">
              <Github size={14} /> Source
            </a>
          </div>
        </section>

        <section className="mt-24 md:mt-32 px-4 md:px-8">
          <ScaleShot src={p.img} alt={`${p.name} screenshot`} />
        </section>

        <section data-space="caseBody" className="container-x py-32 md:py-48">
          <Trio p={p} />
        </section>

        <section className="container-x pb-32 md:pb-48" data-agent-label="reading · the build log">
          <p className="eyebrow mb-14">THE BUILD</p>
          <Chapters items={d.chapters} />
        </section>

        <section className="container-x pb-32 md:pb-48" data-agent-label="comparing · dark and light">
          <div className="flex items-end justify-between mb-10">
            <p className="eyebrow">DARK / LIGHT</p>
            <span className="mono text-[10px] tracking-[0.3em] text-muted-foreground">DRAG</span>
          </div>
          <CompareSlider dark={p.img} light={light} name={p.name} />
        </section>

        <section className="container-x py-24 md:py-36"><div className="hairline mb-24 md:mb-32" />
          <NextProject p={next} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
