import { useRef } from "react";

export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    ref.current.style.transform = "translate3d(0,0,0)";
  };
  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`magnetic inline-block ${className}`}>
      {children}
    </span>
  );
}
