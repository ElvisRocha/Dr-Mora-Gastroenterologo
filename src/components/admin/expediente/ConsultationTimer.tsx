import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Timer } from "lucide-react";
import { cn } from "@/lib/cn";

function formatHMS(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function ConsultationTimer({
  onTerminar,
}: {
  onTerminar: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [seconds, setSeconds] = useState(0);
  const anchorRef = useRef<number>(0);

  useEffect(() => {
    if (status !== "running") return;
    anchorRef.current = Date.now() - seconds * 1000;
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - anchorRef.current) / 1000));
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStatus("running")}
        className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-2 text-sm font-medium text-teal transition-colors hover:bg-teal/20"
      >
        <Play size={15} />
        Iniciar consulta
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 shadow-soft">
      <span className="flex items-center gap-1.5 pl-1">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            status === "running" ? "animate-soft-pulse bg-coral" : "bg-muted-foreground/50",
          )}
        />
        <Timer size={15} className="text-navy" />
        <span
          className="font-mono text-sm font-semibold tabular-nums text-foreground"
          aria-live="polite"
        >
          {formatHMS(seconds)}
        </span>
      </span>
      <button
        type="button"
        onClick={() => setStatus((s) => (s === "running" ? "paused" : "running"))}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        aria-label={status === "running" ? "Pausar" : "Reanudar"}
      >
        {status === "running" ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        type="button"
        onClick={() => {
          setStatus("idle");
          setSeconds(0);
          onTerminar();
        }}
        className="flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-medium text-offwhite hover:bg-navy/90"
      >
        <Square size={12} />
        Terminar
      </button>
    </div>
  );
}
