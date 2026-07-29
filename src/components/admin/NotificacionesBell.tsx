import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Ban,
  CalendarPlus,
  Check,
  CalendarClock,
  FileText,
  MessagesSquare,
  UserPlus,
  BellRing,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/cn";
import { useClinic } from "@/store/clinicStore";
import type {
  NotificacionMock,
  NotificacionTipo,
} from "@/lib/data/notificaciones";

const ICON: Record<NotificacionTipo, typeof Bell> = {
  cita_cancelada: Ban,
  cita_agendada: CalendarPlus,
  mensaje_nuevo: MessagesSquare,
  lista_espera: UserPlus,
  documento_solicitado: FileText,
  recordatorio: BellRing,
};

const ICON_TONE: Record<NotificacionTipo, string> = {
  cita_cancelada: "text-coral bg-coral/10",
  cita_agendada: "text-leaf bg-leaf/10",
  mensaje_nuevo: "text-teal bg-teal/10",
  lista_espera: "text-navy bg-navy/10",
  documento_solicitado: "text-amber bg-amber/10",
  recordatorio: "text-muted-foreground bg-muted",
};

export function NotificacionesBell() {
  const { notificaciones, marcarNotifLeida, marcarTodasNotifLeidas } = useClinic();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"nuevas" | "leidas">("nuevas");
  const ref = useRef<HTMLDivElement>(null);

  const noLeidas = notificaciones.filter((n) => !n.leida);
  const leidas = notificaciones.filter((n) => n.leida);
  const lista = tab === "nuevas" ? noLeidas : leidas;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const atender = (n: NotificacionMock) => {
    marcarNotifLeida(n.id);
    setOpen(false);
    if (n.telefono && n.vista === "conversaciones") {
      navigate(`/admin/conversaciones?phone=${encodeURIComponent(n.telefono)}`);
    } else if (n.vista === "lista-espera") {
      navigate("/admin/lista-espera");
    } else if (n.vista === "calendario") {
      navigate("/admin/calendario");
    }
  };

  const reasignar = (n: NotificacionMock) => {
    setOpen(false);
    const q = new URLSearchParams({ reasignar: "1", notif: n.id });
    if (n.citaCanceladaFecha) q.set("fecha", n.citaCanceladaFecha);
    if (n.servicioNombre) q.set("servicio", n.servicioNombre);
    navigate(`/admin/lista-espera?${q.toString()}`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notificaciones${noLeidas.length ? ` (${noLeidas.length} nuevas)` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell size={18} strokeWidth={1.75} />
        {noLeidas.length > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-semibold text-offwhite">
            {noLeidas.length > 9 ? "9+" : noLeidas.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              Notificaciones
            </h3>
            {noLeidas.length > 0 ? (
              <button
                type="button"
                onClick={marcarTodasNotifLeidas}
                className="text-xs font-medium text-navy hover:underline"
              >
                Marcar todas
              </button>
            ) : null}
          </div>

          <div className="flex border-b border-border px-2 pt-2">
            {(
              [
                { key: "nuevas", label: `Nuevas${noLeidas.length ? ` (${noLeidas.length})` : ""}` },
                { key: "leidas", label: "Leídas" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex-1 border-b-2 px-3 py-1.5 text-xs font-medium transition-colors",
                  tab === t.key
                    ? "border-navy text-navy"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {lista.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                {tab === "nuevas"
                  ? "No tienes notificaciones nuevas."
                  : "No hay notificaciones leídas."}
              </p>
            ) : (
              lista.map((n) => {
                const Icon = ICON[n.tipo];
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 border-b border-border/70 px-4 py-3 last:border-0"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        ICON_TONE[n.tipo],
                      )}
                    >
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {n.titulo}
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground">
                        {n.mensaje}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/70">
                        hace{" "}
                        {formatDistanceToNowStrict(new Date(n.fecha), {
                          locale: es,
                        })}
                      </p>
                    </div>
                    {tab === "nuevas" ? (
                      n.tipo === "cita_cancelada" ? (
                        <button
                          type="button"
                          onClick={() => reasignar(n)}
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-navy/30 px-2 py-1 text-[11px] font-medium text-navy hover:bg-navy/5"
                        >
                          <CalendarClock size={12} />
                          Reasignar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => atender(n)}
                          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted/70"
                        >
                          <Check size={12} />
                          Ver
                        </button>
                      )
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
