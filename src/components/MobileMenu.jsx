import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { LINKS } from "./Nav";
import { lockScroll, scrollToId } from "../lib/smoothScroll";

export default function MobileMenu({ home, onClose, icons }) {
  useEffect(() => {
    lockScroll(true);
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", k);
    };
  }, [onClose]);

  return createPortal(
    <div className="mobile-menu" data-testid="nav-mobile-menu">
      <button type="button" onClick={onClose} aria-label="Close menu" data-testid="nav-mobile-close-button" data-cursor="close" data-cursor-name="the menu" className="mobile-menu-close">
        <X size={20} />
      </button>
      <p className="eyebrow mb-10">MENU</p>
      <nav className="flex flex-col gap-1">
        {LINKS.map(([key, id, title], i) => (
          <Link
            key={id}
            to={home ? `#${id}` : `/#${id}`}
            onClick={(e) => {
              onClose();
              if (!home) return;
              e.preventDefault();
              setTimeout(() => scrollToId(id), 60);
            }}
            data-testid={`nav-mobile-link-${key}`}
            className="mobile-menu-link"
            style={{ animationDelay: `${80 + i * 50}ms` }}
          >
            <span className="mono text-[11px] tracking-[0.3em] text-[#38bdf8]">0{i + 1}</span>
            {title}
          </Link>
        ))}
      </nav>
      <div className="mt-14 flex items-center gap-6 text-muted-foreground">
        {icons.map(([key, href, label, , Icon]) => (
          <a key={key} href={href} {...(key !== "email" ? { target: "_blank", rel: "noreferrer" } : {})} aria-label={label} data-testid={`nav-mobile-icon-${key}`} className="w-11 h-11 grid place-items-center rounded-full border border-border">
            <Icon size={16} />
          </a>
        ))}
      </div>
    </div>,
    document.body
  );
}
