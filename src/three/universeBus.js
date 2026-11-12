let api = null;
let info = null;
const subs = new Set();

export const universeBus = {
  attach(a) {
    api = a;
  },
  detach() {
    api = null;
  },
  speakAgain() {
    api?.speakAgain();
  },
  ready(i) {
    info = i;
    subs.forEach((fn) => fn(i));
  },
  subscribe(fn) {
    subs.add(fn);
    if (info) fn(info);
    return () => subs.delete(fn);
  },
};
