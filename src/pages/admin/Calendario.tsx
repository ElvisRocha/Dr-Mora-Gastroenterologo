import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ban,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Lock,
  Plus,
} from "lucide-react";
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
import { BloqueosListModal } from "@/components/admin/calendario/BloqueosListModal";

type View = "dia" | "semana" | "mes";

// ── Cuadrícula de 15 minutos (7:00 – 19:45), como el consultorio de referencia.
const FIRST_HOUR = 7;
const LAST_HOUR = 19;
const SLOT_MINUTES = 15;
const SLOTS_PER_HOUR = 60 / SLOT_MINUTES;
const SLOT_HEIGHT_REM = 1.5; // h-6 (24px) por franja de 15 min
const SLOT_COUNT = (LAST_HOUR - FIRST_HOUR + 1) * SLOTS_PER_HOUR;
const COL_HEIGHT_REM = SLOT_COUNT * SLOT_HEIGHT_REM;

type Slot = { index: number; hour: number; minute: number };
const SLOTS: Slot[] = Array.from({ length: SLOT_COUNT }, (_, i) => {
  const total = FIRST_HOUR * 60 + i * SLOT_MINUTES;
  return { index: i, hour: Math.floor(total / 60), minute: total % 60 };
});
const HOUR_LABELS = Array.from(
  { length: LAST_HOUR - FIRST_HOUR + 1 },
  (_, i) => FIRST_HOUR + i,
);

const WEEK_DAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const CLOSED_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, hsl(215 16% 60% / 0.10) 0, hsl(215 16% 60% / 0.10) 1px, transparent 1px, transparent 6px)",
};

// Colores de estado con la paleta primaria del sitio:
//  · Programadas (agendada)  → naranja (amber)
//  · Confirmadas             → azul pastel (navy suave)
//  · Completadas (realizada) → verde (leaf)
//  · No asistió              → gris (compacto)
//  · Canceladas              → coral (atenuado)
const ESTADO_STYLE: Record<CitaFull["estado"], string> = {
  agendada: "bg-amber/15 text-amber border-amber/30",
  confirmada: "bg-navy/10 text-navy border-navy/25",
  realizada: "bg-leaf/15 text-leaf border-leaf/30",
  cancelada: "bg-coral/12 text-coral border-coral/30 opacity-70",
  no_asistio: "bg-muted text-muted-foreground border-border",
};

// Posición vertical (rem) de un momento del día dentro de la cuadrícula.
const topRemFor = (hour: number, minute: number) =>
  (((hour - FIRST_HOUR) * 60 + minute) / SLOT_MINUTES) * SLOT_HEIGHT_REM;

