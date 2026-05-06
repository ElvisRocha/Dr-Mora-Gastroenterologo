import { useMemo } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { enUS, es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { cn } from "@/lib/cn";

type Props = {
  currentMonth: Date;
  selectedDate: Date | null;
  availableDays: string[];
  onSelectDate: (date: Date) => void;
  onMonthChange: (date: Date) => void;
};

export function MonthCalendar({
  currentMonth,
  selectedDate,
  availableDays,
  onSelectDate,
  onMonthChange,
}: Props) {
  const { lang } = useLang();
  const locale = lang === "es" ? es : enUS;
  const today = startOfDay(new Date());

  const dayNames =
    lang === "es"
      ? ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"]
      : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const isAvailable = (date: Date) =>
    availableDays.includes(format(date, "yyyy-MM-dd"));
  const isPast = (date: Date) => isBefore(date, today);
  const canGoPrev = !isBefore(
    startOfMonth(currentMonth),
    startOfMonth(today),
  );

  const monthLabel = format(currentMonth, "MMMM yyyy", { locale });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrev && onMonthChange(subMonths(currentMonth, 1))}
          disabled={!canGoPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
        <span className="font-medium capitalize text-foreground">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const selected = !!selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const dayPast = isPast(day);
          const dayAvailable = isAvailable(day);
          const clickable = inMonth && !dayPast && dayAvailable;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => clickable && onSelectDate(day)}
              disabled={!clickable}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-all",
                !inMonth && "text-muted-foreground/30",
                inMonth && dayPast && "cursor-not-allowed text-muted-foreground/40",
                inMonth &&
                  !dayPast &&
                  !dayAvailable &&
                  "cursor-not-allowed text-muted-foreground/40",
                inMonth &&
                  !dayPast &&
                  dayAvailable &&
                  !selected &&
                  "cursor-pointer text-foreground hover:bg-muted",
                selected && "bg-navy font-semibold text-offwhite",
                isToday && !selected && "ring-1 ring-navy/40",
              )}
            >
              {format(day, "d")}
              {inMonth && !dayPast && dayAvailable && !selected ? (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-leaf" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
