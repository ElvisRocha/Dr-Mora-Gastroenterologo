import { useQuery } from "@tanstack/react-query";
import { postWebhook, webhooks } from "@/lib/webhooks";
import {
  getMockMonthAvailability,
  type MonthAvailability,
} from "@/lib/availability";

export function useMonthDisponibilidad(year: number, month: number) {
  return useQuery<MonthAvailability>({
    queryKey: ["disponibilidad-mes", year, month],
    queryFn: async () => {
      try {
        const res = await postWebhook<MonthAvailability>(
          webhooks.disponibilidad,
          {
            year,
            month: month + 1,
            timezone: import.meta.env.VITE_TIMEZONE,
          },
        );
        return {
          availableDays: res.availableDays ?? [],
          slotsByDay: res.slotsByDay ?? {},
        };
      } catch {
        return getMockMonthAvailability(year, month);
      }
    },
  });
}
