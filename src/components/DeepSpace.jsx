import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { YOUTUBE } from "../data/portfolio";
import { lockScroll } from "../lib/smoothScroll";
import useDialogFocus from "../lib/useDialogFocus";

function Player({ id, onClose }) {
  const dialogRef = useDialogFocus();
  useEffect(() => {
    lockScroll(true);
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", k);
    };
  }, [onClose]);
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Portfolio video" className="yt-modal" onClick={onClose} data-testid="easter-egg-player">
      <button type="button" aria-label="Close video" className="yt-close" onClick={onClose} data-testid="easter-egg-player-close" data-cursor="close" data-cursor-name="the video"><X size={18} /></button>
      <div className="w-[min(1100px,100%)] text-center">
        <div className="yt-frame" onClick={(e) => e.stopPropagation()}>
          <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="link-line inline-block mt-5 mono text-[10px] tracking-[0.3em] text-muted-foreground hover:text-foreground" data-testid="easter-egg-open-youtube" data-cursor="open" data-cursor-name="YouTube">
          OPEN ON YOUTUBE ↗
        </a>
      </div>
    </div>
  );
}

export default function DeepSpace() {
  const ref = useRef(null);
  const [found, setFound] = useState(false);
  const [playing, setPlaying] = useState(null);
  const close = useCallback(() => setPlaying(null), []);
  useEffect(() => {
    const io = new IntersectionObserver(([en]) => en.isIntersecting && setFound(true), { threshold: 0.9 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`deep-space ${found ? "is-found" : ""}`} data-testid="easter-egg">
      <p className="mono text-[10px] tracking-[0.35em] text-foreground/80 deep-space-line">
        YOU REACHED DEEP SPACE · TWO TRANSMISSIONS FOUND
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {YOUTUBE.videos.map((v, i) => (
          <button key={v.id} type="button" onClick={() => setPlaying(v.id)} className="yt-thumb group" style={{ transitionDelay: `${300 + i * 150}ms` }} data-testid={`easter-egg-video-${v.id}`} data-cursor="open" data-cursor-name={v.title}>
            <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt={v.title} loading="lazy" />
            <span className="yt-play"><Play size={12} fill="currentColor" /></span>
            <span className="yt-title">{v.title}</span>
          </button>
        ))}
      </div>
      <a href={YOUTUBE.channel} target="_blank" rel="noreferrer" className="link-line inline-block mt-6 mono text-[10px] tracking-[0.3em] text-foreground/75 hover:text-foreground deep-space-line" data-testid="easter-egg-channel-link" data-cursor="open" data-cursor-name="YouTube">
        @JENISHSHOBHIT ON YOUTUBE ↗
      </a>
      {playing && createPortal(<Player id={playing} onClose={close} />, document.body)}
    </div>
  );
}
