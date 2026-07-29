import { useEffect, useState } from "react";
import { Send, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { SidePanel } from "@/components/ui/SidePanel";
import { TriStateChips } from "@/components/ui/TriStateChips";
import { usePaciente, useExpedienteStore } from "@/store/expedienteStore";
import type { TriState } from "@/lib/mock";

export type FormularioTipo = "first_time" | "follow_up";

type FirstState = {
  tutorNombre: string;
  tutorParentesco: string;
  tutorTelefono: string;
  tutorEmail: string;
  motivo: string;
  padeceEnfermedad: TriState;
  cualEnfermedad: string;
  tieneAlergias: TriState;
  alergias: string;
  haSidoOperado: TriState;
  cirugias: string;
  familiares: string;
  tipoParto: "vaginal" | "cesarea" | "no_especificado";
  pesoNacerKg: string;
  lactanciaMaterna: TriState;
  lactancia: string;
  alimentacion: string;
  habitoIntestinal: string;
};

type FollowState = {
  motivo: string;
  cambios: string;
  adherencia: string;
  sintomas: string;
};

const emptyFirst = (): FirstState => ({
  tutorNombre: "",
  tutorParentesco: "madre",
  tutorTelefono: "",
  tutorEmail: "",
  motivo: "",
  padeceEnfermedad: null,
  cualEnfermedad: "",
  tieneAlergias: null,
  alergias: "",
  haSidoOperado: null,
  cirugias: "",
  familiares: "",
  tipoParto: "no_especificado",
  pesoNacerKg: "",
  lactanciaMaterna: null,
  lactancia: "",
  alimentacion: "",
  habitoIntestinal: "",
});

const emptyFollow = (): FollowState => ({
  motivo: "",
  cambios: "",
  adherencia: "",
  sintomas: "",
});

function Chip({
  label,
  value,
  onChange,
  detail,
  onDetail,
  placeholder,
}: {
  label: string;
  value: TriState;
  onChange: (v: boolean) => void;
  detail: string;
  onDetail: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-tight text-foreground">
          {label}
        </span>
        <TriStateChips value={value} onChange={onChange} className="shrink-0" />
      </div>
      {value === true ? (
        <div className="animate-fade-up">
          <Textarea
            value={detail}
            onChange={(e) => onDetail(e.target.value)}
            placeholder={placeholder}
            className="min-h-[64px]"
          />
        </div>
      ) : null}
    </div>
  );
}

export function FormularioPacienteModal({
  pacienteId,
  tipo,
  open,
  onClose,
  onCompleted,
}: {
  pacienteId: string;
  tipo: FormularioTipo;
  open: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}) {
  const { paciente, update } = usePaciente(pacienteId);
  const store = useExpedienteStore();
  const [first, setFirst] = useState<FirstState>(emptyFirst);
  const [follow, setFollow] = useState<FollowState>(emptyFollow);

  useEffect(() => {
    if (!open) return;
    if (tipo === "first_time") {
      setFirst({
        ...emptyFirst(),
        tutorNombre: paciente?.tutorPrincipal ?? "",
        tutorParentesco: paciente?.tutorParentesco ?? "madre",
        tutorTelefono: paciente?.telefonoTutor ?? "",
        tutorEmail: paciente?.email ?? "",
      });
    } else {
      setFollow(emptyFollow());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tipo]);

  if (!paciente) return null;

  const setF = <K extends keyof FirstState>(k: K, v: FirstState[K]) =>
    setFirst((p) => ({ ...p, [k]: v }));
  const setU = <K extends keyof FollowState>(k: K, v: FollowState[K]) =>
    setFollow((p) => ({ ...p, [k]: v }));

  const submitFirst = () => {
    // Los datos del formulario alimentan el expediente estructurado.
    const exp = store.getExpediente(pacienteId);
    store.updateExpediente(pacienteId, {
      antecedentes: {
        ...exp.antecedentes,
        padeceEnfermedad: first.padeceEnfermedad,
        cualEnfermedad: first.cualEnfermedad,
        tieneAlergias: first.tieneAlergias,
        alergias: first.alergias,
        haSidoOperado: first.haSidoOperado,
        cirugias: first.cirugias,
        familiares: first.familiares || exp.antecedentes.familiares,
      },
      perinatal: {
        ...exp.perinatal,
        tipoParto: first.tipoParto,
        pesoNacerKg: first.pesoNacerKg ? Number(first.pesoNacerKg) : exp.perinatal.pesoNacerKg,
        lactanciaMaterna: first.lactanciaMaterna,
        lactancia: first.lactancia || exp.perinatal.lactancia,
      },
    });
    update({
      formularioPrimeraVez: true,
      tutorPrincipal: first.tutorNombre || paciente.tutorPrincipal,
      tutorParentesco: first.tutorParentesco,
      telefonoTutor: first.tutorTelefono || paciente.telefonoTutor,
      email: first.tutorEmail || paciente.email,
    });
    toast.success("Formulario de primera vez enviado ✓");
    onCompleted?.();
    onClose();
  };

  const submitFollow = () => {
    update({ formularioSeguimiento: true });
    toast.success("Formulario de seguimiento enviado ✓");
    onCompleted?.();
    onClose();
  };

  const isFirst = tipo === "first_time";
  const canSave = isFirst ? !!first.motivo.trim() : !!follow.motivo.trim();
  const subtitle = `${paciente.nombre} ${paciente.apellidoPaterno}`;

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isFirst ? "Formulario de primera vez" : "Formulario de seguimiento"}
      subtitle={subtitle}
      widthClass="sm:max-w-xl lg:max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={isFirst ? submitFirst : submitFollow} disabled={!canSave}>
            <Send size={14} strokeWidth={1.75} />
            Enviar formulario
          </Button>
        </>
      }
    >
      <div className="mb-5 flex items-start gap-2 rounded-xl border border-navy/15 bg-navy/5 p-3 text-xs text-muted-foreground">
        <ClipboardList size={15} className="mt-0.5 shrink-0 text-navy" />
        <span>
          {isFirst
            ? "Los datos que captures aquí alimentan automáticamente el expediente (antecedentes y perinatal)."
            : "Registro rápido del control: cambios, adherencia y síntomas actuales."}
        </span>
      </div>

      {isFirst ? (
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Responsable</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre del responsable">
                <Input value={first.tutorNombre} onChange={(e) => setF("tutorNombre", e.target.value)} placeholder="Nombre y apellidos" />
              </Field>
              <Field label="Parentesco">
                <Select value={first.tutorParentesco} onChange={(e) => setF("tutorParentesco", e.target.value)}>
                  <option value="madre">Madre</option>
                  <option value="padre">Padre</option>
                  <option value="abuelo">Abuelo/a</option>
                  <option value="tutor">Tutor/a legal</option>
                  <option value="otro">Otro</option>
                </Select>
              </Field>
              <Field label="Teléfono">
                <Input value={first.tutorTelefono} onChange={(e) => setF("tutorTelefono", e.target.value)} placeholder="+506 8888-8888" />
              </Field>
              <Field label="Correo">
                <Input type="email" value={first.tutorEmail} onChange={(e) => setF("tutorEmail", e.target.value)} placeholder="correo@ejemplo.cr" />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Motivo</h3>
            <Field label="Motivo de la primera visita" required>
              <Textarea value={first.motivo} onChange={(e) => setF("motivo", e.target.value)} placeholder="¿Qué los trae a consulta?" className="min-h-[64px]" />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Antecedentes</h3>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Chip label="¿Padece alguna enfermedad?" value={first.padeceEnfermedad} onChange={(v) => setF("padeceEnfermedad", v)} detail={first.cualEnfermedad} onDetail={(v) => setF("cualEnfermedad", v)} placeholder="¿Cuál?" />
              <Chip label="¿Tiene alergias?" value={first.tieneAlergias} onChange={(v) => setF("tieneAlergias", v)} detail={first.alergias} onDetail={(v) => setF("alergias", v)} placeholder="¿A qué?" />
              <Chip label="¿Lo/la han operado?" value={first.haSidoOperado} onChange={(v) => setF("haSidoOperado", v)} detail={first.cirugias} onDetail={(v) => setF("cirugias", v)} placeholder="¿De qué?" />
            </div>
            <Field label="Enfermedades importantes en la familia">
              <Textarea value={first.familiares} onChange={(e) => setF("familiares", e.target.value)} placeholder="Ej: celiaquía, enfermedad inflamatoria intestinal, alergias…" className="min-h-[64px]" />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Perinatal y alimentación</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo de parto">
                <Select value={first.tipoParto} onChange={(e) => setF("tipoParto", e.target.value as FirstState["tipoParto"])}>
                  <option value="no_especificado">No especificado</option>
                  <option value="vaginal">Vaginal</option>
                  <option value="cesarea">Cesárea</option>
                </Select>
              </Field>
              <Field label="Peso al nacer (kg)">
                <Input type="number" inputMode="decimal" step="0.1" value={first.pesoNacerKg} onChange={(e) => setF("pesoNacerKg", e.target.value)} placeholder="Ej: 3.4" />
              </Field>
            </div>
            <Chip label="¿Recibió lactancia materna?" value={first.lactanciaMaterna} onChange={(v) => setF("lactanciaMaterna", v)} detail={first.lactancia} onDetail={(v) => setF("lactancia", v)} placeholder="Duración y detalle" />
            <Field label="Alimentación actual">
              <Textarea value={first.alimentacion} onChange={(e) => setF("alimentacion", e.target.value)} placeholder="Tipo de dieta, apetito…" className="min-h-[56px]" />
            </Field>
            <Field label="Hábito intestinal">
              <Textarea value={first.habitoIntestinal} onChange={(e) => setF("habitoIntestinal", e.target.value)} placeholder="Frecuencia, consistencia…" className="min-h-[56px]" />
            </Field>
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Motivo del control" required>
            <Textarea value={follow.motivo} onChange={(e) => setU("motivo", e.target.value)} placeholder="¿Motivo de este control?" className="min-h-[64px]" />
          </Field>
          <Field label="Cambios desde la última visita">
            <Textarea value={follow.cambios} onChange={(e) => setU("cambios", e.target.value)} placeholder="Evolución de síntomas, crecimiento, apetito…" />
          </Field>
          <Field label="Adherencia al tratamiento">
            <Textarea value={follow.adherencia} onChange={(e) => setU("adherencia", e.target.value)} placeholder="Cumplimiento de medicación y dieta…" />
          </Field>
          <Field label="Síntomas actuales">
            <Textarea value={follow.sintomas} onChange={(e) => setU("sintomas", e.target.value)} placeholder="Síntomas presentes hoy…" />
          </Field>
        </div>
      )}
    </SidePanel>
  );
}
