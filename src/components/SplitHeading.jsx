import { useEffect, useRef } from "react";

export default function SplitHeading({ text, className = "", as: Tag = "h2", testid }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  let k = 0;
  return (
    <Tag ref={ref} className={`split ${className}`} data-testid={testid} aria-label={text.replace(/\n/g, " ")}>
      {text.split("\n").map((line, li) => (
        <span key={li} className="split-line" aria-hidden="true">
          {line.split(" ").map((w, i) => (
            <span key={i} className="split-word">
              <span style={{ transitionDelay: `${k++ * 60}ms` }}>{w}</span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
