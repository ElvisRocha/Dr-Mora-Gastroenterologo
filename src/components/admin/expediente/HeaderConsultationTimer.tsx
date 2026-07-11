import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Pause, Play, Timer } from "lucide-react";
import { toast } from "sonner";
import { useClinic } from "@/store/clinicStore";
import { cn } from "@/lib/cn";

function formatHMS(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Cronómetro de consulta que se teletransporta al header del admin
 * (`#consultation-timer-slot`). Solo corre cuando se entró al expediente
 * iniciando la consulta desde el calendario; entrando directo muestra
 * 00:00:00 (solo lectura).
 */
export function HeaderConsultationTimer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateCita } = useClinic();
  const state = location.state as
    | { fromCalendario?: boolean; citaId?: string }
    | null;
  const fromCalendario = !!state?.fromCalendario;
  const citaId = state?.citaId ?? null;

  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [status, setStatus] = useState<"running" | "paused">("running");
  const [seconds, setSeconds] = useState(0);
  const anchorRef = useRef(0);

  useEffect(() => {
    setSlot(document.getElementById("consultation-timer-slot"));
  }, []);

  useEffect(() => {
    if (!fromCalendario || status !== "running") return;
    anchorRef.current = Date.now() - seconds * 1000;
    const id = setInterval(
      () => setSeconds(Math.floor((Date.now() - anchorRef.current) / 1000)),
      500,
    );
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fromCalendario]);

  if (!slot) return null;

  const terminar = () => {
    if (citaId) updateCita(citaId, { estado: "realizada" });
    toast.success(
      citaId
        ? "Consulta terminada · cita marcada como realizada"
        : "Consulta terminada",
    );
    navigate("/admin/calendario");
  };

  const content = fromCalendario ? (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 shadow-soft">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            status === "running"
              ? "animate-soft-pulse bg-coral"
              : "bg-muted-foreground/50",
          )}
        />
        <Timer size={15} className="text-navy" />
        <span
          className="font-mono text-sm font-semibold tabular-nums text-foreground"
          aria-live="polite"
        >
          {formatHMS(seconds)}
        </span>
        <button
          type="button"
          onClick={() => setStatus((s) => (s === "running" ? "paused" : "running"))}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label={status === "running" ? "Pausar" : "Reanudar"}
        >
          {status === "running" ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>
      <button
        type="button"
        onClick={terminar}
        className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-medium text-offwhite transition-colors hover:bg-navy/90"
      >
        <CheckCircle2 size={13} strokeWidth={1.75} />
        Terminar consulta
      </button>
    </div>
  ) : (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 text-muted-foreground"
      title="Inicia la consulta desde una cita del calendario"
    >
      <Timer size={15} />
      <span className="font-mono text-sm font-semibold tabular-nums">
        00:00:00
      </span>
    </div>
  );

  return createPortal(content, slot);
}
