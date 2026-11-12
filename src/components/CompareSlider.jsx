import { useRef, useState } from "react";

export default function CompareSlider({ dark, light, name }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const update = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(Math.max(((clientX - r.left) / r.width) * 100, 0), 100));
  };
  return (
    <div
      ref={ref}
      className="compare"
      data-testid="case-compare-slider"
      data-cursor="drag"
      data-cursor-name="to compare"
      onPointerDown={(e) => {
        setDrag(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => drag && update(e.clientX)}
      onPointerUp={() => setDrag(false)}
    >
      <img src={light} alt={`${name} light mode`} draggable="false" />
      <div className="compare-top" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={dark} alt={`${name} dark mode`} draggable="false" />
      </div>
      <div className="compare-handle" style={{ left: `${pos}%` }}>
        <span />
      </div>
    </div>
  );
}
