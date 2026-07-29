import { useEffect, useRef, useState } from "react";
import { FileClock, FileText, MoreVertical, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { usePaciente } from "@/store/expedienteStore";
import type { PacienteMock } from "@/lib/mock";
import type { FormularioTipo } from "./FormularioPacienteModal";

/**
 * Menú ⋮ del expediente: reabrir formularios (dejarlos pendientes de nuevo) y
 * abrir el expediente original. Réplica pediátrica del menú de acciones.
 */
export function PacienteAccionesMenu({
  paciente,
  onReactivate,
  onVerOriginal,
}: {
  paciente: PacienteMock;
  onReactivate: (form: FormularioTipo) => void;
  onVerOriginal: () => void;
}) {
  const { update } = usePaciente(paciente.id);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const reabrir = (form: FormularioTipo) => {
    setOpen(false);
    update(
      form === "first_time"
        ? { formularioPrimeraVez: false }
        : { formularioSeguimiento: false },
    );
    onReactivate(form);
    toast.success(
      form === "first_time"
        ? "Formulario de primera vez reabierto"
        : "Formulario de seguimiento reabierto",
    );
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Más acciones"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <MoreVertical size={16} strokeWidth={1.75} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-elevated"
        >
          <MenuItem
            icon={<FileText size={15} strokeWidth={1.75} />}
            label="Ver expediente original"
            onClick={() => {
              setOpen(false);
              onVerOriginal();
            }}
          />
          <div className="my-1 h-px bg-border" />
          <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Reabrir formularios
          </p>
          <MenuItem
            icon={<RotateCcw size={15} strokeWidth={1.75} />}
            label="Formulario de primera vez"
            onClick={() => reabrir("first_time")}
          />
          <MenuItem
            icon={<FileClock size={15} strokeWidth={1.75} />}
            label="Formulario de seguimiento"
            onClick={() => reabrir("follow_up")}
          />
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
    >
      <span className="text-navy">{icon}</span>
      {label}
    </button>
  );
}
