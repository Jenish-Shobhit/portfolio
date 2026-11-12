import Lenis from "lenis";

let lenis = null;

export function startSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  let raf;
  const loop = (t) => {
    lenis.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const onClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    scrollToId(a.getAttribute("href").slice(1));
  };
  document.addEventListener("click", onClick);
  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("click", onClick);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToId(id, immediate = false) {
  const el = id === "top" ? 0 : document.getElementById(id);
  if (el === null) return;
  if (lenis) lenis.scrollTo(el, { immediate, duration: 1.6 });
  else if (el === 0) window.scrollTo(0, 0);
  else el.scrollIntoView();
}

export function scrollTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function lockScroll(on) {
  if (lenis) on ? lenis.stop() : lenis.start();
  document.documentElement.classList.toggle("scroll-locked", on);
}
