import { useEffect } from "react";

export default function useInViewLoop(ref, frame) {
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      frame(ref.current);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(ref.current);
    frame(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, frame]);
}
