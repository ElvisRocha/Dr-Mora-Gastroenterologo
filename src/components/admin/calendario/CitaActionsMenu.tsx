import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ban,
  CalendarCheck,
  CheckCircle2,
  FileText,
  MoreVertical,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useClinic, type CitaFull } from "@/store/clinicStore";
import { pacientePorId } from "@/lib/mock";
import { cn } from "@/lib/cn";

export function CitaActionsMenu({
  cita,
  compact,
}: {
  cita: CitaFull;
  compact?: boolean;
}) {
  const { updateCita, addNotificacion } = useClinic();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const paciente = pacientePorId(cita.pacienteId);
  const nombre = paciente
    ? `${paciente.nombre} ${paciente.apellidoPaterno}`
    : "el paciente";

  const setEstado = (estado: CitaFull["estado"], msg: string) => {
    updateCita(cita.id, { estado });
    toast.success(msg);
    setOpen(false);
  };

  const cancelar = () => {
    updateCita(cita.id, { estado: "cancelada" });
    addNotificacion({
      id: `n-${Date.now()}`,
      tipo: "cita_cancelada",
      titulo: "Cita cancelada",
      mensaje: `Se canceló la cita de ${nombre}. El cupo quedó libre — puedes reasignarlo desde la lista de espera.`,
      leida: false,
      fecha: new Date().toISOString(),
      vista: "lista-espera",
      citaCanceladaFecha: format(new Date(cita.fechaHora), "dd/MM · HH:mm"),
      pacienteId: cita.pacienteId,
    });
    toast("Cita cancelada", { description: "Notificación enviada a lista de espera." });
    setOpen(false);
  };

  const items = [
    {
      label: "Confirmar",
      icon: CalendarCheck,
      onClick: () => setEstado("confirmada", "Cita confirmada"),
      show: cita.estado !== "confirmada" && cita.estado !== "realizada",
      tone: "text-leaf",
    },
    {
      label: "Marcar realizada",
      icon: CheckCircle2,
      onClick: () => setEstado("realizada", "Cita marcada como realizada"),
      show: cita.estado !== "realizada",
      tone: "text-navy",
    },
    {
      label: "No asistió",
      icon: UserX,
      onClick: () => setEstado("no_asistio", "Marcada como no asistió"),
      show: cita.estado !== "no_asistio" && cita.estado !== "realizada",
      tone: "text-amber",
    },
    {
      label: "Abrir expediente",
      icon: FileText,
      onClick: () => {
        setOpen(false);
        navigate(`/admin/pacientes/${cita.pacienteId}`);
      },
      show: true,
      tone: "text-foreground",
    },
  ].filter((i) => i.show);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={cn(
          "flex items-center justify-center rounded-full text-current opacity-70 transition-opacity hover:opacity-100",
          compact ? "h-5 w-5" : "h-6 w-6",
        )}
        aria-label="Acciones de la cita"
      >
        <MoreVertical size={compact ? 13 : 15} />
      </button>
      {open ? (
        <div
          className="absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-elevated"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              onClick={it.onClick}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
            >
              <it.icon size={15} className={it.tone} />
              {it.label}
            </button>
          ))}
          {cita.estado !== "cancelada" ? (
            <button
              type="button"
              onClick={cancelar}
              className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm text-coral hover:bg-coral/10"
            >
              <Ban size={15} />
              Cancelar cita
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
