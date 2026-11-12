import { Github, Linkedin } from "lucide-react";
import Magnetic from "./Magnetic";
import DeepSpace from "./DeepSpace";
import SplitHeading from "./SplitHeading";
import { PROFILE } from "../data/portfolio";

const LINKS = [
  ["linkedin", PROFILE.linkedin, "LinkedIn", Linkedin],
  ["github", PROFILE.github, "GitHub", Github],
  ["credly", PROFILE.credly, "Claude certified", null],
];

export default function Footer() {
  return (
    <footer id="contact" data-space="deep" data-agent-label="opening · contact" className="relative pt-40 md:pt-60 pb-[calc(3rem+env(safe-area-inset-bottom))] overflow-hidden" data-testid="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="relative container-x">
        <p className="eyebrow">06 — CONTACT</p>
        <SplitHeading text="Let's ship something." className="font-display font-bold tracking-[-0.045em] leading-[0.9] text-[15vw] md:text-[11vw] lg:text-[10.5rem] mt-6" />
        <div className="mt-14 flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <Magnetic strength={0.25}>
            <a href={`mailto:${PROFILE.email}`} data-testid="footer-email-link" data-cursor="open" data-cursor-name="a new email" className="btn-pill btn-pill-solid text-base px-9 py-5">
              {PROFILE.email}
            </a>
          </Magnetic>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            {LINKS.map(([id, href, label, Icon]) => (
              <a key={id} href={href} target="_blank" rel="noreferrer" data-testid={`footer-${id}-link`} data-cursor="open" data-cursor-name={label} className="link-line flex items-center gap-2 whitespace-nowrap mono text-[11px] tracking-[0.2em] text-muted-foreground hover:text-foreground">
                {Icon && <Icon size={14} />} {label.toUpperCase()} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="mt-28 pt-8 border-t border-border flex flex-col md:flex-row md:justify-between gap-3 mono text-[10px] tracking-[0.2em] text-muted-foreground deep-space-line" data-testid="footer-meta-line">
          <span>© 2026 JENISH SHOBHIT · HYDERABAD, INDIA</span>
          <span>BUILT BY VOICE · EMERGENT + WISPR FLOW<span className="hidden sm:inline"> · THREE.JS</span></span>
        </div>
        <DeepSpace />
      </div>
    </footer>
  );
}
