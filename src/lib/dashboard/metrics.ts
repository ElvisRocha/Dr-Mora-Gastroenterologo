import {
  analyticsCitas,
  leadsGastritoPorMes,
  CANAL_LABEL,
  type AnalyticsCita,
  type AnalyticsCanal,
  type AnalyticsEstado,
} from "@/lib/data/analytics";
import { serviciosSeed, type ServicioCategoria, CATEGORIA_LABEL } from "@/lib/data/servicios";

// "Presente" de la demo: la data está anclada a 2026. Fijamos hoy para que los
// KPIs (pasado vs futuro) sean estables sin importar el reloj real.
export const DEMO_HOY = new Date(2026, 6, 10, 12, 0, 0);

// ---------------------------------------------------------------------------
// Formatters (colones)
// ---------------------------------------------------------------------------
export const CRC = (n: number) => `₡${Math.round(n).toLocaleString("es-CR")}`;
export const INT = (n: number) => Math.round(n).toLocaleString("es-CR");
export function CRC_K(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `₡${(n / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (abs >= 1_000) return `₡${Math.round(n / 1_000)}K`;
  return `₡${Math.round(n)}`;
}
export function hourAmPm(h: number, long = false): string {
  const period = h < 12 ? (long ? "AM" : "am") : long ? "PM" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return long ? `${h12}:00 ${period}` : `${h12}${period}`;
}

export const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const DOW_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const ESTADO_LABEL: Record<AnalyticsEstado, string> = {
  agendada: "Agendada",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
  no_asistio: "No asistió",
};

// ---------------------------------------------------------------------------
// Filtros
// ---------------------------------------------------------------------------
export type FiltroState = {
  years: number[];
  months: number[]; // 1-12
  from: string; // yyyy-MM-dd
  to: string;
  servicios: string[];
  categorias: ServicioCategoria[];
  estados: AnalyticsEstado[];
};

export const initialFiltros: FiltroState = {
  years: [2026],
  months: [7],
  from: "",
  to: "",
  servicios: [],
  categorias: [],
  estados: [],
};

export function rangoExactoActivo(f: FiltroState) {
  return Boolean(f.from && f.to);
}

export function anyFilter(f: FiltroState): boolean {
  return (
    f.servicios.length > 0 ||
    f.categorias.length > 0 ||
    f.estados.length > 0 ||
    rangoExactoActivo(f) ||
    !(f.years.length === 1 && f.years[0] === 2026) ||
    !(f.months.length === 1 && f.months[0] === 7)
  );
}

type FilterOpts = {
  ignorePeriodo?: boolean;
  ignoreCategoria?: boolean;
  ignoreServicio?: boolean;
  ignoreEstado?: boolean;
};

export function applyFilters(
  citas: AnalyticsCita[],
  f: FiltroState,
  opts: FilterOpts = {},
): AnalyticsCita[] {
  const exact = rangoExactoActivo(f);
  const fromT = exact ? new Date(`${f.from}T00:00:00`).getTime() : 0;
  const toT = exact ? new Date(`${f.to}T23:59:59`).getTime() : 0;

  return citas.filter((c) => {
    const d = new Date(c.fecha);
    if (!opts.ignorePeriodo) {
      if (exact) {
        const t = d.getTime();
        if (t < fromT || t > toT) return false;
      } else {
        if (f.years.length && !f.years.includes(d.getFullYear())) return false;
        if (f.months.length && !f.months.includes(d.getMonth() + 1)) return false;
      }
    }
    if (!opts.ignoreCategoria && f.categorias.length && !f.categorias.includes(c.categoria))
      return false;
    if (!opts.ignoreServicio && f.servicios.length && !f.servicios.includes(c.servicioId))
      return false;
    if (!opts.ignoreEstado && f.estados.length && !f.estados.includes(c.estado))
      return false;
    return true;
  });
}

/** Filtro del período anterior (YoY para año/mes; ventana previa para rango). */
export function prevFiltro(f: FiltroState): FiltroState | null {
  if (rangoExactoActivo(f)) {
    const from = new Date(`${f.from}T00:00:00`);
    const to = new Date(`${f.to}T23:59:59`);
    const len = to.getTime() - from.getTime();
    const prevTo = new Date(from.getTime() - 86400000);
    const prevFrom = new Date(prevTo.getTime() - len);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    return { ...f, from: iso(prevFrom), to: iso(prevTo) };
  }
  if (!f.years.length) return null;
  return { ...f, years: f.years.map((y) => y - 1) };
}

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------
export type Kpis = {
  ingresosRealizados: number;
  ingresosProyectados: number;
  ticketPromedio: number;
  citasCompletadas: number;
  tasaCompletitud: number;
  noShow: number;
  duracionPromedio: number;
  citasTotal: number;
};

export function computeKpis(filtered: AnalyticsCita[]): Kpis {
  const completadas = filtered.filter((c) => c.estado === "completada");
  const ingresosRealizados = completadas.reduce((a, c) => a + c.monto, 0);
  const ingresosProyectados = filtered
    .filter(
      (c) =>
        (c.estado === "agendada" || c.estado === "confirmada") &&
        new Date(c.fecha) > DEMO_HOY,
    )
    .reduce((a, c) => a + c.monto, 0);
  const pasadas = filtered.filter((c) => new Date(c.fecha) <= DEMO_HOY);
  const pasadasResueltas = pasadas.filter((c) =>
    ["completada", "cancelada", "no_asistio"].includes(c.estado),
  );
  const noShowCount = pasadas.filter((c) => c.estado === "no_asistio").length;
  const durReal = completadas
    .map((c) => c.duracionRealMin)
    .filter((x): x is number => x != null);
  return {
    ingresosRealizados,
    ingresosProyectados,
    ticketPromedio: completadas.length ? ingresosRealizados / completadas.length : 0,
    citasCompletadas: completadas.length,
    tasaCompletitud: pasadasResueltas.length
      ? (completadas.length / pasadasResueltas.length) * 100
      : 0,
    noShow: pasadas.length ? (noShowCount / pasadas.length) * 100 : 0,
    duracionPromedio: durReal.length
      ? durReal.reduce((a, b) => a + b, 0) / durReal.length
      : 0,
    citasTotal: filtered.length,
  };
}

/** Sparkline: últimos ≤14 puntos diarios de ingresos y citas del período. */
export function sparklines(filtered: AnalyticsCita[]): { ingresos: number[]; citas: number[] } {
  const byDay = new Map<string, { ing: number; n: number }>();
  for (const c of filtered) {
    const key = c.fecha.slice(0, 10);
    const cur = byDay.get(key) ?? { ing: 0, n: 0 };
    // Tendencia ilustrativa: valor agendado del día (todas las citas).
    if (c.estado !== "cancelada") cur.ing += c.monto;
    cur.n += 1;
    byDay.set(key, cur);
  }
  const days = [...byDay.keys()].sort().slice(-14);
  return {
    ingresos: days.map((d) => byDay.get(d)!.ing),
    citas: days.map((d) => byDay.get(d)!.n),
  };
}

// ---------------------------------------------------------------------------
// Ingresos en el tiempo (drill-down)
// ---------------------------------------------------------------------------
export type DrillLevel = "year" | "month" | "week" | "day";
export type DrillState = { level: DrillLevel; year: number; month: number; week: number };
export const initialDrill: DrillState = { level: "month", year: 2026, month: 7, week: 1 };

export type DrillRow = {
  bucket: number;
  label: string;
  realizado: number;
  proyectado: number;
  citasReal: number;
  citasProj: number;
};

export function ingresosDrill(
  citas: AnalyticsCita[],
  f: FiltroState,
  drill: DrillState,
): DrillRow[] {
  // Obedece categoría/servicio/estado + rango exacto, NO año/mes.
  const base = applyFilters(citas, f, { ignorePeriodo: true }).filter((c) => {
    if (rangoExactoActivo(f)) {
      const t = new Date(c.fecha).getTime();
      return (
        t >= new Date(`${f.from}T00:00:00`).getTime() &&
        t <= new Date(`${f.to}T23:59:59`).getTime()
      );
    }
    return true;
  });

  const isFuture = (c: AnalyticsCita) => new Date(c.fecha) > DEMO_HOY;
  const add = (row: DrillRow, c: AnalyticsCita) => {
    if (c.estado === "completada") {
      row.realizado += c.monto;
      row.citasReal += 1;
    } else if ((c.estado === "agendada" || c.estado === "confirmada") && isFuture(c)) {
      row.proyectado += c.monto;
      row.citasProj += 1;
    }
  };

  let buckets: number[] = [];
  let filterFn: (c: AnalyticsCita) => number | null;
  let labelFn: (b: number) => string;

  if (drill.level === "year") {
    const years = new Set(base.map((c) => new Date(c.fecha).getFullYear()));
    buckets = [...years].sort();
    if (buckets.length === 0) buckets = [2026];
    filterFn = (c) => new Date(c.fecha).getFullYear();
    labelFn = (b) => String(b);
  } else if (drill.level === "month") {
    buckets = Array.from({ length: 12 }, (_, i) => i + 1);
    filterFn = (c) => {
      const d = new Date(c.fecha);
      return d.getFullYear() === drill.year ? d.getMonth() + 1 : null;
    };
    labelFn = (b) => MONTHS[b - 1];
  } else if (drill.level === "week") {
    const dim = new Date(drill.year, drill.month, 0).getDate();
    buckets = Array.from({ length: Math.ceil(dim / 7) }, (_, i) => i + 1);
    filterFn = (c) => {
      const d = new Date(c.fecha);
      if (d.getFullYear() !== drill.year || d.getMonth() + 1 !== drill.month) return null;
      return Math.floor((d.getDate() - 1) / 7) + 1;
    };
    labelFn = (b) => `Sem ${b}`;
  } else {
    // day — semana del mes, excluye domingos
    const start = (drill.week - 1) * 7 + 1;
    const dim = new Date(drill.year, drill.month, 0).getDate();
    buckets = [];
    for (let day = start; day < start + 7 && day <= dim; day++) {
      if (new Date(drill.year, drill.month - 1, day).getDay() !== 0) buckets.push(day);
    }
    filterFn = (c) => {
      const d = new Date(c.fecha);
      if (d.getFullYear() !== drill.year || d.getMonth() + 1 !== drill.month) return null;
      return d.getDate();
    };
    labelFn = (b) =>
      `${DOW_SHORT[new Date(drill.year, drill.month - 1, b).getDay()]} ${b}`;
  }

  const rows = new Map<number, DrillRow>();
  for (const b of buckets)
    rows.set(b, { bucket: b, label: labelFn(b), realizado: 0, proyectado: 0, citasReal: 0, citasProj: 0 });
  for (const c of base) {
    const b = filterFn(c);
    if (b != null && rows.has(b)) add(rows.get(b)!, c);
  }
  return buckets.map((b) => rows.get(b)!);
}

// ---------------------------------------------------------------------------
// Ingresos por categoría (donut) — ignora filtro de categoría
// ---------------------------------------------------------------------------
export function categoriaDonut(citas: AnalyticsCita[], f: FiltroState) {
  const base = applyFilters(citas, f, { ignoreCategoria: true }).filter(
    (c) => c.estado === "completada",
  );
  const cats: ServicioCategoria[] = ["consultas", "endoscopia", "pruebas", "nutricion"];
  return cats
    .map((cat) => ({
      cat,
      name: CATEGORIA_LABEL[cat],
      ingresos: base.filter((c) => c.categoria === cat).reduce((a, c) => a + c.monto, 0),
    }))
    .filter((d) => d.ingresos > 0);
}

// ---------------------------------------------------------------------------
// Top servicios
// ---------------------------------------------------------------------------
export function topServicios(citas: AnalyticsCita[], f: FiltroState) {
  const filtered = applyFilters(citas, f);
  return serviciosSeed
    .map((s) => {
      const list = filtered.filter((c) => c.servicioId === s.id);
      return {
        id: s.id,
        nombre: s.nombre,
        categoria: s.categoria,
        volumen: list.filter((c) => c.estado !== "cancelada").length,
        ingresos: list.filter((c) => c.estado === "completada").reduce((a, c) => a + c.monto, 0),
      };
    })
    .filter((d) => d.volumen > 0 || d.ingresos > 0);
}

// ---------------------------------------------------------------------------
// Embudo de conversión
// ---------------------------------------------------------------------------
export function funnel(citas: AnalyticsCita[], f: FiltroState) {
  // Misma base que "citas por responsable y estado": respeta período +
  // categoría + servicio, pero ignora el filtro de estado (el embudo ES la
  // descomposición por estado). Así ambos gráficos siempre cuadran.
  const filtered = applyFilters(citas, f, { ignoreEstado: true });
  const agendadas = filtered.length;
  const confirmadas = filtered.filter((c) =>
    ["confirmada", "completada"].includes(c.estado),
  ).length;
  const completadas = filtered.filter((c) => c.estado === "completada").length;
  const canceladas = filtered.filter((c) => c.estado === "cancelada").length;
  const noAsistio = filtered.filter((c) => c.estado === "no_asistio").length;
  return { agendadas, confirmadas, completadas, canceladas, noAsistio, fuga: canceladas + noAsistio };
}

// ---------------------------------------------------------------------------
// Citas por responsable y estado — obedece solo período
// ---------------------------------------------------------------------------
export const RESPONSABLES: AnalyticsCanal[] = ["gastrito", "web", "recepcion", "doctor"];

export function actoresPorEstado(citas: AnalyticsCita[], f: FiltroState) {
  // Misma base que el embudo → la suma por estado coincide con el embudo.
  const base = applyFilters(citas, f, { ignoreEstado: true });
  const grupos = [
    { key: "Agendadas", test: () => true },
    { key: "Confirmadas", test: (c: AnalyticsCita) => ["confirmada", "completada"].includes(c.estado) },
    { key: "Reprogramadas", test: (c: AnalyticsCita) => c.reprogramada },
    { key: "Canceladas", test: (c: AnalyticsCita) => c.estado === "cancelada" },
  ];
  return grupos.map((g) => {
    const row: Record<string, string | number> = { grupo: g.key };
    for (const r of RESPONSABLES) {
      row[CANAL_LABEL[r]] = base.filter((c) => c.canal === r && g.test(c)).length;
    }
    return row;
  });
}

// ---------------------------------------------------------------------------
// Gastrito vs sitio web (todo el historial)
// ---------------------------------------------------------------------------
export function canalesSerie() {
  // Solo meses ya transcurridos y completos: se muestran hasta el mes anterior
  // al actual (DEMO_HOY), sin datos de julio en adelante. Coherente con el
  // gráfico de ingresos (cuya parte realizada termina en el mes en curso).
  const hastaMes = DEMO_HOY.getMonth(); // exclusivo → Ene..(mes-1)
  const byMonth = new Map<number, { ana: number; web: number }>();
  for (const c of analyticsCitas) {
    const m = new Date(c.fecha).getMonth();
    if (m >= hastaMes) continue;
    const cur = byMonth.get(m) ?? { ana: 0, web: 0 };
    if (c.canal === "gastrito") cur.ana += 1;
    else if (c.canal === "web") cur.web += 1;
    byMonth.set(m, cur);
  }
  return Array.from({ length: hastaMes }, (_, m) => ({
    label: MONTHS[m],
    ana: byMonth.get(m)?.ana ?? 0,
    web: byMonth.get(m)?.web ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// Fuera de horario + distribución por hora
// ---------------------------------------------------------------------------
export function fueraDeHorario(citas: AnalyticsCita[], f: FiltroState) {
  // Misma base (ignora estado) → gastrito/web totales = los del gráfico de
  // responsable y estado y de citas registradas.
  const base = applyFilters(citas, f, { ignoreEstado: true }).filter(
    (c) => c.canal === "gastrito" || c.canal === "web",
  );
  const row = (canal: AnalyticsCanal, label: string) => {
    const list = base.filter((c) => c.canal === canal);
    const fuera = list.filter((c) => c.creadaFueraHorario).length;
    return { canal: label, Dentro: list.length - fuera, Fuera: fuera };
  };
  const fuera = base.filter((c) => c.creadaFueraHorario).length;
  return {
    barras: [row("web", "Sitio web"), row("gastrito", "Gastrito (IA)")],
    pctFuera: base.length ? Math.round((fuera / base.length) * 100) : 0,
    total: base.length,
    fuera,
  };
}

export function horaDistribucion(citas: AnalyticsCita[], f: FiltroState) {
  const base = applyFilters(citas, f, { ignoreEstado: true }).filter(
    (c) => c.canal === "gastrito" || c.canal === "web",
  );
  const byHour = new Map<number, { dentro: number; fuera: number }>();
  for (const c of base) {
    const h = new Date(c.creada).getHours();
    const cur = byHour.get(h) ?? { dentro: 0, fuera: 0 };
    if (c.creadaFueraHorario) cur.fuera += 1;
    else cur.dentro += 1;
    byHour.set(h, cur);
  }
  return [...byHour.keys()]
    .sort((a, b) => a - b)
    .map((h) => ({ hora: h, Dentro: byHour.get(h)!.dentro, Fuera: byHour.get(h)!.fuera }));
}

// ---------------------------------------------------------------------------
// Conversión de Gastrito — obedece solo período
// ---------------------------------------------------------------------------
export function conversionGastrito(f: FiltroState) {
  // Meses aplicables según filtro (para año 2026).
  let meses: number[];
  if (rangoExactoActivo(f)) {
    const from = new Date(`${f.from}T00:00:00`);
    const to = new Date(`${f.to}T00:00:00`);
    meses = [];
    for (let m = from.getMonth(); m <= to.getMonth(); m++) meses.push(m);
  } else if (f.months.length) {
    meses = f.months.map((m) => m - 1);
  } else {
    meses = Array.from({ length: 12 }, (_, i) => i);
  }
  const aplica = leadsGastritoPorMes.filter((l) => meses.includes(l.mes));
  const base = aplica.reduce((a, l) => a + l.leads, 0);
  const convertidas = aplica.reduce((a, l) => a + l.agendaron, 0);
  return { base, convertidas, pct: base ? (convertidas / base) * 100 : 0 };
}

// ---------------------------------------------------------------------------
// Duración real vs estimada
// ---------------------------------------------------------------------------
export function duracionRealVsEstimada(citas: AnalyticsCita[], f: FiltroState) {
  const completadas = applyFilters(citas, f).filter(
    (c) => c.estado === "completada" && c.duracionRealMin != null,
  );
  const bySvc = new Map<string, { nombre: string; estimada: number; reales: number[] }>();
  for (const c of completadas) {
    const cur =
      bySvc.get(c.servicioId) ??
      { nombre: c.servicioNombre, estimada: c.duracionEstimadaMin, reales: [] };
    cur.reales.push(c.duracionRealMin!);
    bySvc.set(c.servicioId, cur);
  }
  return [...bySvc.values()]
    .filter((s) => s.reales.length >= 3)
    .map((s) => {
      const real = Math.round(s.reales.reduce((a, b) => a + b, 0) / s.reales.length);
      return { nombre: s.nombre, estimada: s.estimada, real, gap: Math.abs(real - s.estimada) };
    })
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);
}

// Años disponibles para el filtro.
export const aniosDisponibles = [
  ...new Set(analyticsCitas.map((c) => new Date(c.fecha).getFullYear())),
].sort((a, b) => b - a);
