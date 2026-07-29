// Helpers de tiempo relativos para data mock. Todo se ancla a "ahora" para que
// la demo siempre luzca vigente sin importar la fecha en que se ejecute.

export function nowISO(): string {
  return new Date().toISOString();
}

/** ISO hace `mins` minutos. */
export function agoMin(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

/** ISO hace `hrs` horas. */
export function agoHr(hrs: number): string {
  return agoMin(hrs * 60);
}

/** ISO hace `days` días. */
export function agoDay(days: number): string {
  return agoMin(days * 60 * 24);
}

/** ISO dentro de `days` días a la hora indicada (hora local). */
export function atDay(offsetDays: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** ISO dentro de `mins` minutos. */
export function inMin(mins: number): string {
  return new Date(Date.now() + mins * 60_000).toISOString();
}
