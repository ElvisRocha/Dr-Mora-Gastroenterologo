import { useQuery } from "@tanstack/react-query";
import { postWebhook, webhooks } from "@/lib/webhooks";

type Slot = { start: string; end: string };

export function useDisponibilidad(servicioSlug: string | null, fecha: string | null) {
  return useQuery<Slot[]>({
    queryKey: ["disponibilidad", servicioSlug, fecha],
    enabled: Boolean(servicioSlug && fecha),
    queryFn: async () => {
      try {
        const res = await postWebhook<{ slots: Slot[] }>(webhooks.disponibilidad, {
          servicio_slug: servicioSlug,
          fecha,
          timezone: import.meta.env.VITE_TIMEZONE,
        });
        return res.slots ?? [];
      } catch (err) {
        // Mock fallback: 9:00–18:00 cada 30 min, descartando algunos
        const base = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "16:00", "16:30", "17:00", "17:30"];
        const seed = (fecha ?? "").split("-").reduce((a, b) => a + Number(b), 0);
        return base
          .filter((_, i) => (seed + i) % 4 !== 0)
          .map((hora) => ({
            start: `${fecha}T${hora}:00`,
            end: `${fecha}T${hora}:00`,
          }));
      }
    },
  });
}
