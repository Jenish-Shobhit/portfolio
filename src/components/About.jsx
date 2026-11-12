import { useEffect, useRef, useState } from "react";
import { Award, BadgeCheck, GitPullRequest, Users } from "lucide-react";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";
import DAgentFlow from "./DAgentFlow";
import { CREDENTIALS, EXPERIENCE, STACK, STATS } from "../data/portfolio";

const ICONS = { award: Award, badge: BadgeCheck, pull: GitPullRequest, pair: Users };

function Counter({ to, label, idx }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const run = (now) => {
        const k = Math.min((now - t0) / 1400, 1);
        setN(Math.round(to * (1 - Math.pow(1 - k, 4))));
        if (k < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return (
    <div ref={ref} className="stat" data-testid={`about-stat-${idx}`}>
      <div className="font-display text-6xl md:text-7xl font-bold tracking-[-0.04em] tabular-nums">{String(n).padStart(2, "0")}</div>
      <div className="mono text-[10px] tracking-[0.3em] text-muted-foreground mt-3">{label.toUpperCase()}</div>
    </div>
  );
}

function Timeline() {
  return (
    <div className="timeline" data-testid="about-timeline">
      {[...EXPERIENCE].reverse().map((e) => (
        <Reveal key={e.id} className="timeline-node">
          <div className="mono text-[10px] tracking-[0.3em] text-muted-foreground">{e.period.toUpperCase()}</div>
          <div className="font-display text-2xl font-semibold mt-2" data-testid={`experience-${e.id}`}>{e.org}</div>
          <div className="text-muted-foreground text-sm mt-1">{e.title}</div>
        </Reveal>
      ))}
    </div>
  );
}

function Credentials() {
  return (
    <div className="flex flex-wrap gap-3" data-testid="credentials-grid">
      {CREDENTIALS.map((c) => {
        const Icon = ICONS[c.icon];
        const Tag = c.url ? "a" : "div";
        return (
          <Tag
            key={c.id}
            {...(c.url ? { href: c.url, target: "_blank", rel: "noreferrer", "data-cursor": "open", "data-cursor-name": "the badge" } : {})}
            data-testid={`credential-${c.id}`}
            className="chip"
          >
            <Icon size={14} className="text-[#38bdf8]" /> {c.title}
          </Tag>
        );
      })}
    </div>
  );
}

function Marquee() {
  const row = [...STACK, ...STACK];
  return (
    <div className="marquee" data-testid="about-stack-marquee">
      <div className="marquee-track">
        {row.map((s, i) => (
          <span key={i} className="marquee-item">
            {s}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" data-space="about" data-agent-label="reading · about me" className="relative py-40 md:py-60" data-testid="about-section">
      <div className="container-x">
        <p className="eyebrow">02 — ABOUT ME</p>
        <SplitHeading text={"I find the friction.\nI build the fix.\nI ship it."} className="h-display mt-6 max-w-5xl" testid="about-heading" />
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {STATS.map(([to, label], i) => (
            <Counter key={label} to={to} label={label} idx={i} />
          ))}
        </div>
        <div className="mt-32 grid lg:grid-cols-12 gap-14 items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">OWNERSHIP</p>
            <h3 className="font-display text-4xl md:text-5xl font-semibold mt-5 tracking-[-0.02em]">The D agent.</h3>
            <p className="mt-6 text-lg text-foreground/85 max-w-md leading-relaxed">
              Nobody assigned it. I asked. Built it with Paritosh. Shipped it.
            </p>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <DAgentFlow />
          </Reveal>
        </div>
        <div className="mt-32">
          <p className="eyebrow mb-10">WHERE</p>
          <Timeline />
        </div>
        <div className="mt-20">
          <Credentials />
        </div>
      </div>
      <div className="mt-28">
        <Marquee />
      </div>
    </section>
  );
}
