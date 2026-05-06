import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useLang } from "@/contexts/LanguageContext";
import { useMonthDisponibilidad } from "@/hooks/useMonthDisponibilidad";
import { MonthCalendar } from "./calendar/MonthCalendar";
import { TimeSlots } from "./calendar/TimeSlots";
import { ServiceSummary } from "./calendar/ServiceSummary";

export function StepFechaHora({
  servicioSlug,
  fecha,
  hora,
  onChange,
}: {
  servicioSlug: string | null;
  fecha: string | null;
  hora: string | null;
  onChange: (patch: { fecha?: string; hora?: string }) => void;
}) {
  const { t, lang } = useLang();

  const [currentMonth, setCurrentMonth] = useState(() =>
    fecha ? parseISO(fecha) : new Date(),
  );

  const { data: monthData, isLoading } = useMonthDisponibilidad(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );

  const selectedDate = useMemo(
    () => (fecha ? parseISO(fecha) : null),
    [fecha],
  );

  const availableDays = monthData?.availableDays ?? [];
  const slotsByDay = monthData?.slotsByDay ?? {};
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return slotsByDay[key] ?? [];
  }, [selectedDate, slotsByDay]);

  const handleSelectDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    onChange({ fecha: dateStr, hora: undefined });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr_240px]">
      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <ServiceSummary servicioSlug={servicioSlug} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            {lang === "es" ? "Cargando disponibilidad…" : "Loading availability…"}
          </div>
        ) : (
          <MonthCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            availableDays={availableDays}
            onSelectDate={handleSelectDate}
            onMonthChange={setCurrentMonth}
          />
        )}
      </div>

      <div className="min-h-[300px] rounded-2xl border border-border bg-card p-4">
        <TimeSlots
          selectedDate={selectedDate}
          availableSlots={availableSlots}
          selectedTime={hora ?? null}
          onSelectTime={(time) => onChange({ hora: time })}
        />
      </div>
    </div>
  );
}
