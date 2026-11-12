import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ p, d, i, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 9}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 11}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const onLeave = () => {
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      to={`/work/${p.id}`}
      data-testid={`project-card-${p.id}`}
      data-cursor="open"
      data-cursor-name={`${p.name} case study`}
      className={`tilt-wrap group block ${className}`}
      style={{ "--accent": d.accent }}
    >
      <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="tilt-card">
        <div className="tilt-media">
          <img src={p.img} alt={`${p.name} screenshot`} loading="lazy" data-testid={`project-image-${p.id}`} />
          <div className="tilt-glare" />
        </div>
        <div className="card-meta flex items-end justify-between gap-6 pt-6">
          <div>
            <div className="mono text-[10px] tracking-[0.22em] md:tracking-[0.3em] text-muted-foreground">
              {String(i + 1).padStart(2, "0")} — {d.stack.slice(0, 2).join(" · ").toUpperCase()}
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-semibold mt-3 tracking-[-0.02em]" data-testid={`project-title-${p.id}`}>
              {p.name}
            </h3>
            <p className="mt-2 text-muted-foreground text-[15px]">{d.tagline}</p>
          </div>
          <span className="card-arrow shrink-0">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
