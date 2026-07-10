import { useMemo } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/cn";
import { CanalIcon } from "./CanalIcon";
import {
  CATEGORIAS_TABLERO,
  type CategoriaTablero,
  type ConversacionMock,
  type MensajeMock,
} from "@/lib/data/conversaciones";

const HEADER_TONE: Record<string, string> = {
  navy: "border-navy/30 bg-navy/8 text-navy",
  leaf: "border-leaf/30 bg-leaf/10 text-leaf",
  teal: "border-teal/30 bg-teal/10 text-teal",
  amber: "border-amber/30 bg-amber/10 text-amber",
  coral: "border-coral/30 bg-coral/10 text-coral",
  neutral: "border-border bg-muted text-muted-foreground",
};

const ACCENT: Record<string, string> = {
  navy: "bg-navy",
  leaf: "bg-leaf",
  teal: "bg-teal",
  amber: "bg-amber",
  coral: "bg-coral",
  neutral: "bg-muted-foreground/40",
};

function iniciales(nombre: string) {
  const parts = nombre.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "#";
}

export function ConversacionesTablero({
  conversaciones,
  mensajes,
  onSelect,
}: {
  conversaciones: ConversacionMock[];
  mensajes: MensajeMock[];
  onSelect: (id: string) => void;
}) {
  const ultimoPorConv = useMemo(() => {
    const map = new Map<string, MensajeMock>();
    for (const m of mensajes) {
      const cur = map.get(m.conversacionId);
      if (!cur || +new Date(m.fecha) > +new Date(cur.fecha)) {
        map.set(m.conversacionId, m);
      }
    }
    return map;
  }, [mensajes]);

  const porCategoria = useMemo(() => {
    const map = new Map<CategoriaTablero, ConversacionMock[]>();
    for (const cat of CATEGORIAS_TABLERO) map.set(cat.key, []);
    for (const c of conversaciones) {
      map.get(c.categoria)?.push(c);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => {
        const la = ultimoPorConv.get(a.id)?.fecha ?? "";
        const lb = ultimoPorConv.get(b.id)?.fecha ?? "";
        return +new Date(lb) - +new Date(la);
      });
    }
    return map;
  }, [conversaciones, ultimoPorConv]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {CATEGORIAS_TABLERO.map((cat) => {
        const items = porCategoria.get(cat.key) ?? [];
        return (
          <div key={cat.key} className="flex w-72 shrink-0 flex-col">
            <div
              className={cn(
                "rounded-t-xl border-x border-t px-3 py-2.5",
                HEADER_TONE[cat.tono],
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{cat.label}</span>
                <span className="rounded-full bg-card/70 px-1.5 text-xs font-semibold">
                  {items.length}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] opacity-80">{cat.descripcion}</p>
            </div>
            <div className="min-h-[8rem] flex-1 space-y-2 rounded-b-xl border border-border bg-muted/25 p-2">
              {items.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  Sin chats aquí.
                </p>
              ) : (
                items.map((c) => {
                  const last = ultimoPorConv.get(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelect(c.id)}
                      className="relative flex w-full items-start gap-2.5 overflow-hidden rounded-lg border border-border bg-card p-2.5 text-left shadow-soft transition-all hover:border-navy/30 hover:shadow-elevated"
                    >
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 w-1",
                          ACCENT[cat.tono],
                        )}
                      />
                      <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy/15 to-leaf/15 text-[11px] font-semibold text-navy">
                        {iniciales(c.contactoNombre)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-medium text-foreground">
                            {c.contactoNombre}
                          </span>
                          <CanalIcon canal={c.canal} size={11} className="shrink-0" />
                          <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                            {last
                              ? formatDistanceToNowStrict(new Date(last.fecha), {
                                  locale: es,
                                })
                              : ""}
                          </span>
                        </span>
                        {c.servicioNombre ? (
                          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                            {c.servicioNombre}
                          </span>
                        ) : null}
                        <span className="mt-1 flex items-center gap-1.5">
                          <span className="truncate text-[11px] text-muted-foreground/80">
                            {c.citaRef ?? "Sin cita"}
                          </span>
                          {c.noLeidos > 0 ? (
                            <span className="ml-auto flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-leaf px-1 text-[10px] font-semibold text-offblack">
                              {c.noLeidos}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
