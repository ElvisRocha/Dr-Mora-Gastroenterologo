export const webhooks = {
  agendar: import.meta.env.VITE_N8N_WEBHOOK_AGENDAR,
  disponibilidad: import.meta.env.VITE_N8N_WEBHOOK_DISPONIBILIDAD,
  actualizar: import.meta.env.VITE_N8N_WEBHOOK_ACTUALIZAR,
  seguimiento: import.meta.env.VITE_N8N_WEBHOOK_SEGUIMIENTO,
} as const;

export async function postWebhook<T = unknown>(
  url: string | undefined,
  payload: unknown,
): Promise<T> {
  if (!url) {
    throw new Error("Webhook URL no configurada");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Webhook fallo: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
