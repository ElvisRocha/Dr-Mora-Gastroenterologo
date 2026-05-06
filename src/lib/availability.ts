import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  startOfDay,
  startOfMonth,
} from "date-fns";

export type MonthAvailability = {
  availableDays: string[];
  slotsByDay: Record<string, string[]>;
};

const SLOTS_FULL = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const SLOTS_FRIDAY = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const SLOTS_SATURDAY = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
];

export function getMockMonthAvailability(
  year: number,
  month: number,
): MonthAvailability {
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const startDate = isBefore(monthStart, today) ? today : monthStart;

  if (isBefore(monthEnd, startDate)) {
    return { availableDays: [], slotsByDay: {} };
  }

  const days = eachDayOfInterval({ start: startDate, end: monthEnd });
  const availableDays: string[] = [];
  const slotsByDay: Record<string, string[]> = {};

  for (const day of days) {
    const dow = day.getDay();
    if (dow === 0) continue;
    const dayStr = format(day, "yyyy-MM-dd");
    availableDays.push(dayStr);
    if (dow === 6) slotsByDay[dayStr] = SLOTS_SATURDAY;
    else if (dow === 5) slotsByDay[dayStr] = SLOTS_FRIDAY;
    else slotsByDay[dayStr] = SLOTS_FULL;
  }

  return { availableDays, slotsByDay };
}

export const formatTime12h = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

export const formatTimeDisplay = (time: string, use24h: boolean): string => {
  return use24h ? time : formatTime12h(time);
};
