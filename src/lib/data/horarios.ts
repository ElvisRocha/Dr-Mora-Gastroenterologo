// Horarios de atención por día de la semana (editable en Configuración).
// dia: 0=Dom … 6=Sáb (convención getDay()).

export type HorarioRango = {
  id: string;
  dia: number; // 0-6
  inicio: string; // "HH:mm"
  fin: string; // "HH:mm"
  activo: boolean;
};

export const DIAS_LABEL = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const DIAS_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Orden lunes-primero para la UI.
export const DIAS_ORDEN_LUNES = [1, 2, 3, 4, 5, 6, 0];

export const horariosSeed: HorarioRango[] = [
  { id: "h-lun-1", dia: 1, inicio: "09:00", fin: "14:00", activo: true },
  { id: "h-lun-2", dia: 1, inicio: "15:00", fin: "19:00", activo: true },
  { id: "h-mar-1", dia: 2, inicio: "09:00", fin: "14:00", activo: true },
  { id: "h-mar-2", dia: 2, inicio: "15:00", fin: "19:00", activo: true },
  { id: "h-mie-1", dia: 3, inicio: "09:00", fin: "14:00", activo: true },
  { id: "h-mie-2", dia: 3, inicio: "15:00", fin: "19:00", activo: true },
  { id: "h-jue-1", dia: 4, inicio: "09:00", fin: "14:00", activo: true },
  { id: "h-jue-2", dia: 4, inicio: "15:00", fin: "19:00", activo: true },
  { id: "h-vie-1", dia: 5, inicio: "09:00", fin: "17:00", activo: true },
  { id: "h-sab-1", dia: 6, inicio: "09:00", fin: "14:00", activo: true },
];

function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "p.m." : "a.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Agrupa rangos por día para mostrar "9:00 a.m. - 2:00 p.m., 3:00 - 7:00 p.m.". */
export function horarioDelDia(rangos: HorarioRango[], dia: number): string {
  const delDia = rangos
    .filter((r) => r.dia === dia && r.activo)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  if (delDia.length === 0) return "Cerrado";
  return delDia.map((r) => `${to12h(r.inicio)} - ${to12h(r.fin)}`).join(" · ");
}

/** ¿El consultorio está abierto ese día/minuto? Para sombrear el calendario. */
export function estaAbierto(
  rangos: HorarioRango[],
  dia: number,
  minutosDelDia: number,
): boolean {
  return rangos.some((r) => {
    if (r.dia !== dia || !r.activo) return false;
    const [hi, mi] = r.inicio.split(":").map(Number);
    const [hf, mf] = r.fin.split(":").map(Number);
    return minutosDelDia >= hi * 60 + mi && minutosDelDia < hf * 60 + mf;
  });
}
