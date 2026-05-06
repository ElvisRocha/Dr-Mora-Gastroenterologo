import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
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
import { citasMock, pacientePorId, serviciosMock, type CitaMock } from "@/lib/mock";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type View = "dia" | "semana" | "mes";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9:00 - 19:00
const WEEK_DAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const ESTADO_STYLE: Record<CitaMock["estado"], string> = {
  agendada: "bg-navy/10 text-navy border-navy/20",
  confirmada: "bg-leaf/15 text-leaf border-leaf/30",
  realizada: "bg-muted text-muted-foreground border-border",
  cancelada: "bg-coral/15 text-coral border-coral/30",
  no_asistio: "bg-amber/15 text-amber border-amber/30",
};

export default function Calendario() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("semana");
  const [currentDate, setCurrentDate] = useState(new Date());

  const findServicio = (slug: string) =>
    t.servicios.items.find((s) => s.slug === slug);

  const findDuracion = (slug: string) =>
    serviciosMock.find((s) => s.slug === slug)?.duracion ?? 0;

  const { rangeStart, rangeEnd } = useMemo(() => {
    if (view === "dia") {
      return {
        rangeStart: startOfDay(currentDate),
        rangeEnd: endOfDay(currentDate),
      };
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

  const citas = useMemo(
    () =>
      citasMock.filter((c) => {
        const ts = new Date(c.fechaHora).getTime();
        return ts >= rangeStart.getTime() && ts <= rangeEnd.getTime();
      }),
    [rangeStart, rangeEnd],
  );

  const goToday = () => setCurrentDate(new Date());
  const goPrev = () =>
    setCurrentDate((d) => {
      if (view === "dia") return subDays(d, 1);
      if (view === "semana") return subWeeks(d, 1);
      return subMonths(d, 1);
    });
  const goNext = () =>
    setCurrentDate((d) => {
      if (view === "dia") return addDays(d, 1);
      if (view === "semana") return addWeeks(d, 1);
      return addMonths(d, 1);
    });

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
    citas.filter((c) => {
      const dt = new Date(c.fechaHora);
      return isSameDay(dt, day) && dt.getHours() === hour;
    });

  const citasForDay = (day: Date) =>
    citas.filter((c) => isSameDay(new Date(c.fechaHora), day));

  const handleDayClickInMonth = (day: Date) => {
    setCurrentDate(day);
    setView("dia");
  };

  const goToPaciente = (cita: CitaMock) => {
    navigate(`/admin/pacientes/${cita.pacienteId}`);
  };

  const formatRange = (cita: CitaMock) => {
    const start = new Date(cita.fechaHora);
    const minutes = cita.duracionMin || findDuracion(cita.servicioSlug);
    const startLabel = format(start, "h:mm a");
    if (!minutes) return startLabel;
    const end = addMinutes(start, minutes);
    return `${startLabel} - ${format(end, "h:mm a")}`;
  };

  const headerLabel = (() => {
    if (view === "dia") {
      return format(currentDate, "EEEE, dd 'de' MMMM yyyy", { locale: es });
    }
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
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Agenda
        </h2>
        <div
          className="inline-flex items-center rounded-full border border-border bg-muted/40 p-1"
          role="tablist"
          aria-label="Vista"
        >
          {(["dia", "semana", "mes"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
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
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            className="h-9 w-9 p-0"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            className="h-9 w-9 p-0"
            aria-label="Siguiente"
          >
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
          {citas.length} cita{citas.length !== 1 ? "s" : ""}
        </div>
      </div>

      {view === "dia" ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {HOURS.map((hour) => {
            const hourCitas = getCitasForDayHour(currentDate, hour);
            return (
              <div
                key={hour}
                className="flex min-h-[3.5rem] border-b border-border last:border-0"
              >
                <div className="flex w-16 shrink-0 items-start justify-end border-r border-border p-2 font-mono text-xs text-muted-foreground">
                  {`${hour}:00`}
                </div>
                <div className="flex-1 space-y-1 p-1">
                  {hourCitas.map((cita) => {
                    const servicio = findServicio(cita.servicioSlug);
                    const paciente = pacientePorId(cita.pacienteId);
                    return (
                      <button
                        key={cita.id}
                        type="button"
                        onClick={() => goToPaciente(cita)}
                        className={cn(
                          "block w-full rounded-md border px-3 py-2 text-left transition-shadow hover:shadow-sm",
                          ESTADO_STYLE[cita.estado],
                        )}
                      >
                        <p className="truncate text-sm font-medium">
                          {servicio?.nombre ?? cita.servicioSlug}
                        </p>
                        <p className="truncate text-sm">
                          {paciente
                            ? `${paciente.nombre} ${paciente.apellidoPaterno}`
                            : "Sin paciente"}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 font-mono text-xs opacity-80">
                          <Clock size={12} className="shrink-0" />
                          <span>{formatRange(cita)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : view === "semana" ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <div className="min-w-[640px]">
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
                    <p
                      className={cn(
                        "text-base font-bold",
                        today ? "text-navy" : "text-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </p>
                  </div>
                );
              })}
            </div>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex min-h-[3.5rem] border-b border-border last:border-0"
              >
                <div className="flex w-16 shrink-0 items-start justify-end border-r border-border p-2 font-mono text-xs text-muted-foreground">
                  {`${hour}:00`}
                </div>
                {weekDays.map((day) => {
                  const cellCitas = getCitasForDayHour(day, hour);
                  return (
                    <div
                      key={day.toISOString()}
                      className="min-w-0 flex-1 space-y-1 border-r border-border p-1 last:border-r-0"
                    >
                      {cellCitas.map((cita) => {
                        const servicio = findServicio(cita.servicioSlug);
                        const paciente = pacientePorId(cita.pacienteId);
                        return (
                          <button
                            key={cita.id}
                            type="button"
                            onClick={() => goToPaciente(cita)}
                            className={cn(
                              "block w-full rounded border px-1.5 py-1 text-left transition-shadow hover:shadow-sm",
                              ESTADO_STYLE[cita.estado],
                            )}
                          >
                            <p className="truncate text-[11px] font-medium leading-tight">
                              {servicio?.nombre ?? cita.servicioSlug}
                            </p>
                            <p className="truncate text-[11px] leading-tight">
                              {paciente
                                ? `${paciente.nombre} ${paciente.apellidoPaterno}`
                                : "Sin paciente"}
                            </p>
                            <p className="font-mono text-[10px] leading-tight opacity-80">
                              {formatRange(cita)}
                            </p>
                          </button>
                        );
                      })}
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
              const dayCitas = citasForDay(day);
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDayClickInMonth(day)}
                  className={cn(
                    "min-h-[5.5rem] border-b border-r border-border p-2 text-left transition-colors last:border-r-0 hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-inset",
                    today && "bg-navy/5",
                    !inMonth && "bg-muted/20",
                  )}
                >
                  <div className="mb-1 flex items-center justify-start">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        today &&
                          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-offwhite",
                        !today && inMonth && "text-foreground",
                        !today && !inMonth && "text-muted-foreground/60",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  {dayCitas.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                      <span
                        className={cn(
                          "font-medium",
                          inMonth ? "text-navy" : "text-muted-foreground",
                        )}
                      >
                        {dayCitas.length} cita{dayCitas.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
