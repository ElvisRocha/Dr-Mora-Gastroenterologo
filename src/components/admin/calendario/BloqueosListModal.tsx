import { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarOff, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useClinic } from "@/store/clinicStore";
import {
  BLOQUEO_LABEL,
  type BloqueoCategoria,
  type BloqueoMock,
} from "@/lib/data/bloqueos";
import { BloqueoModal } from "./BloqueoModal";

const CATEGORIA_VARIANT: Record<
  BloqueoCategoria,
  "navy" | "leaf" | "teal" | "amber" | "coral" | "neutral"
> = {
  vacaciones: "teal",
  comida: "amber",
  capacitacion: "navy",
  personal: "coral",
  feriado: "leaf",
  otro: "neutral",
};

function formatRango(b: BloqueoMock): string {
  const start = new Date(b.inicio);
  const end = new Date(b.fin);
  if (b.todoElDia) {
    return `${format(start, "EEEE d 'de' MMMM", { locale: es })} · Todo el día`;
  }
  const mismoDia =
    format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd");
  if (mismoDia) {
    return `${format(start, "EEEE d 'de' MMMM", { locale: es })} · ${format(start, "h:mm a")} – ${format(end, "h:mm a")}`;
  }
  return `${format(start, "d MMM h:mm a", { locale: es })} → ${format(end, "d MMM h:mm a", { locale: es })}`;
}

export function BloqueosListModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { bloqueos, removeBloqueo } = useClinic();
  const [editando, setEditando] = useState<BloqueoMock | null>(null);
  const [confirmar, setConfirmar] = useState<BloqueoMock | null>(null);

  // Bloqueos vigentes y futuros (cuyo fin todavía no ha pasado), ordenados.
  const vigentes = useMemo(() => {
    const ahora = Date.now();
    return bloqueos
      .filter((b) => new Date(b.fin).getTime() >= ahora)
      .sort(
        (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime(),
      );
  }, [bloqueos]);

  const eliminar = () => {
    if (!confirmar) return;
    removeBloqueo(confirmar.id);
    toast.success("Bloqueo eliminado", {
      description: "El horario vuelve a estar disponible para agendar.",
    });
    setConfirmar(null);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Bloqueos vigentes y futuros"
        description="Gestiona los horarios que no están disponibles para agendar."
        size="lg"
      >
        {vigentes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CalendarOff size={22} strokeWidth={1.5} />
            </span>
            <p className="text-sm text-muted-foreground">
              No hay bloqueos activos.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {vigentes.map((b) => (
              <li
                key={b.id}
                className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={CATEGORIA_VARIANT[b.categoria]}>
                      {BLOQUEO_LABEL[b.categoria]}
                    </Badge>
                    <span className="text-sm font-medium capitalize text-foreground">
                      {formatRango(b)}
                    </span>
                  </div>
                  {b.motivo && b.motivo !== BLOQUEO_LABEL[b.categoria] ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {b.motivo}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditando(b)}
                    aria-label="Editar bloqueo"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
                  >
                    <Pencil size={15} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmar(b)}
                    aria-label="Eliminar bloqueo"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                  >
                    <Trash2 size={15} strokeWidth={1.75} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Editar un bloqueo existente */}
      <BloqueoModal
        open={!!editando}
        onClose={() => setEditando(null)}
        bloqueo={editando}
      />

      {/* Confirmación de borrado */}
      <Modal
        open={!!confirmar}
        onClose={() => setConfirmar(null)}
        title="¿Eliminar este bloqueo?"
        description="El horario volverá a estar disponible para agendar citas."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmar(null)}>
              Cancelar
            </Button>
            <Button
              onClick={eliminar}
              className="bg-coral text-offwhite shadow-soft hover:bg-coral/90"
            >
              <Trash2 size={14} strokeWidth={1.75} />
              Eliminar
            </Button>
          </>
        }
      >
        {confirmar ? (
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <Badge variant={CATEGORIA_VARIANT[confirmar.categoria]}>
                {BLOQUEO_LABEL[confirmar.categoria]}
              </Badge>
              <span className="text-sm font-medium capitalize text-foreground">
                {formatRango(confirmar)}
              </span>
            </div>
            {confirmar.motivo &&
            confirmar.motivo !== BLOQUEO_LABEL[confirmar.categoria] ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {confirmar.motivo}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
