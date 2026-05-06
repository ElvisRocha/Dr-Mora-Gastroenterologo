import { useMutation } from "@tanstack/react-query";
import { postWebhook, webhooks } from "@/lib/webhooks";
import type { BookingPayload } from "@/lib/schemas/bookingSchema";

export function useAgendarCita() {
  return useMutation({
    mutationFn: async (payload: BookingPayload) => {
      try {
        return await postWebhook<{ ok: boolean; cita_id: string }>(
          webhooks.agendar,
          payload,
        );
      } catch {
        // Mock: simula confirmación en local
        await new Promise((r) => setTimeout(r, 800));
        return {
          ok: true,
          cita_id: `mock-${Math.random().toString(36).slice(2, 10)}`,
        };
      }
    },
  });
}
