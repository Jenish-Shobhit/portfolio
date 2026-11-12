import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { universeBus } from "../three/universeBus";

export default function Universe() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const modeRef = useRef(pathname === "/" ? "home" : "page");
  const [gen, setGen] = useState(0);
  const [failed, setFailed] = useState(false);
  modeRef.current = pathname === "/" ? "home" : "page";

  useEffect(() => {
    let api = null;
    let cancelled = false;
    (async () => {
      try {
        await document.fonts?.load('700 120px "Space Grotesk"');
      } catch (e) {
        /* font api unavailable */
      }
      const { createUniverse } = await import("../three/universe");
      if (cancelled) return;
      try {
        api = createUniverse(ref.current, {
          getMode: () => modeRef.current,
          onReady: (i) => universeBus.ready(i),
          onLost: () => setTimeout(() => setGen((g) => g + 1), 300),
        });
        universeBus.attach(api);
        window.__universe = api;
      } catch (e) {
        setFailed(true);
        universeBus.ready({ failed: true });
      }
    })();
    return () => {
      cancelled = true;
      universeBus.detach();
      api?.dispose();
    };
  }, [gen]);

  return (
    <div ref={ref} className={`universe ${failed ? "universe-fallback" : ""}`} aria-hidden="true" data-testid="universe" />
  );
}
