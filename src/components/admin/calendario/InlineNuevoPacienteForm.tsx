import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { useExpedienteStore } from "@/store/expedienteStore";
import type { PacienteMock, TipoIdentificacion } from "@/lib/mock";

const EMPTY = {
  tipoId: "cedula" as TipoIdentificacion,
  numeroId: "",
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  fechaNacimiento: "",
  sexo: "masculino" as PacienteMock["sexo"],
  tutorNombre: "",
  tutorParentesco: "madre",
  tutorTelefono: "",
};

/**
 * Formulario inline de "datos mínimos" para crear un paciente sin salir del
 * panel de agendar cita, igual que en el consultorio de referencia. Al guardar
 * crea el expediente y lo selecciona para la cita.
 */
export function InlineNuevoPacienteForm({
  onCreated,
  onCancel,
}: {
  onCreated: (paciente: PacienteMock) => void;
  onCancel: () => void;
}) {
  const { addPaciente } = useExpedienteStore();
  const [f, setF] = useState({ ...EMPTY });
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const guardar = () => {
    if (!f.primerNombre.trim() || !f.primerApellido.trim()) {
      toast.error("Primer nombre y primer apellido son obligatorios");
      return;
    }
    if (!f.tutorNombre.trim()) {
      toast.error("Indica el nombre del tutor o responsable");
      return;
    }
    const hoy = new Date().toISOString().slice(0, 10);
    const nombre = [f.primerNombre.trim(), f.segundoNombre.trim()]
      .filter(Boolean)
      .join(" ");
    const paciente: PacienteMock = {
      id: `pf-${Date.now()}`,
      nombre,
      apellidoPaterno: f.primerApellido.trim(),
      apellidoMaterno: f.segundoApellido.trim() || undefined,
      fechaNacimiento: f.fechaNacimiento || hoy,
      sexo: f.sexo,
      identificacion: f.numeroId.trim()
        ? { tipo: f.tipoId, numero: f.numeroId.trim() }
        : undefined,
      diagnosticosActivos: [],
      ultimaConsulta: hoy,
      tutorPrincipal: f.tutorNombre.trim(),
      tutorParentesco: f.tutorParentesco,
      telefonoTutor: f.tutorTelefono.trim(),
      fechaRegistro: hoy,
    };
    addPaciente(paciente);
    toast.success("Paciente creado", {
      description: `${nombre} ${f.primerApellido.trim()} · seleccionado para la cita.`,
    });
    onCreated(paciente);
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-navy">
          Nuevo paciente (datos mínimos)
        </p>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar formulario"
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={13} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Tipo ID">
          <Select
            value={f.tipoId}
            onChange={(e) => set("tipoId", e.target.value as TipoIdentificacion)}
          >
            <option value="cedula">Cédula</option>
            <option value="dimex">DIMEX</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="indocumentada">Sin cédula (menor)</option>
          </Select>
        </Field>
        <Field label="Número">
          <Input
            value={f.numeroId}
            onChange={(e) => set("numeroId", e.target.value)}
            placeholder="0-0000-0000"
          />
        </Field>
        <Field label="Primer nombre" required>
          <Input
            value={f.primerNombre}
            onChange={(e) => set("primerNombre", e.target.value)}
          />
        </Field>
        <Field label="Segundo nombre">
          <Input
            value={f.segundoNombre}
            onChange={(e) => set("segundoNombre", e.target.value)}
          />
        </Field>
        <Field label="Primer apellido" required>
          <Input
            value={f.primerApellido}
            onChange={(e) => set("primerApellido", e.target.value)}
          />
        </Field>
        <Field label="Segundo apellido">
          <Input
            value={f.segundoApellido}
            onChange={(e) => set("segundoApellido", e.target.value)}
          />
        </Field>
        <Field label="Fecha de nacimiento">
          <Input
            type="date"
            value={f.fechaNacimiento}
            onChange={(e) => set("fechaNacimiento", e.target.value)}
          />
        </Field>
        <Field label="Sexo">
          <Select
            value={f.sexo}
            onChange={(e) => set("sexo", e.target.value as PacienteMock["sexo"])}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </Select>
        </Field>
        <Field label="Tutor / responsable" required>
          <Input
            value={f.tutorNombre}
            onChange={(e) => set("tutorNombre", e.target.value)}
            placeholder="Nombre del tutor"
          />
        </Field>
        <Field label="Teléfono del tutor">
          <Input
            value={f.tutorTelefono}
            onChange={(e) => set("tutorTelefono", e.target.value)}
            placeholder="+506 8888-8888"
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-0.5">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" size="sm" onClick={guardar}>
          <UserPlus size={14} strokeWidth={1.75} />
          Crear y seleccionar
        </Button>
      </div>
    </div>
  );
}
