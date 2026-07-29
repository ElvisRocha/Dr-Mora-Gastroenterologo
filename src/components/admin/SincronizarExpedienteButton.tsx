import { useState } from "react";
import { CheckCircle2, Loader2, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { usePaciente } from "@/store/expedienteStore";
import type { PacienteMock } from "@/lib/mock";

/**
 * "Sincronizar con expediente original": simula traer los datos del documento
 * migrado al expediente estructurado y deja registrada la fecha de sincronía.
 */
export function SincronizarExpedienteButton({
  paciente,
}: {
  paciente: PacienteMock;
}) {
  const { update } = usePaciente(paciente.id);
  const [confirming, setConfirming] = useState(false);
  const [running, setRunning] = useState(false);

  const syncedAt = paciente.sincronizadoAt;
  const syncedLabel = syncedAt
    ? (() => {
        try {
          return format(new Date(syncedAt), "d 'de' MMM yyyy", { locale: es });
        } catch {
          return "";
        }
      })()
    : "";

  const doSync = () => {
    setRunning(true);
    // La sincronía es instantánea; el breve estado es cosmético.
    window.setTimeout(() => {
      update({ sincronizadoAt: new Date().toISOString() });
      setRunning(false);
      setConfirming(false);
      toast.success("Expediente sincronizado con el documento original");
    }, 500);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        <RefreshCcw size={14} strokeWidth={1.75} />
        Sincronizar con expediente original
      </Button>
      {syncedAt ? (
        <span
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          title={`Sincronizado el ${syncedLabel}`}
        >
          <CheckCircle2 size={13} className="text-leaf" />
          Sincronizado {syncedLabel}
        </span>
      ) : null}

      <Modal
        open={confirming}
        onClose={() => !running && setConfirming(false)}
        title="Sincronizar con el expediente original"
        description="Se traerán los datos del documento migrado al expediente estructurado."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirming(false)} disabled={running}>
              Cancelar
            </Button>
            <Button onClick={doSync} disabled={running}>
              {running ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCcw size={14} strokeWidth={1.75} />
              )}
              Sincronizar
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Esta acción actualiza el expediente con la información del documento
          original y deja registrada la fecha de sincronización. Podrás seguir
          editando el expediente después.
        </p>
      </Modal>
    </>
  );
}
