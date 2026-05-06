import { useState } from "react";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useLang } from "@/contexts/LanguageContext";
import { formatTimeDisplay } from "@/lib/availability";
import { cn } from "@/lib/cn";

type Props = {
  selectedDate: Date | null;
  availableSlots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
};

export function TimeSlots({
  selectedDate,
  availableSlots,
  selectedTime,
  onSelectTime,
}: Props) {
  const { t, lang } = useLang();
  const [use24h, setUse24h] = useState(false);
  const locale = lang === "es" ? es : enUS;

  if (!selectedDate) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t.booking.seleccionarFecha}
        </p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">{t.booking.sinSlots}</p>
      </div>
    );
  }

  const dayLabel = format(selectedDate, "EEE dd", { locale });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium capitalize text-foreground">
          {dayLabel}
        </span>
        <div className="flex items-center rounded-full bg-muted p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setUse24h(false)}
            className={cn(
              "rounded-full px-2 py-1 transition-all",
              !use24h
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            12h
          </button>
          <button
            type="button"
            onClick={() => setUse24h(true)}
            className={cn(
              "rounded-full px-2 py-1 transition-all",
              use24h
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            24h
          </button>
        </div>
      </div>

      <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
        {availableSlots.map((time) => {
          const selected = selectedTime === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-all",
                selected
                  ? "border-navy bg-navy text-offwhite"
                  : "border-border hover:border-navy/40 hover:bg-muted/30",
              )}
              aria-pressed={selected}
            >
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  selected ? "bg-offwhite" : "bg-leaf",
                )}
              />
              <span className="font-medium">
                {formatTimeDisplay(time, use24h)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
