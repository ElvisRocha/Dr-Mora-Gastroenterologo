import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { useClinic, type CitaFull } from "@/store/clinicStore";
import { pacientesMock } from "@/lib/mock";
import { format } from "date-fns";

export function AgendarCitaModal({
  open,
  onClose,
  defaultDate,
  defaultHour,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
  defaultHour?: number;
}) {
  const { servicios, addCita, addNotificacion } = useClinic();
  const serviciosActivos = servicios.filter((s) => s.activo);

  const [pacienteId, setPacienteId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("09:00");

  useEffect(() => {
    if (open) {
      const d = defaultDate ?? new Date();
      setFecha(format(d, "yyyy-MM-dd"));
      if (defaultHour != null) setHora(`${String(defaultHour).padStart(2, "0")}:00`);
    }
  }, [open, defaultDate, defaultHour]);

  const servicio = useMemo(
    () => serviciosActivos.find((s) => s.id === servicioId),
    [serviciosActivos, servicioId],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !servicioId || !fecha || !hora) {
      toast.error("Completa paciente, servicio, fecha y hora");
      return;
    }
    const paciente = pacientesMock.find((p) => p.id === pacienteId);
    const [h, m] = hora.split(":").map(Number);
    const d = new Date(fecha);
    d.setHours(h, m, 0, 0);
    const cita: CitaFull = {
      id: `c-${Date.now()}`,
      pacienteId,
      servicioSlug: servicioId,
      fechaHora: d.toISOString(),
      duracionMin: servicio?.duracionMin ?? 30,
      estado: "agendada",
      source: "manual",
      referenceCode: `GK-${Math.floor(10000 + Math.random() * 90000)}`,
      monto: servicio?.precio,
    };
    addCita(cita);
    addNotificacion({
      id: `n-${Date.now()}`,
      tipo: "cita_agendada",
      titulo: "Cita agendada",
      mensaje: `${paciente?.nombre ?? "Paciente"} ${paciente?.apellidoPaterno ?? ""} · ${servicio?.nombre ?? ""}`,
      leida: false,
      fecha: new Date().toISOString(),
      vista: "calendario",
      pacienteId,
    });
    toast.success("Cita agendada", {
      description: `${paciente?.nombre} · ${format(d, "dd/MM · HH:mm")}`,
    });
    setPacienteId("");
    setServicioId("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Agendar cita"
      description="Registra una cita en la agenda del Dr. Mora."
      size="md"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Paciente" required>
          <Select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
            <option value="">Selecciona un paciente</option>
            {pacientesMock.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno ?? ""}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Servicio" required>
          <Select value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
            <option value="">Selecciona un servicio</option>
            {serviciosActivos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} · {s.duracion}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fecha" required>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </Field>
          <Field label="Hora" required>
            <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} step={900} />
          </Field>
        </div>
        {servicio ? (
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
            <p className="font-medium text-foreground">{servicio.nombre}</p>
            <p className="text-xs text-muted-foreground">
              Duración {servicio.duracion}
              {servicio.requiereSecretaria
                ? " · Requiere coordinación de recepción"
                : ""}
            </p>
          </div>
        ) : null}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Agendar cita</Button>
        </div>
      </form>
    </Modal>
  );
}
