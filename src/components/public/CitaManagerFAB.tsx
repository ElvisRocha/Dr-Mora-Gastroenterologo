import { useEffect, useRef, useState } from "react";
import {
  CalendarClock,
  CalendarCog,
  Check,
  Search,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useClinic, type CitaFull } from "@/store/clinicStore";
import { pacientePorId } from "@/lib/mock";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type Mode = "cancelar" | "reprogramar";

export function CitaManagerFAB() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <>
      <div className="fixed bottom-24 right-5 z-40 sm:right-6" ref={ref}>
        {open ? (
          <div className="mb-2 flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("reprogramar");
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-navy shadow-elevated ring-1 ring-border hover:bg-muted"
            >
              <CalendarClock size={16} />
              Reprogramar cita
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("cancelar");
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-coral shadow-elevated ring-1 ring-border hover:bg-coral/10"
            >
              <X size={16} />
              Cancelar cita
            </button>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Administrar mi cita"
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full bg-navy text-offwhite shadow-elevated transition-transform hover:scale-105 active:scale-95",
            open && "rotate-90",
          )}
        >
          {open ? <X size={22} /> : <CalendarCog size={22} />}
        </button>
      </div>

      <CitaManagerModal mode={mode} onClose={() => setMode(null)} />
    </>
  );
}

function CitaManagerModal({
  mode,
  onClose,
}: {
  mode: Mode | null;
  onClose: () => void;
}) {
  const { citas, updateCita } = useClinic();
  const [codigo, setCodigo] = useState("");
  const [found, setFound] = useState<CitaFull | null>(null);
  const [error, setError] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("09:00");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (mode) {
      setCodigo("");
      setFound(null);
      setError("");
      setDone(false);
    }
  }, [mode]);

  const buscar = () => {
    const c = citas.find(
      (x) => x.referenceCode.toLowerCase() === codigo.trim().toLowerCase(),
    );
    if (!c) {
      setError("No encontramos ninguna cita con ese código.");
      setFound(null);
      return;
    }
    if (c.estado === "cancelada") {
      setError("Esta cita ya está cancelada.");
      setFound(null);
      return;
    }
    setError("");
    setFound(c);
    setNuevaFecha(format(new Date(c.fechaHora), "yyyy-MM-dd"));
    setNuevaHora(format(new Date(c.fechaHora), "HH:mm"));
  };

  const confirmar = () => {
    if (!found) return;
    if (mode === "cancelar") {
      updateCita(found.id, { estado: "cancelada" });
      toast.success("Cita cancelada");
    } else {
      const d = new Date(nuevaFecha);
      const [h, m] = nuevaHora.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      updateCita(found.id, { fechaHora: d.toISOString(), estado: "agendada" });
      toast.success("Cita reprogramada");
    }
    setDone(true);
  };

  const paciente = found ? pacientePorId(found.pacienteId) : undefined;

  return (
    <Modal
      open={mode !== null}
      onClose={onClose}
      title={mode === "cancelar" ? "Cancelar cita" : "Reprogramar cita"}
      description="Ingresa el código de tu cita (lo recibiste al agendar)."
      size="sm"
    >
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf/15 text-leaf">
            <Check size={26} />
          </span>
          <p className="mt-3 font-display text-lg font-semibold text-foreground">
            {mode === "cancelar" ? "Cita cancelada" : "Cita reprogramada"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Te enviamos la confirmación por WhatsApp y correo.
          </p>
          <Button className="mt-5" onClick={onClose}>
            Entendido
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Código de cita" error={error}>
            <div className="flex gap-2">
              <Input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="GK-10500"
                onKeyDown={(e) => e.key === "Enter" && buscar()}
              />
              <Button type="button" variant="outline" onClick={buscar} className="shrink-0 px-3">
                <Search size={16} />
              </Button>
            </div>
          </Field>

          {found ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
                <p className="font-medium text-foreground">
                  {paciente
                    ? `${paciente.nombre} ${paciente.apellidoPaterno}`
                    : "Paciente"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(found.fechaHora), "EEEE d 'de' MMMM · h:mm a", {
                    locale: es,
                  })}
                </p>
              </div>

              {mode === "reprogramar" ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nueva fecha">
                    <Input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />
                  </Field>
                  <Field label="Nueva hora">
                    <Input type="time" value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} step={900} />
                  </Field>
                </div>
              ) : null}

              <Button
                onClick={confirmar}
                variant={mode === "cancelar" ? "primary" : "primary"}
                className={cn("w-full", mode === "cancelar" && "bg-coral hover:bg-coral/90")}
              >
                {mode === "cancelar" ? "Sí, cancelar cita" : "Confirmar nueva fecha"}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  );
}
