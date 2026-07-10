import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
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
  telefono: "",
  correo: "",
  direccion: "",
  tutorNombre: "",
  tutorTelefono: "",
  tutorParentesco: "madre",
  notas: "",
};

export function NuevoPacienteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addPaciente } = useExpedienteStore();
  const [f, setF] = useState({ ...EMPTY });
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
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
      telefonoTutor: f.tutorTelefono.trim() || f.telefono.trim(),
      email: f.correo.trim() || undefined,
      direccion: f.direccion.trim() || undefined,
      fechaRegistro: hoy,
    };
    addPaciente(paciente);
    toast.success("Paciente registrado", {
      description: `${nombre} ${f.primerApellido} agregado al sistema.`,
    });
    setF({ ...EMPTY });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo paciente"
      description="Registra un nuevo expediente pediátrico."
      size="xl"
    >
      <form onSubmit={submit} className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-navy">Identificación</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo">
              <Select value={f.tipoId} onChange={(e) => set("tipoId", e.target.value as TipoIdentificacion)}>
                <option value="cedula">Cédula</option>
                <option value="dimex">DIMEX</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="indocumentada">Sin cédula (menor)</option>
              </Select>
            </Field>
            <Field label="Número">
              <Input value={f.numeroId} onChange={(e) => set("numeroId", e.target.value)} placeholder="0-0000-0000" />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-navy">Datos del paciente</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primer nombre" required>
              <Input value={f.primerNombre} onChange={(e) => set("primerNombre", e.target.value)} />
            </Field>
            <Field label="Segundo nombre">
              <Input value={f.segundoNombre} onChange={(e) => set("segundoNombre", e.target.value)} />
            </Field>
            <Field label="Primer apellido" required>
              <Input value={f.primerApellido} onChange={(e) => set("primerApellido", e.target.value)} />
            </Field>
            <Field label="Segundo apellido">
              <Input value={f.segundoApellido} onChange={(e) => set("segundoApellido", e.target.value)} />
            </Field>
            <Field label="Fecha de nacimiento">
              <Input type="date" value={f.fechaNacimiento} onChange={(e) => set("fechaNacimiento", e.target.value)} />
            </Field>
            <Field label="Sexo">
              <Select value={f.sexo} onChange={(e) => set("sexo", e.target.value as PacienteMock["sexo"])}>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </Select>
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-navy">Contacto</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Teléfono">
              <Input value={f.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="+506 8888-8888" />
            </Field>
            <Field label="Correo electrónico">
              <Input type="email" value={f.correo} onChange={(e) => set("correo", e.target.value)} />
            </Field>
          </div>
          <Field label="Dirección">
            <Input value={f.direccion} onChange={(e) => set("direccion", e.target.value)} />
          </Field>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-navy">Tutor / Responsable</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nombre" required>
              <Input value={f.tutorNombre} onChange={(e) => set("tutorNombre", e.target.value)} />
            </Field>
            <Field label="Teléfono">
              <Input value={f.tutorTelefono} onChange={(e) => set("tutorTelefono", e.target.value)} placeholder="+506 8888-8888" />
            </Field>
            <Field label="Parentesco">
              <Select value={f.tutorParentesco} onChange={(e) => set("tutorParentesco", e.target.value)}>
                <option value="madre">Madre</option>
                <option value="padre">Padre</option>
                <option value="abuela">Abuela</option>
                <option value="abuelo">Abuelo</option>
                <option value="tutor legal">Tutor legal</option>
                <option value="otro">Otro</option>
              </Select>
            </Field>
          </div>
        </section>

        <Field label="Notas">
          <Textarea value={f.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Observaciones adicionales…" className="min-h-[80px]" />
        </Field>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            <UserPlus size={16} />
            Guardar paciente
          </Button>
        </div>
      </form>
    </Modal>
  );
}