export default function Calendario() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { citas, bloqueos, servicios, horarios } = useClinic();
  const [view, setView] = useState<View>("semana");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [agendarOpen, setAgendarOpen] = useState(false);
  const [agendarSeed, setAgendarSeed] = useState<{
    date?: Date;
    hour?: number;
    minute?: number;
  }>({});
  const [bloqueoOpen, setBloqueoOpen] = useState(false);
  const [bloqueosListOpen, setBloqueosListOpen] = useState(false);

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

  const citasForDay = (day: Date) =>
    citasEnRango.filter((c) => isSameDay(new Date(c.fechaHora), day));

  const bloqueosForDay = (day: Date) => {
    const ds = new Date(day);
    ds.setHours(FIRST_HOUR, 0, 0, 0);
    const de = new Date(day);
    de.setHours(LAST_HOUR + 1, 0, 0, 0);
    return bloqueos.filter((b) => {
      const bi = new Date(b.inicio).getTime();
      const bf = new Date(b.fin).getTime();
      return bi < de.getTime() && bf > ds.getTime();
    });
  };

  const slotCerrado = (day: Date, slot: Slot) =>
    !estaAbierto(horarios, day.getDay(), slot.hour * 60 + slot.minute);

  const openAgendar = (date?: Date, hour?: number, minute?: number) => {
    setAgendarSeed({ date, hour, minute });
    setAgendarOpen(true);
  };

  const formatRange = (cita: CitaFull) => {
    const start = new Date(cita.fechaHora);
    const minutes = cita.duracionMin || findDuracion(cita.servicioSlug);
    const startLabel = format(start, "h:mm a");
    if (!minutes) return startLabel;
    return `${startLabel} - ${format(addMinutes(start, minutes), "h:mm a")}`;
  };

  // Clic en una cita: abre el expediente. Si está agendada o confirmada, además
  // inicia la consulta (cronómetro). Realizadas/canceladas/no asistidas: ver.
  const openCita = (cita: CitaFull) => {
    const iniciable = cita.estado === "agendada" || cita.estado === "confirmada";
    navigate(
      `/admin/pacientes/${cita.pacienteId}`,
      iniciable ? { state: { fromCalendario: true, citaId: cita.id } } : undefined,
    );
  };

  // ── Bloque de cita posicionado por hora de inicio + duración ──────────────
  const CitaBlock = ({ cita }: { cita: CitaFull }) => {
    const start = new Date(cita.fechaHora);
    const dur = cita.duracionMin || findDuracion(cita.servicioSlug);
    const top = topRemFor(start.getHours(), start.getMinutes());
    const fullHeight = (dur / SLOT_MINUTES) * SLOT_HEIGHT_REM;
    const paciente = pacientePorId(cita.pacienteId);
    const src = SOURCE_CONFIG[cita.source];
    const nombrePaciente = paciente
      ? `${paciente.nombre} ${paciente.apellidoPaterno}`
      : (cita.pacienteNombre ?? "Sin paciente");

    // "No asistió" se muestra compacto (poco tamaño): media altura y una sola
    // línea con el nombre, para que reste protagonismo en la agenda.
    const compact = cita.estado === "no_asistio";
    const height = compact
      ? Math.min(fullHeight, SLOT_HEIGHT_REM * 1.5)
      : fullHeight;

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => openCita(cita)}
        onKeyDown={(e) => {
          if (e.key === "Enter") openCita(cita);
        }}
        className={cn(
          "group absolute left-1 right-1 z-10 cursor-pointer overflow-hidden rounded-md border px-2 py-0.5 text-left transition-shadow hover:z-20 hover:shadow-md",
          ESTADO_STYLE[cita.estado],
        )}
        style={{ top: `${top}rem`, height: `${height}rem` }}
      >
        {compact ? (
          <div className="flex items-center justify-between gap-1">
            <p className="truncate text-[10px] font-medium leading-tight">
              <span className="opacity-70">No asistió · </span>
              {nombrePaciente}
            </p>
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <CitaActionsMenu cita={cita} compact />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-1">
              <p className="truncate text-[11px] font-medium leading-tight">
                {servicioNombre(cita.servicioSlug)}
              </p>
              <div className="flex shrink-0 items-center gap-0.5">
                <src.Icon size={11} className={cn(src.color, "shrink-0")} />
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <CitaActionsMenu cita={cita} compact />
                </div>
              </div>
            </div>
            <p className="truncate text-[11px] leading-tight">{nombrePaciente}</p>
            <p className="truncate font-mono text-[10px] leading-tight opacity-80">
              {formatRange(cita)}
            </p>
          </>
        )}
      </div>
    );
  };

  const BloqueoBlock = ({ bloqueo, day }: { bloqueo: BloqueoMock; day: Date }) => {
    const ds = new Date(day);
    ds.setHours(FIRST_HOUR, 0, 0, 0);
    const de = new Date(day);
    de.setHours(LAST_HOUR + 1, 0, 0, 0);
    const s = Math.max(new Date(bloqueo.inicio).getTime(), ds.getTime());
    const e = Math.min(new Date(bloqueo.fin).getTime(), de.getTime());
    if (e <= s) return null;
    const sd = new Date(s);
    const top = topRemFor(sd.getHours(), sd.getMinutes());
    const height = ((e - s) / 60000 / SLOT_MINUTES) * SLOT_HEIGHT_REM;
    return (
      <div
        className="absolute left-0.5 right-0.5 z-[6] flex items-start gap-1 overflow-hidden rounded-md border border-dashed border-muted-foreground/30 bg-muted/80 px-2 py-1 text-[10px] text-muted-foreground"
        style={{ top: `${top}rem`, height: `${height}rem` }}
        title={bloqueo.motivo}
      >
        <Lock size={10} className="mt-0.5 shrink-0" />
        <span className="truncate font-medium">{BLOQUEO_LABEL[bloqueo.categoria]}</span>
      </div>
    );
  };

  const NowLine = ({ day }: { day: Date }) => {
    if (!isSameDay(now, day)) return null;
    const h = now.getHours();
    if (h < FIRST_HOUR || h > LAST_HOUR) return null;
    const top = topRemFor(h, now.getMinutes());
    return (
      <div
        className="pointer-events-none absolute inset-x-0 z-30 flex items-center"
        style={{ top: `${top}rem` }}
      >
        <span className="h-2 w-2 shrink-0 -translate-x-1/2 rounded-full bg-coral" />
        <span className="h-px flex-1 bg-coral" />
      </div>
    );
  };

  // ── Columna de un día: cuadrícula clickeable + overlays ───────────────────
  const DayColumn = ({ day }: { day: Date }) => {
    const dayCitas = citasForDay(day);
    const dayBloqueos = bloqueosForDay(day);
    return (
      <div
        className="relative min-w-0 flex-1 border-r border-border last:border-r-0"
        style={{ height: `${COL_HEIGHT_REM}rem` }}
      >
        {/* Cuadrícula: cada franja de 15 min es un espacio clickeable. */}
        {SLOTS.map((slot) => {
          const cerrado = slotCerrado(day, slot);
          const isHour = slot.minute === 0;
          return (
            <button
              key={slot.index}
              type="button"
              disabled={cerrado}
              onClick={() => openAgendar(day, slot.hour, slot.minute)}
              className={cn(
                "group/slot block w-full border-b",
                isHour ? "border-border/60" : "border-border/25",
                cerrado ? "cursor-default" : "hover:bg-navy/5",
              )}
              style={{
                height: `${SLOT_HEIGHT_REM}rem`,
                ...(cerrado ? CLOSED_STYLE : {}),
              }}
              aria-label={
                cerrado
                  ? "Fuera de horario"
                  : `Agendar ${slot.hour}:${String(slot.minute).padStart(2, "0")}`
              }
            >
              {!cerrado ? (
                <Plus
                  size={12}
                  className="mx-auto text-navy/50 opacity-0 transition-opacity group-hover/slot:opacity-100"
                />
              ) : null}
            </button>
          );
        })}

        <NowLine day={day} />
        {dayBloqueos.map((b) => (
          <BloqueoBlock key={b.id} bloqueo={b} day={day} />
        ))}
        {dayCitas.map((c) => (
          <CitaBlock key={c.id} cita={c} />
        ))}
      </div>
    );
  };

  const TimeGutter = () => (
    <div
      className="relative w-14 shrink-0 border-r border-border"
      style={{ height: `${COL_HEIGHT_REM}rem` }}
    >
      {HOUR_LABELS.map((h) => (
        <div
          key={h}
          className="absolute right-2 pt-0.5 font-mono text-[11px] text-muted-foreground"
          style={{ top: `${topRemFor(h, 0)}rem` }}
        >
          {h}:00
        </div>
      ))}
    </div>
  );

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
            <Ban size={15} />
            Bloquear horario
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBloqueosListOpen(true)}
          >
            <Lock size={15} />
            Bloqueos
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
        <div className="overflow-auto rounded-2xl border border-border bg-card">
          <div className="min-w-[420px]">
            <div className="sticky top-0 z-20 flex border-b border-border bg-muted/30">
              <div className="w-14 shrink-0 border-r border-border" />
              <div className="flex-1 px-2 py-2 text-center">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {format(currentDate, "EEEE", { locale: es })}
                </p>
                <p className={cn("text-base font-bold", isToday(currentDate) ? "text-navy" : "text-foreground")}>
                  {format(currentDate, "d")}
                </p>
              </div>
            </div>
            <div className="flex">
              <TimeGutter />
              <DayColumn day={currentDate} />
            </div>
          </div>
        </div>
      ) : view === "semana" ? (
        <div className="overflow-auto rounded-2xl border border-border bg-card">
          <div className="min-w-[900px]">
            <div className="sticky top-0 z-20 flex border-b border-border bg-muted/30">
              <div className="w-14 shrink-0 border-r border-border" />
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
            <div className="flex">
              <TimeGutter />
              {weekDays.map((day) => (
                <DayColumn key={day.toISOString()} day={day} />
              ))}
            </div>
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
        defaultMinute={agendarSeed.minute}
      />
      <BloqueoModal open={bloqueoOpen} onClose={() => setBloqueoOpen(false)} defaultDate={currentDate} />
      <BloqueosListModal
        open={bloqueosListOpen}
        onClose={() => setBloqueosListOpen(false)}
      />
    </div>
  );
}
