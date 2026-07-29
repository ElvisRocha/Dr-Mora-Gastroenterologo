import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Calendario from "@/pages/admin/Calendario";
import { AgendarCitaModal, type ReagendarCita } from "./AgendarCitaModal";

/**
 * Modal grande que muestra el calendario completo (en modo selector) a la
 * izquierda y el panel de "Agendar/Reagendar cita" a la derecha, igual que el
 * consultorio de referencia: se hace clic en una celda libre para elegir la
 * fecha/hora y el panel ya viene abierto con el paciente preseleccionado.
 */
export function AgendarCitaCalendarModal({
  open,
  onClose,
  defaultPacienteId,
  pacienteNombre,
  reagendarCita,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  defaultPacienteId?: string;
  pacienteNombre?: string;
  reagendarCita?: ReagendarCita | null;
  onSaved?: () => void;
}) {
  const [slot, setSlot] = useState<{
    date: Date;
    hour: number;
    minute: number;
  } | null>(null);

  useEffect(() => {
    if (open) setSlot(null);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const esReagenda = !!reagendarCita;

  return createPortal(
    <>
      {/* Contenedor (calendario) por debajo del panel lateral */}
      <div className="fixed inset-0 z-40 flex bg-foreground/60 p-2 sm:p-4">
        <div className="relative m-auto flex h-[96vh] w-[98vw] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={16} strokeWidth={1.75} />
            </button>
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-semibold text-navy">
                {esReagenda ? "Reagendar cita" : "Nueva cita"}
                {pacienteNombre ? (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    · {pacienteNombre}
                  </span>
                ) : null}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {esReagenda
                  ? "Modifica la fecha y hora desde el calendario. El panel de la cita ya está abierto a la derecha."
                  : "Elige un espacio libre en el calendario; el paciente ya viene preseleccionado a la derecha."}
              </p>
            </div>
          </div>

          {/* El padding derecho deja espacio para el panel lateral (lg+). */}
          <div className="flex-1 overflow-auto px-3 py-3 sm:px-4 lg:pr-[30rem]">
            <Calendario
              pickMode
              onPickSlot={(date, hour, minute) =>
                setSlot({ date, hour, minute })
              }
            />
          </div>
        </div>
      </div>

      {/* Panel lateral (sin backdrop) por encima del calendario */}
      <AgendarCitaModal
        open
        bare
        widthClass="sm:max-w-md"
        onClose={onClose}
        defaultPacienteId={defaultPacienteId}
        reagendarCita={reagendarCita}
        slotPick={slot}
        onSaved={onSaved}
      />
    </>,
    document.body,
  );
}
