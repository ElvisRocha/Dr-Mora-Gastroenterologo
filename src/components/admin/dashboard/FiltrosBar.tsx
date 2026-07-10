import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  Filter,
  RotateCcw,
  Stethoscope,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/cn";
import {
  ESTADO_LABEL,
  MONTHS,
  aniosDisponibles,
  anyFilter,
  rangoExactoActivo,
  type FiltroState,
} from "@/lib/dashboard/metrics";
import { serviciosSeed, CATEGORIA_LABEL, type ServicioCategoria } from "@/lib/data/servicios";
import type { AnalyticsEstado } from "@/lib/data/analytics";

function useOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return ref;
}

function Chip({
  icon: Icon,
  label,
  active,
  disabled,
  count,
  children,
}: {
  icon: typeof Filter;
  label: string;
  active?: boolean;
  disabled?: boolean;
  count?: number;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutside(() => setOpen(false));
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          disabled
            ? "cursor-not-allowed border-border opacity-50"
            : active
              ? "border-navy/40 bg-navy/5 text-navy"
              : "border-border text-foreground hover:bg-muted",
        )}
      >
        <Icon size={13} />
        {label}
        {count && count > 0 ? (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-semibold text-offwhite">
            {count}
          </span>
        ) : null}
        <ChevronDown size={12} className="opacity-60" />
      </button>
      {open && !disabled ? (
        <div className="absolute left-0 z-30 mt-2 min-w-[15rem] rounded-xl border border-border bg-card p-2 shadow-elevated">
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

function CheckRow({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-muted"
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          checked ? "border-navy bg-navy text-offwhite" : "border-border",
        )}
      >
        {checked ? <CheckCircle2 size={11} /> : null}
      </span>
      {label}
    </button>
  );
}

export function FiltrosBar({
  f,
  setF,
  citasTotal,
}: {
  f: FiltroState;
  setF: (patch: Partial<FiltroState>) => void;
  citasTotal: number;
}) {
  const exact = rangoExactoActivo(f);

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const anioLabel = f.years.length === 0 ? "Todos" : [...f.years].sort().join(" · ");
  const mesLabel =
    f.months.length === 0 || f.months.length === 12
      ? "Todos"
      : [...f.months].sort((a, b) => a - b).map((m) => MONTHS[m - 1]).join(", ");

  const canonicos = serviciosSeed;

  return (
    <div className="sticky top-[96px] z-20 -mx-5 mb-5 border-b border-border bg-background/85 px-5 py-2.5 backdrop-blur md:-mx-6 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Filter size={13} />
          Filtros:
        </span>

        <Chip icon={CalendarDays} label={`Año: ${anioLabel}`} active={!exact && f.years.length > 0} disabled={exact}>
          {() => (
            <div>
              {aniosDisponibles.map((y) => (
                <CheckRow
                  key={y}
                  checked={f.years.includes(y)}
                  onClick={() => setF({ years: toggle(f.years, y) })}
                  label={String(y)}
                />
              ))}
            </div>
          )}
        </Chip>

        <Chip icon={CalendarRange} label={`Mes: ${mesLabel}`} active={!exact} disabled={exact}>
          {() => (
            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((m, i) => {
                const on = f.months.includes(i + 1);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setF({ months: toggle(f.months, i + 1) })}
                    className={cn(
                      "rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                      on ? "bg-navy text-offwhite" : "text-foreground hover:bg-muted",
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}
        </Chip>

        <Chip
          icon={CalendarRange}
          label={exact ? `${format(new Date(`${f.from}T00:00`), "d MMM", { locale: es })} – ${format(new Date(`${f.to}T00:00`), "d MMM", { locale: es })}` : "Rango exacto"}
          active={exact}
        >
          {() => (
            <div className="space-y-3 p-1">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Desde</span>
                <input
                  type="date"
                  value={f.from}
                  max={f.to || undefined}
                  onChange={(e) => setF({ from: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm outline-none focus:border-navy/40"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Hasta</span>
                <input
                  type="date"
                  value={f.to}
                  min={f.from || undefined}
                  onChange={(e) => setF({ to: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm outline-none focus:border-navy/40"
                />
              </label>
              {exact ? (
                <button
                  type="button"
                  onClick={() => setF({ from: "", to: "" })}
                  className="text-xs font-medium text-coral hover:underline"
                >
                  Quitar rango exacto
                </button>
              ) : null}
              <p className="text-[11px] leading-snug text-muted-foreground">
                Con un rango exacto activo, los filtros de Año y Mes quedan en pausa.
              </p>
            </div>
          )}
        </Chip>

        <span className="mx-0.5 hidden h-5 w-px bg-border md:block" />

        <Chip icon={Stethoscope} label="Categoría" count={f.categorias.length}>
          {() => (
            <div>
              {(Object.keys(CATEGORIA_LABEL) as ServicioCategoria[]).map((c) => (
                <CheckRow
                  key={c}
                  checked={f.categorias.includes(c)}
                  onClick={() => setF({ categorias: toggle(f.categorias, c) })}
                  label={CATEGORIA_LABEL[c]}
                />
              ))}
            </div>
          )}
        </Chip>

        <Chip icon={Activity} label="Servicio" count={f.servicios.length}>
          {() => (
            <div className="max-h-64 overflow-y-auto">
              {canonicos.map((s) => (
                <CheckRow
                  key={s.id}
                  checked={f.servicios.includes(s.id)}
                  onClick={() => setF({ servicios: toggle(f.servicios, s.id) })}
                  label={s.nombre}
                />
              ))}
            </div>
          )}
        </Chip>

        <Chip icon={CheckCircle2} label="Estado" count={f.estados.length}>
          {() => (
            <div>
              {(Object.keys(ESTADO_LABEL) as AnalyticsEstado[]).map((e) => (
                <CheckRow
                  key={e}
                  checked={f.estados.includes(e)}
                  onClick={() => setF({ estados: toggle(f.estados, e) })}
                  label={ESTADO_LABEL[e]}
                />
              ))}
            </div>
          )}
        </Chip>

        {anyFilter(f) ? (
          <button
            type="button"
            onClick={() =>
              setF({
                years: [2026],
                months: [7],
                from: "",
                to: "",
                servicios: [],
                categorias: [],
                estados: [],
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw size={13} />
            Limpiar
          </button>
        ) : null}

        <span className="ml-auto text-xs text-muted-foreground">
          <strong className="text-foreground">{citasTotal.toLocaleString("es-CR")}</strong> citas
          en el rango
        </span>
      </div>

      {anyFilter(f) &&
      (f.servicios.length || f.categorias.length || f.estados.length) ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {f.categorias.map((c) => (
            <Pill key={c} label={CATEGORIA_LABEL[c]} onClear={() => setF({ categorias: f.categorias.filter((x) => x !== c) })} />
          ))}
          {f.servicios.map((id) => (
            <Pill
              key={id}
              label={serviciosSeed.find((s) => s.id === id)?.nombre ?? id}
              onClear={() => setF({ servicios: f.servicios.filter((x) => x !== id) })}
            />
          ))}
          {f.estados.map((e) => (
            <Pill key={e} label={ESTADO_LABEL[e]} onClear={() => setF({ estados: f.estados.filter((x) => x !== e) })} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Pill({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-navy/20 bg-navy/5 px-2.5 py-1 text-xs text-navy">
      {label}
      <button type="button" onClick={onClear} className="hover:text-coral">
        <X size={12} />
      </button>
    </span>
  );
}
