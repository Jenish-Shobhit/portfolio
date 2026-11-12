import { useEffect, useState } from "react";
import { Check, Send } from "lucide-react";

const STEPS = [
  { side: "out", text: "Site 14 · inspect pump B" },
  { side: "in", text: "On it." },
  { side: "in", text: "Done · photo attached", done: true },
  { side: "out", text: "Logged. Nothing chased." },
];

export default function DAgentFlow() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v + 1) % (STEPS.length + 2)), 1100);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="chat-card" data-testid="d-agent-flow">
      <div className="flex items-center justify-between pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#38bdf8]/15 grid place-items-center text-[#38bdf8] mono text-xs font-semibold">D</span>
          <div>
            <div className="text-sm">D agent</div>
            <div className="mono text-[10px] tracking-[0.2em] text-[#38bdf8]">● ONLINE · TELEGRAM</div>
          </div>
        </div>
        <span className="mono text-[10px] tracking-[0.2em] text-muted-foreground">ILLUSTRATIVE</span>
      </div>
      <div className="pt-6 flex flex-col gap-3 min-h-[230px]">
        {STEPS.map((s, i) => (
          <div key={i} className={`bubble ${s.side === "out" ? "bubble-out" : "bubble-in"} ${i < n ? "is-on" : ""}`}>
            {s.side === "out" ? <Send size={12} /> : s.done ? <Check size={12} /> : null}
            {s.text}
          </div>
        ))}
      </div>
    </div>
  );
}
