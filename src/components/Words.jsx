import { useRef } from "react";
import { PRINCIPLES } from "../data/portfolio";
import useInViewLoop from "../lib/useInViewLoop";

const frame = (el) => {
  const words = el.querySelectorAll(".sw");
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = Math.min(Math.max((vh * 0.85 - r.top) / (vh * 0.5), 0), 1);
  words.forEach((w, i) => {
    const k = Math.min(Math.max(p * words.length - i, 0), 1);
    w.style.opacity = 0.12 + k * 0.88;
    w.style.filter = k > 0.99 ? "none" : `blur(${(1 - k) * 6}px)`;
    w.style.transform = `translate3d(0,${(1 - k) * 14}px,0)`;
  });
};

function ScrollLine({ text, idx }) {
  const ref = useRef(null);
  useInViewLoop(ref, frame);
  return (
    <li ref={ref} className="principle" data-testid={`principle-${idx}`}>
      <span className="principle-idx mono">{String(idx + 1).padStart(2, "0")}</span>
      <span className="principle-text font-display">
        {text.split(" ").map((w, i) => (
          <span key={i} className="sw">
            {w}
          </span>
        ))}
      </span>
    </li>
  );
}

export default function Words() {
  return (
    <section id="words" data-space="words" data-agent-label="listening · words" className="relative py-40 md:py-60" data-testid="words-section">
      <div className="container-x">
        <p className="eyebrow">04 — WORDS</p>
        <ul className="mt-16 md:mt-24 flex flex-col gap-14 md:gap-20">
          {PRINCIPLES.map((t, i) => (
            <ScrollLine key={t} text={t} idx={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
