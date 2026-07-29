import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { PacienteMock } from "@/lib/mock";
import {
  FormularioPacienteModal,
  type FormularioTipo,
} from "./FormularioPacienteModal";

/**
 * Botón "Llenar formulario" + badge de estado. Abre el formulario pendiente
 * (primera vez antes que seguimiento; o el reabierto manualmente desde el
 * menú ⋮). Réplica pediátrica del flujo del consultorio de referencia.
 */
export function LlenarFormularioButton({
  paciente,
  preferred = null,
  onConsumePreferred,
}: {
  paciente: PacienteMock;
  preferred?: FormularioTipo | null;
  onConsumePreferred?: () => void;
}) {
  const [openForm, setOpenForm] = useState<FormularioTipo | null>(null);

  const firstDone = !!paciente.formularioPrimeraVez;
  const followDone = !!paciente.formularioSeguimiento;
  const allDone = firstDone && followDone;
  const isPending = (f: FormularioTipo) =>
    f === "first_time" ? !firstDone : !followDone;

  const nextForm: FormularioTipo =
    preferred && isPending(preferred)
      ? preferred
      : !firstDone
        ? "first_time"
        : "follow_up";

  const statusLabel = allDone
    ? "Formularios al día"
    : nextForm === "first_time"
      ? "Primera vez pendiente"
      : "Seguimiento pendiente";

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => !allDone && setOpenForm(nextForm)}
        disabled={allDone}
        title={allDone ? "Los formularios están al día" : "Llenar formulario pendiente"}
      >
        <ClipboardList size={14} strokeWidth={1.75} />
        Llenar formulario
      </Button>
      <Badge variant={allDone ? "leaf" : "amber"}>{statusLabel}</Badge>

      <FormularioPacienteModal
        pacienteId={paciente.id}
        tipo={openForm ?? "first_time"}
        open={!!openForm}
        onClose={() => setOpenForm(null)}
        onCompleted={onConsumePreferred}
      />
    </>
  );
}
