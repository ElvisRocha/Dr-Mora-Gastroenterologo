import type { CitaMock } from "@/lib/mock";

// Generación determinista de una agenda "poblada" (~80% de los espacios
// abiertos ocupados) para los próximos ~3 meses + las últimas ~2 semanas
// (para mostrar también estados pasados: realizada / no asistió / cancelada).

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SERVICIOS: { slug: string; dur: number; peso: number }[] = [
  { slug: "consulta-gastro", dur: 45, peso: 34 },
  { slug: "seguimiento-cronico", dur: 30, peso: 24 },
  { slug: "nutricion", dur: 45, peso: 13 },
  { slug: "aliento", dur: 30, peso: 8 },
  { slug: "phmetria", dur: 30, peso: 6 },
  { slug: "endoscopia-alta", dur: 45, peso: 6 },
  { slug: "colonoscopia", dur: 60, peso: 5 },
  { slug: "manometria", dur: 45, peso: 4 },
];
const PESO_TOTAL = SERVICIOS.reduce((a, s) => a + s.peso, 0);

// Ventanas abiertas por día (0=Dom … 6=Sáb), en minutos; la hora de comida
// (14:00–15:00) se excluye siempre para no chocar con el bloqueo de comida.
function ventanas(dia: number): [number, number][] {
  if (dia === 0) return []; // domingo cerrado
  if (dia >= 1 && dia <= 4) return [[9 * 60, 14 * 60], [15 * 60, 19 * 60]];
  if (dia === 5) return [[9 * 60, 14 * 60], [15 * 60, 17 * 60]];
  if (dia === 6) return [[9 * 60, 14 * 60]];
  return [];
}

type Estado = CitaMock["estado"];

function pickEstado(
  citaMs: number,
  todayMs: number,
  rnd: () => number,
): Estado {
  if (citaMs < todayMs) {
    const r = rnd();
    if (r < 0.72) return "realizada";
    if (r < 0.86) return "no_asistio";
    return "cancelada";
  }
  const diasAdelante = (citaMs - todayMs) / 86_400_000;
  const r = rnd();
  if (diasAdelante <= 12) {
    if (r < 0.55) return "confirmada";
    if (r < 0.95) return "agendada";
    return "cancelada";
  }
  if (r < 0.12) return "confirmada";
  if (r < 0.96) return "agendada";
  return "cancelada";
}

export function generarCitas(pacientes: { id: string }[]): CitaMock[] {
  if (pacientes.length === 0) return [];
  const rnd = mulberry32(0x0c17a5);
  const citas: CitaMock[] = [];

  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const todayMs = midnight.getTime();

  const pickServicio = () => {
    let r = rnd() * PESO_TOTAL;
    for (const s of SERVICIOS) {
      r -= s.peso;
      if (r <= 0) return s;
    }
    return SERVICIOS[0];
  };
  const pickPaciente = () =>
    pacientes[Math.floor(rnd() * pacientes.length)].id;

  let n = 1;
  for (let offset = -14; offset <= 92; offset++) {
    const day = new Date(midnight);
    day.setDate(day.getDate() + offset);
    const wins = ventanas(day.getDay());
    if (wins.length === 0) continue;

    for (const [ws, we] of wins) {
      let cursor = ws;
      while (cursor + 30 <= we) {
        // ~80% de probabilidad de ocupar el espacio; el resto queda como hueco.
        if (rnd() < 0.8) {
          const svc = pickServicio();
          let dur = svc.dur;
          if (cursor + dur > we) dur = 30;
          if (cursor + dur > we) {
            cursor += 30;
            continue;
          }
          const dt = new Date(day);
          dt.setHours(Math.floor(cursor / 60), cursor % 60, 0, 0);
          citas.push({
            id: `cg-${n++}`,
            pacienteId: pickPaciente(),
            servicioSlug: svc.slug,
            fechaHora: dt.toISOString(),
            duracionMin: dur,
            estado: pickEstado(dt.getTime(), todayMs, rnd),
          });
          cursor += dur;
        } else {
          cursor += 30;
        }
      }
    }
  }

  return citas;
}
