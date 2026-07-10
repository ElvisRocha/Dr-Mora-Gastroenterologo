import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, Lock } from "lucide-react";
import {
  addDays,
  addMinutes,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import { pacientePorId } from "@/lib/mock";
import { useLang } from "@/contexts/LanguageContext";
import { useClinic, type CitaFull } from "@/store/clinicStore";
import { estaAbierto } from "@/lib/data/horarios";
import { BLOQUEO_LABEL, type BloqueoMock } from "@/lib/data/bloqueos";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { SOURCE_CONFIG } from "@/components/admin/calendario/citaSource";
import { CitaActionsMenu } from "@/components/admin/calendario/CitaActionsMenu";
import { AgendarCitaModal } from "@/components/admin/calendario/AgendarCitaModal";
import { BloqueoModal } from "@/components/admin/calendario/BloqueoModal";

type View = "dia" | "semana" | "mes";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9:00 - 19:00
const WEEK_DAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const ESTADO_STYLE: Record<CitaFull["estado"], string> = {
  agendada: "bg-navy/10 text-navy border-navy/20",
  confirmada: "bg-leaf/15 text-leaf border-leaf/30",
  realizada: "bg-muted text-muted-foreground border-border",
  cancelada: "bg-coral/12 text-coral border-coral/30 opacity-70",
  no_asistio: "bg-amber/15 text-amber border-amber/30",
};

export default function Calendario() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { citas, bloqueos, servicios, horarios } = useClinic();
  const [view, setView] = useState<View>("semana");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [agendarOpen, setAgendarOpen] = useState(false);
  const [agendarSeed, setAgendarSeed] = useState<{ date?: Date; hour?: number }>({});
  const [bloqueoOpen, setBloqueoOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const findServicio = (slug: string) =>
    servicios.find((s) => s.id === slug) ??
    t.servicios.items.find((s) => s.slug === slug);

  const servicioNombre = (slug: string) => {
    const s = findServicio(slug);
    return (s && "nombre" in s ? s.nombre : slug) as string;
  };

  const findDuracion = (slug: string) =>
    servicios.find((s) => s.id === slug)?.duracionMin ?? 30;

  const { rangeStart, rangeEnd } = useMemo(() => {
    if (view === "dia") {
      return { rangeStart: startOfDay(currentDate), rangeEnd: endOfDay(currentDate) };
    }
    if (view === "semana") {
      return {
        rangeStart: startOfWeek(currentDate, { weekStartsOn: 1 }),
        rangeEnd: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return {
      rangeStart: startOfWeek(monthStart, { weekStartsOn: 1 }),
      rangeEnd: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    };
  }, [view, currentDate]);

  const citasEnRango = useMemo(
    () =>
      citas.filter((c) => {
        const ts = new Date(c.fechaHora).getTime();
        return ts >= rangeStart.getTime() && ts <= rangeEnd.getTime();
      }),
    [citas, rangeStart, rangeEnd],
  );

  const goToday = () => setCurrentDate(new Date());
  const goPrev = () =>
    setCurrentDate((d) =>
      view === "dia" ? subDays(d, 1) : view === "semana" ? subWeeks(d, 1) : subMonths(d, 1),
    );
  const goNext = () =>
    setCurrentDate((d) =>
      view === "dia" ? addDays(d, 1) : view === "semana" ? addWeeks(d, 1) : addMonths(d, 1),
    );

  const weekDays =
    view === "semana"
      ? Array.from({ length: 6 }, (_, i) =>
          addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i),
        )
      : [];

  const monthDays =
    view === "mes"
      ? eachDayOfInterval({ start: rangeStart, end: rangeEnd }).filter(
          (d) => getDay(d) !== 0,
        )
      : [];

  const getCitasForDayHour = (day: Date, hour: number) =>
    citasEnRango.filter((c) => {
      const dt = new Date(c.fechaHora);
      return isSameDay(dt, day) && dt.getHours() === hour;
    });

  const citasForDay = (day: Date) =>
    citasEnRango.filter((c) => isSameDay(new Date(c.fechaHora), day));

  // Bloqueo que cubre este día+hora (cualquier solape con la hora).
  const bloqueoForCell = (day: Date, hour: number): BloqueoMock | undefined => {
    const cellStart = new Date(day);
    cellStart.setHours(hour, 0, 0, 0);
    const cellEnd = new Date(cellStart);
    cellEnd.setHours(hour + 1, 0, 0, 0);
    return bloqueos.find((b) => {
      const bi = new Date(b.inicio).getTime();
      const bf = new Date(b.fin).getTime();
      return bi < cellEnd.getTime() && bf > cellStart.getTime();
    });
  };

  const cellCerrado = (day: Date, hour: number) =>
    !estaAbierto(horarios, day.getDay(), hour * 60);

  const openAgendar = (date?: Date, hour?: number) => {
    setAgendarSeed({ date, hour });
    setAgendarOpen(true);
  };

  const formatRange = (cita: CitaFull) => {
    const start = new Date(cita.fechaHora);
    const minutes = cita.duracionMin || findDuracion(cita.servicioSlug);
    const startLabel = format(start, "h:mm a");
    if (!minutes) return startLabel;
    return `${startLabel} - ${format(addMinutes(start, minutes), "h:mm a")}`;
  };

  // Línea "ahora" dentro de la celda de la hora actual.
  const nowLineFor = (day: Date, hour: number) => {
    if (!isSameDay(now, day) || now.getHours() !== hour) return null;
    const pct = (now.getMinutes() / 60) * 100;
    return (
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
        style={{ top: `${pct}%` }}
      >
        <span className="h-2 w-2 shrink-0 -translate-x-1/2 rounded-full bg-coral" />
        <span className="h-px flex-1 bg-coral" />
      </div>
    );
  };

  const CitaCard = ({ cita, dense }: { cita: CitaFull; dense?: boolean }) => {
    const paciente = pacientePorId(cita.pacienteId);
    const src = SOURCE_CONFIG[cita.source];
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/admin/pacientes/${cita.pacienteId}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate(`/admin/pacientes/${cita.pacienteId}`);
        }}
        className={cn(
          "group relative block w-full cursor-pointer rounded-md border text-left transition-shadow hover:shadow-sm",
          dense ? "px-1.5 py-1" : "px-3 py-2",
          ESTADO_STYLE[cita.estado],
        )}
      >
        <div className="flex items-start justify-between gap-1">
          <p
            className={cn(
              "truncate font-medium leading-tight",
              dense ? "text-[11px]" : "text-sm",
            )}
          >
            {servicioNombre(cita.servicioSlug)}
          </p>
          <div className="flex shrink-0 items-center gap-0.5">
            <src.Icon size={dense ? 11 : 13} className={cn(src.color, "shrink-0")} />
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <CitaActionsMenu cita={cita} compact={dense} />
            </div>
          </div>
        </div>
        <p className={cn("truncate leading-tight", dense ? "text-[11px]" : "text-sm")}>
          {paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : "Sin paciente"}
        </p>
        <p
          className={cn(
            "font-mono leading-tight opacity-80",
            dense ? "text-[10px]" : "mt-0.5 flex items-center gap-1.5 text-xs",
          )}
        >
          {!dense ? <Clock size={12} className="shrink-0" /> : null}
          {formatRange(cita)}
        </p>
      </div>
    );
  };

  const headerLabel = (() => {
    if (view === "dia") return format(currentDate, "EEEE, dd 'de' MMMM yyyy", { locale: es });
    if (view === "semana") {
      const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
      const we = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(ws, "dd MMM", { locale: es })} — ${format(we, "dd MMM yyyy", { locale: es })}`;
    }
    const label = format(currentDate, "MMMM yyyy", { locale: es });
    return label.charAt(0).toUpperCase() + label.slice(1);
  })();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">Agenda</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center rounded-full border border-border bg-muted/40 p-1"
            role="tablist"
          >
            {(["dia", "semana", "mes"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all",
                  view === v
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v === "dia" ? "Día" : v === "semana" ? "Semana" : "Mes"}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={() => setBloqueoOpen(true)}>
            <Lock size={15} />
            Bloquear
          </Button>
          <Button size="sm" onClick={() => openAgendar(currentDate)}>
            <CalendarPlus size={15} />
            Agendar cita
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrev} className="h-9 w-9 p-0" aria-label="Anterior">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={goNext} className="h-9 w-9 p-0" aria-label="Siguiente">
            <ChevronRight size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoy
          </Button>
        </div>
        <h3 className="text-base font-medium capitalize text-foreground sm:text-lg">
          {headerLabel}
        </h3>
        <div className="text-sm text-muted-foreground">
          {citasEnRango.filter((c) => c.estado !== "cancelada").length} citas
        </div>
      </div>

      {view === "dia" ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {HOURS.map((hour) => {
            const hourCitas = getCitasForDayHour(currentDate, hour);
            const bloqueo = bloqueoForCell(currentDate, hour);
            const cerrado = cellCerrado(currentDate, hour);
            return (
              <div key={hour} className="flex min-h-[3.5rem] border-b border-border last:border-0">
                <div className="flex w-16 shrink-0 items-start justify-end border-r border-border p-2 font-mono text-xs text-muted-foreground">
                  {`${hour}:00`}
                </div>
                <div
                  className={cn(
                    "relative flex-1 space-y-1 p-1",
                    cerrado && "bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,hsl(215_16%_90%/0.4)_6px,hsl(215_16%_90%/0.4)_12px)]",
                  )}
                >
                  {nowLineFor(currentDate, hour)}
                  {bloqueo ? <BloqueoOverlay bloqueo={bloqueo} /> : null}
                  {hourCitas.map((cita) => (
                    <CitaCard key={cita.id} cita={cita} />
                  ))}
                  {!bloqueo && hourCitas.length === 0 && !cerrado ? (
                    <button
                      type="button"
                      onClick={() => openAgendar(currentDate, hour)}
                      className="flex h-full min-h-[3rem] w-full items-center justify-center rounded-md text-xs text-transparent transition-colors hover:bg-navy/5 hover:text-muted-foreground"
                    >
                      + Agendar
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : view === "semana" ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <div className="min-w-[720px]">
            <div className="flex border-b border-border bg-muted/30">
              <div className="w-16 shrink-0 border-r border-border" />
              {weekDays.map((day) => {
                const today = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "flex-1 border-r border-border px-2 py-2 text-center last:border-r-0",
                      today && "bg-navy/5",
                    )}
                  >
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {format(day, "EEE", { locale: es })}
                    </p>
                    <p className={cn("text-base font-bold", today ? "text-navy" : "text-foreground")}>
                      {format(day, "d")}
                    </p>
                  </div>
                );
              })}
            </div>
            {HOURS.map((hour) => (
              <div key={hour} className="flex min-h-[3.5rem] border-b border-border last:border-0">
                <div className="flex w-16 shrink-0 items-start justify-end border-r border-border p-2 font-mono text-xs text-muted-foreground">
                  {`${hour}:00`}
                </div>
                {weekDays.map((day) => {
                  const cellCitas = getCitasForDayHour(day, hour);
                  const bloqueo = bloqueoForCell(day, hour);
                  const cerrado = cellCerrado(day, hour);
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "relative min-w-0 flex-1 space-y-1 border-r border-border p-1 last:border-r-0",
                        cerrado && "bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,hsl(215_16%_90%/0.4)_6px,hsl(215_16%_90%/0.4)_12px)]",
                      )}
                    >
                      {nowLineFor(day, hour)}
                      {bloqueo ? <BloqueoOverlay bloqueo={bloqueo} dense /> : null}
                      {cellCitas.map((cita) => (
                        <CitaCard key={cita.id} cita={cita} dense />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-6 border-b border-border bg-muted/30">
            {WEEK_DAY_LABELS.map((d) => (
              <div
                key={d}
                className="border-r border-border px-2 py-2 text-center text-[11px] font-medium tracking-wide text-muted-foreground last:border-r-0"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6">
            {monthDays.map((day) => {
              const dayCitas = citasForDay(day).filter((c) => c.estado !== "cancelada");
              const dayBloqueos = bloqueos.filter((b) => isSameDay(new Date(b.inicio), day));
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => {
                    setCurrentDate(day);
                    setView("dia");
                  }}
                  className={cn(
                    "min-h-[5.5rem] border-b border-r border-border p-2 text-left transition-colors last:border-r-0 hover:bg-muted/40",
                    today && "bg-navy/5",
                    !inMonth && "bg-muted/20",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      today && "inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-offwhite",
                      !today && inMonth && "text-foreground",
                      !today && !inMonth && "text-muted-foreground/60",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayCitas.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                        <span className={cn("font-medium", inMonth ? "text-navy" : "text-muted-foreground")}>
                          {dayCitas.length} cita{dayCitas.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ) : null}
                    {dayBloqueos.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Lock size={10} className="shrink-0" />
                        {dayBloqueos.length} bloqueo{dayBloqueos.length !== 1 ? "s" : ""}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="font-medium">Origen:</span>
        {(Object.keys(SOURCE_CONFIG) as (keyof typeof SOURCE_CONFIG)[]).map((k) => {
          const c = SOURCE_CONFIG[k];
          return (
            <span key={k} className="inline-flex items-center gap-1.5">
              <c.Icon size={13} className={c.color} />
              {k === "web" ? "Sitio web" : k === "whatsapp" ? "WhatsApp" : k === "telefono" ? "Teléfono" : "Recepción"}
            </span>
          );
        })}
      </div>

      <AgendarCitaModal
        open={agendarOpen}
        onClose={() => setAgendarOpen(false)}
        defaultDate={agendarSeed.date}
        defaultHour={agendarSeed.hour}
      />
      <BloqueoModal open={bloqueoOpen} onClose={() => setBloqueoOpen(false)} defaultDate={currentDate} />
    </div>
  );
}

function BloqueoOverlay({ bloqueo, dense }: { bloqueo: BloqueoMock; dense?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-dashed border-muted-foreground/30 bg-muted/60 text-muted-foreground",
        dense ? "px-1.5 py-1 text-[10px]" : "px-3 py-2 text-xs",
      )}
      title={bloqueo.motivo}
    >
      <Lock size={dense ? 11 : 13} className="shrink-0" />
      <span className="truncate">{BLOQUEO_LABEL[bloqueo.categoria]}</span>
    </div>
  );
}
