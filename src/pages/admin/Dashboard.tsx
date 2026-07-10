import { useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/cn";
import {
  CRC,
  CRC_K,
  INT,
  hourAmPm,
  initialFiltros,
  initialDrill,
  computeKpis,
  sparklines,
  ingresosDrill,
  categoriaDonut,
  topServicios,
  funnel,
  actoresPorEstado,
  canalesSerie,
  fueraDeHorario,
  horaDistribucion,
  conversionGastrito,
  duracionRealVsEstimada,
  applyFilters,
  prevFiltro,
  RESPONSABLES,
  MONTHS,
  type FiltroState,
  type DrillState,
} from "@/lib/dashboard/metrics";
import { analyticsCitas, CANAL_LABEL } from "@/lib/data/analytics";
import { C, SERIE, CATEGORIA_COLOR, FUNNEL_COLOR, RESPONSABLE_PALETTE } from "@/lib/dashboard/palette";
import { FiltrosBar } from "@/components/admin/dashboard/FiltrosBar";

// ---------------------------------------------------------------------------
// Helpers de layout
// ---------------------------------------------------------------------------
function SectionHead({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy/10 text-[11px] font-semibold text-navy">
        {n}
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft", className)}>
      {children}
    </div>
  );
}

function CardTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
      </div>
      {right}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const [f, setFilters] = useState<FiltroState>(initialFiltros);
  const setF = (patch: Partial<FiltroState>) => setFilters((p) => ({ ...p, ...patch }));

  const filtered = useMemo(() => applyFilters(analyticsCitas, f), [f]);
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const prev = useMemo(() => {
    const pf = prevFiltro(f);
    return pf ? computeKpis(applyFilters(analyticsCitas, pf)) : null;
  }, [f]);
  const spark = useMemo(() => sparklines(filtered), [filtered]);

  const deltaIng =
    prev && prev.ingresosRealizados > 0
      ? ((kpis.ingresosRealizados - prev.ingresosRealizados) / prev.ingresosRealizados) * 100
      : null;
  const deltaCitas =
    prev && prev.citasCompletadas > 0
      ? ((kpis.citasCompletadas - prev.citasCompletadas) / prev.citasCompletadas) * 100
      : null;

  return (
    <div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Indicadores financieros, operativos y de servicios de la clínica.
        </p>
      </div>

      <FiltrosBar f={f} setF={setF} citasTotal={kpis.citasTotal} />

      {/* 01 — KPIs */}
      <section className="mb-8">
        <SectionHead n="01" title="¿Cómo vamos?" sub="El pulso del período elegido. Responde a todos los filtros." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard title="Ingresos realizados" value={CRC_K(kpis.ingresosRealizados)} delta={deltaIng} sub="vs período anterior" icon={DollarSign} tint="navy" spark={spark.ingresos} color={C.navy} />
          <KpiCard title="Ingresos proyectados" value={CRC_K(kpis.ingresosProyectados)} delta={null} sub="citas futuras agendadas" icon={TrendingUp} tint="amber" spark={spark.ingresos} color={C.amber} />
          <KpiCard title="Ticket promedio" value={CRC_K(kpis.ticketPromedio)} delta={null} sub="por cita completada" icon={DollarSign} tint="navy" spark={spark.ingresos} color={C.navy} />
          <KpiCard title="Citas completadas" value={INT(kpis.citasCompletadas)} delta={deltaCitas} sub="vs período anterior" icon={CheckCircle2} tint="leaf" spark={spark.citas} color={C.leaf} />
          <KpiCard title="Tasa de completitud" value={`${kpis.tasaCompletitud.toFixed(1)}%`} delta={null} sub={`No-show: ${kpis.noShow.toFixed(1)}%`} icon={Activity} tint="leaf" spark={spark.citas} color={C.leaf} />
          <KpiCard title="Duración promedio" value={`${kpis.duracionPromedio.toFixed(0)} min`} delta={null} sub="real por cita" icon={Clock} tint="teal" spark={spark.citas} color={C.teal} />
        </div>
      </section>

      {/* 02 — Ingresos */}
      <section className="mb-8">
        <SectionHead n="02" title="¿De dónde viene el dinero?" sub="Cómo evolucionan los ingresos, de qué categoría y de qué servicios." />
        <IngresosDrill f={f} />
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CategoriaDonut f={f} />
          <TopServicios f={f} setF={setF} />
        </div>
      </section>

      {/* 03 — Conversión */}
      <section className="mb-8">
        <SectionHead n="03" title="¿Cómo se convierten las citas?" sub="Del agendamiento al ingreso: dónde se completa y dónde se pierde." />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Embudo f={f} />
          <Actores f={f} />
        </div>
      </section>

      {/* 04 — Gastrito y web */}
      <section className="mb-8">
        <SectionHead n="04" title="Gastrito (IA) y el sitio web" sub="Los canales automáticos: cuántas citas registran y cuánta demanda capturan fuera de horario." />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <CanalesSerie />
          <FueraHorario f={f} />
          <ConversionGastrito f={f} />
          <HoraDist f={f} />
        </div>
      </section>

      {/* 05 — Planificación */}
      <section className="mb-4">
        <SectionHead n="05" title="¿Qué tan bien planificamos?" sub="Comparar la duración estimada con la real para ajustar los tiempos de agenda." />
        <DuracionChart f={f} />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------
const TINT: Record<string, string> = {
  navy: "bg-navy/10 text-navy",
  amber: "bg-amber/15 text-amber",
  leaf: "bg-leaf/15 text-leaf",
  teal: "bg-teal/15 text-teal",
};

function KpiCard({
  title,
  value,
  delta,
  sub,
  icon: Icon,
  tint,
  spark,
  color,
}: {
  title: string;
  value: string;
  delta: number | null;
  sub: string;
  icon: typeof DollarSign;
  tint: string;
  spark: number[];
  color: string;
}) {
  const data = spark.map((y, x) => ({ x, y }));
  const gid = `spk-${title.replace(/\s/g, "")}`;
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <span className="min-h-8 text-xs font-medium text-muted-foreground">{title}</span>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", TINT[tint])}>
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {delta != null ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              delta >= 0 ? "bg-leaf/15 text-leaf" : "bg-coral/15 text-coral",
            )}
          >
            {delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        ) : null}
        <span className="truncate text-[10px] text-muted-foreground">{sub}</span>
      </div>
      <div className="mt-2 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="y" stroke={color} strokeWidth={1.5} fill={`url(#${gid})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 02a — Ingresos en el tiempo (drill)
// ---------------------------------------------------------------------------
function IngresosDrill({ f }: { f: FiltroState }) {
  const [drill, setDrill] = useState<DrillState>(initialDrill);
  const rows = useMemo(() => ingresosDrill(analyticsCitas, f, drill), [f, drill]);

  const clickable = drill.level !== "day";
  const onBar = (bucket: number) => {
    if (drill.level === "year") setDrill({ ...drill, level: "month", year: bucket });
    else if (drill.level === "month") setDrill({ ...drill, level: "week", month: bucket });
    else if (drill.level === "week") setDrill({ ...drill, level: "day", week: bucket });
  };

  const crumbs: { label: string; to: DrillState["level"] | null }[] = [
    { label: "Todos los años", to: "year" },
  ];
  if (drill.level !== "year") crumbs.push({ label: String(drill.year), to: drill.level === "month" ? null : "month" });
  if (drill.level === "week" || drill.level === "day")
    crumbs.push({ label: `${MONTHS[drill.month - 1]} ${drill.year}`, to: drill.level === "week" ? null : "week" });
  if (drill.level === "day") crumbs.push({ label: `Semana ${drill.week}`, to: null });

  const goTo = (lvl: DrillState["level"]) => setDrill({ ...drill, level: lvl });

  return (
    <Panel>
      <CardTitle
        title="Ingresos en el tiempo"
        sub="Realizado vs. proyectado. Haz clic en una barra para bajar de nivel."
        right={
          <div className="flex flex-wrap items-center justify-end gap-1 text-xs">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight size={11} className="text-muted-foreground" /> : null}
                {c.to ? (
                  <button type="button" onClick={() => goTo(c.to!)} className="font-medium text-navy hover:underline">
                    {c.label}
                  </button>
                ) : (
                  <span className="font-medium text-foreground">{c.label}</span>
                )}
              </span>
            ))}
          </div>
        }
      />
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {drill.level === "day" ? (
            <AreaChart data={rows} margin={{ top: 26, right: 16, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="gReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIE.realizado} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={SERIE.realizado} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} interval={0} />
              <YAxis tickFormatter={CRC_K} tickLine={false} axisLine={false} width={48} tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip content={<DrillTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="realizado" name="Realizado" stroke={SERIE.realizado} strokeWidth={2} fill="url(#gReal)" dot={{ r: 3, fill: SERIE.realizado, strokeWidth: 0 }} activeDot={{ r: 4 }} isAnimationActive={false}>
                <LabelList content={(props: any) => <AreaTotal {...props} rows={rows} which="realizado" />} />
              </Area>
              <Area type="monotone" dataKey="proyectado" name="Proyectado" stroke={SERIE.proyectado} strokeWidth={2} strokeDasharray="4 3" fill="transparent" dot={{ r: 3, fill: SERIE.proyectado, strokeWidth: 0 }} activeDot={{ r: 4 }} isAnimationActive={false}>
                <LabelList content={(props: any) => <AreaTotal {...props} rows={rows} which="proyectado" />} />
              </Area>
            </AreaChart>
          ) : (
            <BarChart data={rows} margin={{ top: 20, right: 8, bottom: 0, left: 4 }} onClick={(e: any) => {
              if (clickable && e && e.activeTooltipIndex != null && rows[e.activeTooltipIndex]) onBar(rows[e.activeTooltipIndex].bucket);
            }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} interval={0} />
              <YAxis tickFormatter={CRC_K} tickLine={false} axisLine={false} width={48} tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} content={<DrillTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="realizado" name="Realizado" stackId="ing" fill={SERIE.realizado} maxBarSize={46} cursor={clickable ? "pointer" : "default"} />
              <Bar dataKey="proyectado" name="Proyectado" stackId="ing" fill={SERIE.proyectado} radius={[4, 4, 0, 0]} maxBarSize={46} cursor={clickable ? "pointer" : "default"}>
                <LabelList dataKey="realizado" content={(props: any) => <StackTotal {...props} rows={rows} />} />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Drill-down Año → Mes → Semana → Día. El nivel Día excluye domingos (clínica cerrada). Usa la ruta para volver a subir.
      </p>
    </Panel>
  );
}

function StackTotal({ x, y, width, index, rows }: any) {
  const row = rows[index];
  if (!row) return null;
  const total = row.realizado + row.proyectado;
  if (total <= 0) return null;
  return (
    <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={10} fill={C.muted} fontWeight={600}>
      {CRC_K(total)}
    </text>
  );
}

// Etiqueta de total por punto en la vista de área (nivel día).
function AreaTotal({ x, y, index, rows, which }: any) {
  const row = rows[index];
  if (!row) return null;
  const total = row.realizado + row.proyectado;
  if (total <= 0) return null;
  // Evita doble etiqueta el día frontera: realizado la muestra siempre;
  // proyectado solo cuando ese día no tiene realizado.
  if (which === "proyectado" && row.realizado > 0) return null;
  if (which === "realizado" && row.realizado === 0) return null;
  return (
    <text x={x} y={y - 10} textAnchor="middle" fontSize={10} fill={C.muted} fontWeight={600}>
      {CRC_K(total)}
    </text>
  );
}

function DrillTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-elevated">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {row?.realizado > 0 ? (
        <p className="flex items-center gap-1.5 text-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: SERIE.realizado }} />
          Realizado: {CRC(row.realizado)} · {row.citasReal} citas
        </p>
      ) : null}
      {row?.proyectado > 0 ? (
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: SERIE.proyectado }} />
          Proyectado: {CRC(row.proyectado)} · {row.citasProj} citas
        </p>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 02b — Donut categoría
// ---------------------------------------------------------------------------
function CategoriaDonut({ f }: { f: FiltroState }) {
  const data = useMemo(() => categoriaDonut(analyticsCitas, f), [f]);
  const total = data.reduce((a, d) => a + d.ingresos, 0);
  return (
    <Panel className="flex flex-col">
      <CardTitle title="Ingresos por categoría" />
      {total === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Sin ingresos en el período.</p>
      ) : (
        <>
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="ingresos" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} stroke="hsl(var(--card))" strokeWidth={2}>
                  {data.map((d) => (
                    <Cell key={d.cat} fill={CATEGORIA_COLOR[d.cat]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [CRC(v), n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Total</span>
              <span className="font-display text-xl font-bold text-foreground">{CRC_K(total)}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {data.map((d) => (
              <span key={d.cat} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIA_COLOR[d.cat] }} />
                {d.name} · <strong className="text-foreground">{CRC_K(d.ingresos)}</strong>
              </span>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 02c — Top servicios
// ---------------------------------------------------------------------------
function TopServicios({ f, setF }: { f: FiltroState; setF: (p: Partial<FiltroState>) => void }) {
  const [metric, setMetric] = useState<"ingresos" | "volumen">("ingresos");
  const data = useMemo(
    () => topServicios(analyticsCitas, f).sort((a, b) => b[metric] - a[metric]).slice(0, 8),
    [f, metric],
  );
  const toggleSvc = (id: string) =>
    setF({ servicios: f.servicios.includes(id) ? f.servicios.filter((x) => x !== id) : [...f.servicios, id] });
  const height = Math.max(280, data.length * 54);

  return (
    <Panel>
      <CardTitle
        title="Top servicios"
        right={
          <div className="inline-flex rounded-full border border-border bg-muted/40 p-0.5 text-xs">
            {(["ingresos", "volumen"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={cn("rounded-full px-2.5 py-1 font-medium transition-colors", metric === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
              >
                {m === "ingresos" ? "₡ Ingresos" : "Nº citas"}
              </button>
            ))}
          </div>
        }
      />
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }} onClick={(e: any) => {
            if (e && e.activeTooltipIndex != null && data[e.activeTooltipIndex]) toggleSvc(data[e.activeTooltipIndex].id);
          }}>
            <XAxis type="number" hide domain={[0, (max: number) => Math.ceil(max * 1.18)]} />
            <YAxis type="category" dataKey="nombre" width={190} tick={<SvcTick />} interval={0} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} formatter={(v: number) => (metric === "ingresos" ? CRC(v) : `${v} citas`)} />
            <Bar dataKey={metric} radius={[0, 4, 4, 0]} maxBarSize={22} cursor="pointer">
              {data.map((d) => (
                <Cell
                  key={d.id}
                  fill={CATEGORIA_COLOR[d.categoria]}
                  fillOpacity={f.servicios.length === 0 || f.servicios.includes(d.id) ? 1 : 0.3}
                />
              ))}
              <LabelList dataKey={metric} position="right" formatter={(v: number) => (metric === "ingresos" ? CRC_K(v) : String(v))} style={{ fontSize: 11, fill: C.muted, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Clic en una barra para filtrar todo el panel por ese servicio.</p>
    </Panel>
  );
}

function SvcTick({ x, y, payload }: any) {
  const words = String(payload.value).split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 24) {
      lines.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return (
    <text x={x} y={y} textAnchor="end" fontSize={11} fill={C.muted}>
      {lines.slice(0, 2).map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? (lines.length > 1 ? -4 : 4) : 12}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

// ---------------------------------------------------------------------------
// 03a — Embudo
// ---------------------------------------------------------------------------
function Embudo({ f }: { f: FiltroState }) {
  const d = useMemo(() => funnel(analyticsCitas, f), [f]);
  const pct = (n: number) => (d.agendadas ? (n / d.agendadas) * 100 : 0);
  const rows = [
    { label: "Agendadas", value: d.agendadas, p: 100, color: FUNNEL_COLOR.agendadas, text: "#fff" },
    { label: "Confirmadas", value: d.confirmadas, p: pct(d.confirmadas), color: FUNNEL_COLOR.confirmadas, text: "#fff" },
    { label: "Completadas", value: d.completadas, p: pct(d.completadas), color: FUNNEL_COLOR.completadas, text: "#fff" },
    { label: "Fuga", value: `${d.canceladas} canceladas · ${d.noAsistio} no-show`, p: pct(d.fuga), color: FUNNEL_COLOR.fuga, text: "#fff", fuga: true },
  ];
  return (
    <Panel>
      <CardTitle title="Embudo de conversión" sub="De cada cita agendada, cuántas terminan completadas." />
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className={cn("w-24 shrink-0 text-right text-xs", r.fuga ? "font-medium text-coral" : "text-muted-foreground")}>{r.label}</span>
            <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted/50">
              <div className="flex h-full items-center rounded-md px-2 text-xs font-semibold" style={{ width: `${Math.max(r.p, 8)}%`, background: r.color, color: r.text }}>
                <span className="truncate">{r.value}</span>
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">{r.p.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">La "fuga" separa cancelación vs. inasistencia (no-show).</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 03b — Actores
// ---------------------------------------------------------------------------
function Actores({ f }: { f: FiltroState }) {
  const data = useMemo(() => actoresPorEstado(analyticsCitas, f), [f]);
  const keys = RESPONSABLES.map((r) => CANAL_LABEL[r]);
  return (
    <Panel>
      <CardTitle title="Citas por responsable y estado" sub="Quién registró cada cita, según el estado." />
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: 0 }} barGap={4} barCategoryGap="22%">
            <XAxis dataKey="grupo" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            {keys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={RESPONSABLE_PALETTE[i]} radius={[4, 4, 0, 0]} maxBarSize={38}>
                <LabelList dataKey={k} position="top" formatter={(v: number) => (v > 0 ? v : "")} style={{ fontSize: 10, fill: C.muted }} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 04a — Canales serie (todo el historial)
// ---------------------------------------------------------------------------
function CanalesSerie() {
  const data = useMemo(() => canalesSerie(), []);
  return (
    <Panel>
      <CardTitle
        title="Citas registradas: Gastrito vs. Sitio web"
        sub="Todo el historial · no se ve afectado por los filtros."
        right={<span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[11px] font-medium text-leaf">Trabajan 24/7</span>}
      />
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: 0 }} barGap={4}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="ana" name="Gastrito (IA)" fill={SERIE.canalIA} radius={[4, 4, 0, 0]} maxBarSize={34}>
              <LabelList dataKey="ana" position="top" formatter={(v: number) => (v > 0 ? v : "")} style={{ fontSize: 10, fill: C.muted }} />
            </Bar>
            <Bar dataKey="web" name="Sitio web" fill={SERIE.canalWeb} radius={[4, 4, 0, 0]} maxBarSize={34}>
              <LabelList dataKey="web" position="top" formatter={(v: number) => (v > 0 ? v : "")} style={{ fontSize: 10, fill: C.muted }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 04b — Fuera de horario
// ---------------------------------------------------------------------------
function FueraHorario({ f }: { f: FiltroState }) {
  const d = useMemo(() => fueraDeHorario(analyticsCitas, f), [f]);
  return (
    <Panel className="flex flex-col">
      <CardTitle title="Fuera de horario" sub="Citas capturadas con la clínica cerrada." />
      <div className="mb-3 flex items-center gap-3 rounded-xl bg-leaf/10 px-4 py-3">
        <span className="font-display text-3xl font-bold text-leaf">{d.pctFuera}%</span>
        <p className="text-xs leading-snug text-muted-foreground">
          de las citas se agendaron <strong className="text-foreground">fuera del horario laboral</strong>. Demanda que una secretaría no habría atendido.
        </p>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={d.barras} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="canal" width={80} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="Dentro" stackId="h" fill={SERIE.dentro} radius={[3, 0, 0, 3]}>
              <LabelList dataKey="Dentro" position="center" formatter={(v: number) => (v > 0 ? v : "")} style={{ fontSize: 10, fill: "#fff" }} />
            </Bar>
            <Bar dataKey="Fuera" stackId="h" fill={SERIE.fuera} radius={[0, 3, 3, 0]}>
              <LabelList dataKey="Fuera" position="center" formatter={(v: number) => (v > 0 ? v : "")} style={{ fontSize: 10, fill: "#14310a", fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIE.dentro }} /> Dentro del horario</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIE.fuera }} /> Fuera del horario</span>
        <span>· por canal automático.</span>
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 04c — Conversión de Gastrito
// ---------------------------------------------------------------------------
function ConversionGastrito({ f }: { f: FiltroState }) {
  const d = useMemo(() => conversionGastrito(f), [f]);
  const rows = [
    { label: "Leads nuevos", value: d.base, p: 100, color: SERIE.lead, pctLabel: "100%" },
    { label: "Agendaron", value: d.convertidas, p: Math.max(d.pct, d.convertidas > 0 ? 6 : 0), color: SERIE.canalIA, pctLabel: `${d.pct.toFixed(0)}%` },
  ];
  return (
    <Panel>
      <CardTitle title="Conversión de Gastrito (IA)" sub="De los leads nuevos que le escribieron, a cuántos logró agendarles cita." />
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-right text-xs text-muted-foreground">{r.label}</span>
            <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted/50">
              <div className="flex h-full items-center rounded-md px-2 text-xs font-semibold text-white" style={{ width: `${r.p}%`, background: r.color }}>
                {INT(r.value)}
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">{r.pctLabel}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        "Leads nuevos" = personas que escribieron a Gastrito sin cita previa. "Agendaron" = de esos, los que agendó. Obedece Año/Mes/Rango.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 04d — Hora del día
// ---------------------------------------------------------------------------
function HoraDist({ f }: { f: FiltroState }) {
  const data = useMemo(() => horaDistribucion(analyticsCitas, f), [f]);
  return (
    <Panel>
      <CardTitle title="¿A qué hora se agenda?" sub="Distribución por hora (Gastrito + web), según dentro o fuera del horario público." />
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="hora" tickFormatter={(h) => hourAmPm(h)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} interval={0} />
            <YAxis allowDecimals={false} width={24} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} labelFormatter={(h) => hourAmPm(h as number, true)} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Dentro" name="En horario" stackId="h" fill={SERIE.dentro} maxBarSize={20} />
            <Bar dataKey="Fuera" name="Fuera de horario" stackId="h" fill={SERIE.fuera} radius={[3, 3, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIE.dentro }} /> En horario público</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIE.fuera }} /> Fuera de horario (noche o fin de semana)</span>
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 05 — Duración real vs estimada
// ---------------------------------------------------------------------------
function DuracionChart({ f }: { f: FiltroState }) {
  const data = useMemo(() => duracionRealVsEstimada(analyticsCitas, f), [f]);
  const height = Math.max(260, data.length * 54);
  return (
    <Panel>
      <CardTitle
        title="Duración real vs. estimada"
        sub="Tiempo estimado vs. tiempo real de consulta. Con el sistema, cada consulta se agiliza (10–15% menos)."
        right={<span className="text-xs text-muted-foreground">minutos · solo completadas</span>}
      />
      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Sin datos suficientes (se requieren ≥3 citas completadas con duración medida por servicio).
        </p>
      ) : (
        <>
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }} barGap={3} barCategoryGap="38%">
                <XAxis type="number" tickFormatter={(v) => `${v}m`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: C.muted }} />
                <YAxis type="category" dataKey="nombre" width={150} tick={<SvcTick />} interval={0} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} formatter={(v: number) => `${v} min`} />
                <Bar dataKey="estimada" name="Estimada" fill={SERIE.estimada} fillOpacity={0.3} radius={[0, 2, 2, 0]} barSize={12}>
                  <LabelList dataKey="estimada" position="right" formatter={(v: number) => `${v}m`} style={{ fontSize: 10, fill: C.muted }} />
                </Bar>
                <Bar dataKey="real" name="Real con el sistema" radius={[0, 4, 4, 0]} barSize={12}>
                  {data.map((d) => (
                    <Cell key={d.nombre} fill={d.real > d.estimada ? SERIE.realOver : SERIE.realUnder} />
                  ))}
                  <LabelList dataKey="real" position="right" formatter={(v: number) => `${v}m`} style={{ fontSize: 10, fill: SERIE.realUnder, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIE.estimada, opacity: 0.4 }} /> Tiempo estimado</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIE.realUnder }} /> Tiempo real con el sistema (más rápido)</span>
          </div>
        </>
      )}
    </Panel>
  );
}
