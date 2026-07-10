import { serviciosSeed, type ServicioCategoria } from "./servicios";

// ===========================================================================
// Dataset analítico dedicado para el Dashboard (indicadores financieros,
// operativos y de servicios). Data abundante y DETERMINISTA (PRNG con semilla)
// para que la demo luzca llena y estable entre recargas. Montos en colones.
// No se persiste: se genera una vez y los filtros operan en memoria.
// ===========================================================================

export type AnalyticsEstado =
  | "agendada"
  | "confirmada"
  | "completada"
  | "cancelada"
  | "no_asistio";

/** Quién registró la cita (responsable / canal). */
export type AnalyticsCanal = "gastrito" | "web" | "recepcion" | "doctor";

export const CANAL_LABEL: Record<AnalyticsCanal, string> = {
  gastrito: "Gastrito (IA)",
  web: "Paciente (web)",
  recepcion: "Recepción",
  doctor: "Dr. Mora",
};

export type AnalyticsCita = {
  id: string;
  /** Fecha/hora de la cita. */
  fecha: string;
  /** Cuándo se registró la cita. */
  creada: string;
  servicioId: string;
  servicioNombre: string;
  categoria: ServicioCategoria;
  /** Precio de lista (colones). */
  precio: number;
  /** Monto cobrado (con posibles descuentos). */
  monto: number;
  estado: AnalyticsEstado;
  reprogramada: boolean;
  canal: AnalyticsCanal;
  duracionEstimadaMin: number;
  /** Solo en completadas. */
  duracionRealMin?: number;
  /** La cita se registró fuera del horario público de la clínica. */
  creadaFueraHorario: boolean;
  /** Provino de un lead nuevo que escribió a Gastrito. */
  esLeadNuevo: boolean;
};

// --- PRNG determinista (mulberry32) --------------------------------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260710);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
const chance = (p: number) => rnd() < p;
const between = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));

// Horario público (para "fuera de horario"). 0=Dom … 6=Sáb.
function abiertoEn(d: Date): boolean {
  const dia = d.getDay();
  const min = d.getHours() * 60 + d.getMinutes();
  if (dia === 0) return false; // domingo
  const rangos: [number, number][] =
    dia === 5
      ? [[9 * 60, 17 * 60]]
      : dia === 6
        ? [[9 * 60, 14 * 60]]
        : [
            [9 * 60, 14 * 60],
            [15 * 60, 19 * 60],
          ];
  return rangos.some(([a, b]) => min >= a && min < b);
}

// Distribución de servicios ponderada (los de consulta son mucho más comunes).
const SERVICIO_PESOS: Record<string, number> = {
  "consulta-gastro": 34,
  "seguimiento-cronico": 24,
  nutricion: 16,
  aliento: 8,
  phmetria: 5,
  manometria: 4,
  "endoscopia-alta": 3,
  colonoscopia: 3,
};

const servicioPool: string[] = [];
for (const s of serviciosSeed) {
  const peso = SERVICIO_PESOS[s.id] ?? 4;
  for (let i = 0; i < peso; i++) servicioPool.push(s.id);
}

const CANAL_POOL: AnalyticsCanal[] = [
  ...Array(9).fill("gastrito"),
  ...Array(6).fill("web"),
  ...Array(7).fill("recepcion"),
  ...Array(3).fill("doctor"),
];

function generarCitas(): AnalyticsCita[] {
  const citas: AnalyticsCita[] = [];
  const year = 2026;
  let idc = 0;

  // Volumen mensual con estacionalidad suave (más en temporada escolar).
  const volumenMes = [230, 235, 250, 245, 240, 235, 262, 258, 268, 272, 255, 210];

  for (let mes = 0; mes < 12; mes++) {
    const total = volumenMes[mes];
    for (let i = 0; i < total; i++) {
      // Día del mes en día hábil (evita domingos).
      let dia = between(1, 28);
      const base = new Date(year, mes, dia);
      if (base.getDay() === 0) dia = Math.min(dia + 1, 28);

      // Hora de la cita dentro del horario de atención.
      const bloques = [9, 10, 11, 12, 13, 15, 16, 17, 18];
      const hora = pick(bloques);
      const minuto = pick([0, 15, 30, 45]);
      const fecha = new Date(year, mes, dia, hora, minuto, 0, 0);

      const servicioId = pick(servicioPool);
      const svc = serviciosSeed.find((s) => s.id === servicioId)!;

      // Estado según si la cita ya pasó o es futura (relativo a "hoy" = jul 2026).
      const hoy = new Date(year, 6, 10);
      const esPasada = fecha < hoy;
      let estado: AnalyticsEstado;
      if (esPasada) {
        const r = rnd();
        estado = r < 0.72 ? "completada" : r < 0.86 ? "cancelada" : "no_asistio";
      } else {
        estado = chance(0.38) ? "confirmada" : "agendada";
      }

      // Canal / responsable.
      const canal = pick(CANAL_POOL);

      // Registro de la cita: entre 1 y 20 días antes, a cualquier hora.
      const diasAntes = between(1, 20);
      const creada = new Date(fecha);
      creada.setDate(creada.getDate() - diasAntes);
      // Canales automáticos (gastrito/web) registran a cualquier hora; humanos en horario.
      const autom = canal === "gastrito" || canal === "web";
      creada.setHours(
        autom ? between(6, 23) : between(9, 18),
        pick([0, 15, 30, 45]),
        0,
        0,
      );
      const creadaFueraHorario = !abiertoEn(creada);

      // Monto: precio de lista con descuento ocasional.
      let monto = svc.precio;
      if (chance(0.08)) monto = Math.round(svc.precio * (0.85 + rnd() * 0.1));

      // Duración real vs estimada (solo completadas).
      let duracionRealMin: number | undefined;
      if (estado === "completada") {
        const factor = 0.8 + rnd() * 0.6; // 80%–140%
        duracionRealMin = Math.max(
          10,
          Math.round((svc.duracionMin * factor) / 5) * 5,
        );
      }

      citas.push({
        id: `an-${year}-${idc++}`,
        fecha: fecha.toISOString(),
        creada: creada.toISOString(),
        servicioId,
        servicioNombre: svc.nombre,
        categoria: svc.categoria,
        precio: svc.precio,
        monto,
        estado,
        reprogramada: chance(0.12),
        canal,
        duracionEstimadaMin: svc.duracionMin,
        duracionRealMin,
        creadaFueraHorario: autom ? creadaFueraHorario : false,
        esLeadNuevo: canal === "gastrito" && chance(0.5),
      });
    }
  }
  return citas;
}

export const analyticsCitas: AnalyticsCita[] = generarCitas();

// Leads que escribieron a Gastrito (para "Conversión de Gastrito (IA)").
// Solo una fracción termina agendando.
export const leadsGastritoPorMes: { mes: number; leads: number; agendaron: number }[] =
  Array.from({ length: 12 }, (_, mes) => {
    const agendaron = analyticsCitas.filter(
      (c) => c.esLeadNuevo && new Date(c.fecha).getMonth() === mes,
    ).length;
    const leads = Math.round(agendaron / (0.18 + (mes % 3) * 0.03)) + 8;
    return { mes, leads, agendaron };
  });

export const MESES_CORTO = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
