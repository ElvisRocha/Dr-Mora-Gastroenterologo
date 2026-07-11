import { useEffect, useMemo, useState } from "react";
import { Search, Pin, PauseCircle, ChevronDown } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/cn";
import { CanalIcon } from "./CanalIcon";
import {
  formatTelefono,
  type ConversacionMock,
  type MensajeMock,
} from "@/lib/data/conversaciones";

type EstadoFilter = "todas" | "no_leidas" | "sin_responder";

const ESTADO_TABS: { key: EstadoFilter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "no_leidas", label: "No leídas" },
  { key: "sin_responder", label: "Sin responder" },
];

function iniciales(nombre: string) {
  const parts = nombre.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "#";
}

export function ConversacionesList({
  conversaciones,
  mensajes,
  selectedId,
  onSelect,
}: {
  conversaciones: ConversacionMock[];
  mensajes: MensajeMock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<EstadoFilter>("todas");
  const PAGE = 20;
  const [visible, setVisible] = useState(PAGE);

  // Al cambiar de búsqueda o filtro, volvemos a la primera "página".
  useEffect(() => {
    setVisible(PAGE);
  }, [q, estado]);

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

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const termDigits = term.replace(/\D/g, "");
    return conversaciones
      .filter((c) => {
        if (estado === "no_leidas" && c.noLeidos === 0) return false;
        if (estado === "sin_responder") {
          const last = ultimoPorConv.get(c.id);
          if (!last || last.direccion !== "entrante") return false;
        }
        if (!term) return true;
        const inName = c.contactoNombre.toLowerCase().includes(term);
        const inPac = (c.pacienteNombre ?? "").toLowerCase().includes(term);
        const inBody = (ultimoPorConv.get(c.id)?.texto ?? "")
          .toLowerCase()
          .includes(term);
        const inPhone =
          termDigits.length > 0 &&
          c.telefono.replace(/\D/g, "").includes(termDigits);
        return inName || inPac || inBody || inPhone;
      })
      .sort((a, b) => {
        if (!!a.anclado !== !!b.anclado) return a.anclado ? -1 : 1;
        const la = ultimoPorConv.get(a.id)?.fecha ?? "";
        const lb = ultimoPorConv.get(b.id)?.fecha ?? "";
        return +new Date(lb) - +new Date(la);
      });
  }, [conversaciones, q, estado, ultimoPorConv]);

  const noLeidasCount = conversaciones.filter((c) => c.noLeidos > 0).length;
  const shown = filtered.slice(0, visible);
  const restantes = filtered.length - shown.length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border px-3 py-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o teléfono…"
            className="w-full rounded-full border border-border bg-muted/40 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-navy/40 focus:bg-card"
          />
        </div>
        <div className="mt-2.5 inline-flex w-full items-center rounded-full border border-border bg-muted/40 p-0.5">
          {ESTADO_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setEstado(t.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all",
                estado === t.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {t.key === "no_leidas" && noLeidasCount > 0 ? (
                <span className="rounded-full bg-navy px-1.5 text-[10px] font-semibold text-offwhite">
                  {noLeidasCount > 99 ? "99+" : noLeidasCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {q ? "Sin resultados." : "Aún no hay conversaciones."}
          </p>
        ) : (
          <ul>
            {shown.map((c) => {
              const last = ultimoPorConv.get(c.id);
              const selected = c.id === selectedId;
              const paused = c.modo === "humano";
              const preview =
                last?.texto ||
                (last?.media ? "📎 Archivo adjunto" : "Sin mensajes");
              const prefix =
                last && last.direccion === "saliente"
                  ? last.autor === "bot"
                    ? "Gastrito: "
                    : "Tú: "
                  : "";
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-border/70 px-3 py-3 text-left transition-colors",
                      selected
                        ? paused
                          ? "bg-coral/10"
                          : "bg-navy/[0.07]"
                        : "hover:bg-muted/50",
                      paused && !selected && "border-l-2 border-l-coral",
                    )}
                  >
                    <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy/15 to-leaf/15 text-xs font-semibold text-navy">
                      {iniciales(c.contactoNombre)}
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card ring-1 ring-border">
                        <CanalIcon canal={c.canal} size={9} />
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "truncate text-sm",
                            c.noLeidos > 0
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground",
                          )}
                        >
                          {c.contactoNombre}
                        </span>
                        {c.anclado ? (
                          <Pin size={11} className="shrink-0 fill-navy/70 text-navy/70" />
                        ) : null}
                        {paused ? (
                          <PauseCircle size={12} className="shrink-0 text-coral" />
                        ) : null}
                        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                          {last
                            ? formatDistanceToNowStrict(new Date(last.fecha), {
                                locale: es,
                                addSuffix: false,
                              })
                            : ""}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground/80">
                        {c.pacienteNombre
                          ? c.pacienteNombre
                          : formatTelefono(c.telefono)}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5">
                        <span
                          className={cn(
                            "truncate text-xs",
                            c.noLeidos > 0
                              ? "font-medium text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {prefix}
                          {preview}
                        </span>
                        {c.noLeidos > 0 ? (
                          <span className="ml-auto flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-leaf px-1 text-[10px] font-semibold text-offblack">
                            {c.noLeidos}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {restantes > 0 ? (
          <div className="px-3 py-3">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-navy transition-colors hover:bg-navy/5"
            >
              <ChevronDown size={14} strokeWidth={2} />
              Cargar más… ({restantes})
            </button>
          </div>
        ) : filtered.length > PAGE ? (
          <p className="px-3 py-3 text-center text-[11px] text-muted-foreground">
            {filtered.length} conversaciones
          </p>
        ) : null}
      </div>
    </div>
  );
}
