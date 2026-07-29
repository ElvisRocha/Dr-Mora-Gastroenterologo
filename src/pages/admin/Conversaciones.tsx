import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Inbox, LayoutGrid, MessagesSquare, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useClinic } from "@/store/clinicStore";
import { ConversacionesList } from "@/components/admin/conversaciones/ConversacionesList";
import { ConversacionThread } from "@/components/admin/conversaciones/ConversacionThread";
import { PacienteFichaPanel } from "@/components/admin/conversaciones/PacienteFichaPanel";
import { ConversacionesTablero } from "@/components/admin/conversaciones/ConversacionesTablero";
import type { CategoriaTablero } from "@/lib/data/conversaciones";

type Vista = "bandeja" | "tablero";

export default function Conversaciones() {
  const {
    conversaciones,
    mensajes,
    eventos,
    enviarMensaje,
    marcarConversacionLeida,
    toggleModoConversacion,
    marcarMensajeAtendido,
  } = useClinic();

  const [params, setParams] = useSearchParams();
  const phoneParam = params.get("phone");

  const initialId = useMemo(() => {
    if (!phoneParam) return null;
    const digits = phoneParam.replace(/\D/g, "");
    return (
      conversaciones.find((c) => c.telefono.replace(/\D/g, "").includes(digits))
        ?.id ?? null
    );
  }, [phoneParam, conversaciones]);

  const [vista, setVista] = useState<Vista>("bandeja");
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaTablero | null>(null);
  const [fichaOpen, setFichaOpen] = useState(false);

  const selected = conversaciones.find((c) => c.id === selectedId) ?? null;
  const selMensajes = mensajes.filter((m) => m.conversacionId === selectedId);
  const selEventos = eventos.filter((e) => e.conversacionId === selectedId);

  const totalNoLeidos = conversaciones.reduce((a, c) => a + c.noLeidos, 0);

  // Cuando se entra desde una columna del tablero, la lista se acota a esa
  // categoría (se muestra el chip + botón de volver al tablero).
  const listConversaciones = categoriaActiva
    ? conversaciones.filter((c) => c.categoria === categoriaActiva)
    : conversaciones;

  // Desde el tablero llega la categoría; desde la lista normal no (undefined),
  // por lo que al navegar dentro de la columna se conserva la categoría activa.
  const handleSelect = (id: string, categoria?: CategoriaTablero) => {
    setSelectedId(id);
    setVista("bandeja");
    if (categoria !== undefined) setCategoriaActiva(categoria);
    marcarConversacionLeida(id);
  };

  const exitCategoria = () => {
    setCategoriaActiva(null);
    setSelectedId(null);
    setVista("tablero");
  };

  const clearSelection = () => {
    setSelectedId(null);
    if (phoneParam) {
      params.delete("phone");
      setParams(params, { replace: true });
    }
  };

  return (
    <div className="flex h-[calc(100dvh-140px)] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Conversaciones
          </h2>
          <p className="text-sm text-muted-foreground">
            Bandeja unificada de WhatsApp y sitio web ·{" "}
            <span className="font-medium text-navy">
              {totalNoLeidos} sin leer
            </span>
          </p>
        </div>
        <div className="inline-flex items-center rounded-full border border-border bg-muted/40 p-1">
          {(
            [
              { key: "bandeja", label: "Bandeja", icon: Inbox },
              { key: "tablero", label: "Tablero", icon: LayoutGrid },
            ] as const
          ).map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => {
                setVista(v.key);
                setCategoriaActiva(null);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                vista === v.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <v.icon size={14} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {vista === "tablero" ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <ConversacionesTablero
            conversaciones={conversaciones}
            mensajes={mensajes}
            onSelect={handleSelect}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {/* Lista */}
          <div
            className={cn(
              "w-full shrink-0 border-r border-border lg:w-80",
              selected ? "hidden lg:block" : "block",
            )}
          >
            <ConversacionesList
              conversaciones={listConversaciones}
              mensajes={mensajes}
              selectedId={selectedId}
              onSelect={handleSelect}
              categoria={categoriaActiva}
              onExitCategoria={exitCategoria}
            />
          </div>

          {/* Hilo */}
          <div
            className={cn(
              "min-w-0 flex-1",
              selected ? "block" : "hidden lg:block",
            )}
          >
            {selected ? (
              <ConversacionThread
                conversacion={selected}
                mensajes={selMensajes}
                eventos={selEventos}
                onBack={clearSelection}
                onToggleModo={() => toggleModoConversacion(selected.id)}
                onEnviar={(t) => enviarMensaje(selected.id, t)}
                onAtenderMensaje={marcarMensajeAtendido}
                onOpenFicha={() => setFichaOpen(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <MessagesSquare size={40} strokeWidth={1.4} className="opacity-40" />
                <p className="mt-3 text-sm">
                  Selecciona una conversación para ver el hilo.
                </p>
              </div>
            )}
          </div>

          {/* Ficha (xl+) */}
          {selected ? (
            <div className="hidden w-80 shrink-0 border-l border-border xl:block">
              <PacienteFichaPanel conversacion={selected} />
            </div>
          ) : null}
        </div>
      )}

      {/* Ficha como panel deslizante en pantallas pequeñas */}
      {selected && fichaOpen ? (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-foreground/40 xl:hidden"
          onClick={() => setFichaOpen(false)}
        >
          <div
            className="h-full w-[88vw] max-w-sm bg-card shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end p-2">
              <button
                type="button"
                onClick={() => setFichaOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>
            <PacienteFichaPanel conversacion={selected} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
