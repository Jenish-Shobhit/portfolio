import { useEffect, useRef } from "react";

export default function useDialogFocus() {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    const controls = () => [...dialog.querySelectorAll('a[href], button, iframe, [tabindex="0"]')]
      .filter((element) => element.getClientRects().length && !element.disabled);
    controls()[0]?.focus({ preventScroll: true });
    const trap = (event) => {
      if (event.key !== "Tab") return;
      const elements = controls();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return ref;
}
