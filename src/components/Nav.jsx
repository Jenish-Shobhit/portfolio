import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { scrollToId } from "../lib/smoothScroll";
import { homeSection } from "../lib/navigation";

export const LINKS = [
  ["projects", "work", "Projects"],
  ["about", "about", "About"],
  ["ai", "method", "AI"],
  ["words", "words", "Words"],
  ["voice", "voice", "Voice"],
  ["contact", "contact", "Contact"],
];

const ICONS = [
  ["email", "mailto:jenshobhit@gmail.com", "Email Jenish", "a new email", Mail],
  ["linkedin", "https://www.linkedin.com/in/jenish-shobhit/", "Jenish on LinkedIn", "LinkedIn", Linkedin],
  ["github", "https://github.com/Jenish-Shobhit", "Jenish on GitHub", "GitHub", Github],
];

function useActive(home) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!home) return setActive(null);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    const t = setTimeout(() => LINKS.forEach(([, id]) => document.getElementById(id) && io.observe(document.getElementById(id))), 300);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [home]);
  return active;
}

export const go = (home, id) => (e) => {
  if (!home) return;
  e.preventDefault();
  scrollToId(id);
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const barRef = useRef(null);
  const home = useLocation().pathname === "/";
  const active = useActive(home);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`} data-testid="site-nav">
      <nav className="container-x flex items-center justify-between h-16">
        <Link to={home ? "#top" : "/"} onClick={go(home, "top")} className="mono text-[11px] tracking-[0.3em] text-foreground" data-testid="nav-logo" data-cursor="go to" data-cursor-name="the top">
          JENISH SHOBHIT
        </Link>
        <div className="hidden md:flex items-center gap-7 lg:gap-9">
          {LINKS.map(([key, id]) => (
            <Link
              key={id}
              to={home ? `#${id}` : homeSection(id)}
              onClick={go(home, id)}
              data-testid={`nav-link-${key}`}
              data-cursor="go to"
              data-cursor-name={key}
              className={`nav-link mono text-[10px] tracking-[0.25em] ${active === id ? "is-active" : ""}`}
            >
              {key.toUpperCase()}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-5 text-muted-foreground">
          {ICONS.map(([key, href, label, name, Icon]) => (
            <a key={key} href={href} {...(key !== "email" ? { target: "_blank", rel: "noreferrer" } : {})} aria-label={label} data-testid={`nav-icon-${key}`} data-cursor="open" data-cursor-name={name} className="hover:text-foreground transition-colors duration-200 hidden sm:block">
              <Icon size={15} />
            </a>
          ))}
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" data-testid="nav-mobile-menu-button" data-cursor="open" data-cursor-name="the menu" className="md:hidden w-10 h-10 -mr-2 grid place-items-center text-foreground">
            <Menu size={18} />
          </button>
        </div>
      </nav>
      <div ref={barRef} className="nav-progress" data-testid="nav-scroll-progress" />
      {open && <MobileMenu home={home} onClose={close} icons={ICONS} />}
    </header>
  );
}
