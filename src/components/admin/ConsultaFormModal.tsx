import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  type ConsultaMock,
  type MedicamentoMock,
  serviciosMock,
} from "@/lib/mock";
import { useConsultas, usePaciente } from "@/store/expedienteStore";
import { useLang } from "@/contexts/LanguageContext";
import {
  ChipsInput,
  MedicamentosEditor,
} from "./EditarPacienteModal";

type FormState = {
  servicioSlug: string;
  acompanante: string;
  motivo: string;
  enfermedadActual: string;
  resultadosLaboratorio: string;
  signosVitales: {
    pa: string;
    fc: string;
    pesoKg: string;
    tallaCm: string;
    temperatura: string;
  };
  exploracionFisica: {
    abdomen: string;
    general: string;
  };
  diagnosticos: string[];
  procedimientosOrdenados: string[];
  medicamentosRecetados: MedicamentoMock[];
  planTratamiento: string;
  notasAdicionales: string;
};

const emptyForm: FormState = {
  servicioSlug: "consulta-gastro",
  acompanante: "",
  motivo: "",
  enfermedadActual: "",
  resultadosLaboratorio: "",
  signosVitales: {
    pa: "",
    fc: "",
    pesoKg: "",
    tallaCm: "",
    temperatura: "",
  },
  exploracionFisica: {
    abdomen: "",
    general: "",
  },
  diagnosticos: [],
  procedimientosOrdenados: [],
  medicamentosRecetados: [],
  planTratamiento: "",
  notasAdicionales: "",
};

function fromConsulta(c: ConsultaMock): FormState {
  return {
    servicioSlug: c.servicioSlug,
    acompanante: c.acompanante ?? "",
    motivo: c.motivo,
    enfermedadActual: c.enfermedadActual ?? "",
    resultadosLaboratorio: c.resultadosLaboratorio ?? "",
    signosVitales: {
      pa: c.signosVitales?.pa ?? "",
      fc: c.signosVitales?.fc ?? "",
      pesoKg: c.signosVitales?.pesoKg?.toString() ?? "",
      tallaCm: c.signosVitales?.tallaCm?.toString() ?? "",
      temperatura: c.signosVitales?.temperatura?.toString() ?? "",
    },
    exploracionFisica: {
      abdomen: c.exploracionFisica?.abdomen ?? "",
      general: c.exploracionFisica?.general ?? "",
    },
    diagnosticos: [...c.diagnosticos],
    procedimientosOrdenados: [...c.procedimientosOrdenados],
    medicamentosRecetados: c.medicamentosRecetados.map((m) => ({ ...m })),
    planTratamiento: c.planTratamiento ?? "",
    notasAdicionales: c.notasAdicionales ?? "",
  };
}

function calcImc(pesoStr: string, tallaCmStr: string): number | null {
  const peso = parseFloat(pesoStr);
  const tallaCm = parseFloat(tallaCmStr);
  if (!peso || !tallaCm || tallaCm <= 0) return null;
  const tallaM = tallaCm / 100;
  return Math.round((peso / (tallaM * tallaM)) * 10) / 10;
}

export function ConsultaFormModal({
  pacienteId,
  open,
  onClose,
  consulta,
}: {
  pacienteId: string;
  open: boolean;
  onClose: () => void;
  /** Si se pasa, modal entra en modo edición. */
  consulta?: ConsultaMock | null;
}) {
  const { t } = useLang();
  const { paciente, update } = usePaciente(pacienteId);
  const { addConsulta, updateConsulta } = useConsultas(pacienteId);
  const [form, setForm] = useState<FormState>(emptyForm);

  const isEdit = !!consulta;

  useEffect(() => {
    if (open) {
      setForm(consulta ? fromConsulta(consulta) : emptyForm);
    }
  }, [open, consulta]);

  const imc = useMemo(
    () => calcImc(form.signosVitales.pesoKg, form.signosVitales.tallaCm),
    [form.signosVitales.pesoKg, form.signosVitales.tallaCm],
  );

  if (!paciente) return null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setSV = <K extends keyof FormState["signosVitales"]>(
    key: K,
    value: string,
  ) =>
    setForm((prev) => ({
      ...prev,
      signosVitales: { ...prev.signosVitales, [key]: value },
    }));

  const setEF = <K extends keyof FormState["exploracionFisica"]>(
    key: K,
    value: string,
  ) =>
    setForm((prev) => ({
      ...prev,
      exploracionFisica: { ...prev.exploracionFisica, [key]: value },
    }));

  const handleSave = () => {
    if (!form.motivo.trim()) return;

    const sv = form.signosVitales;
    const signosVitales =
      sv.pa || sv.fc || sv.pesoKg || sv.tallaCm || sv.temperatura
        ? {
            pa: sv.pa.trim() || undefined,
            fc: sv.fc.trim() || undefined,
            pesoKg: sv.pesoKg ? Number(sv.pesoKg) : undefined,
            tallaCm: sv.tallaCm ? Number(sv.tallaCm) : undefined,
            temperatura: sv.temperatura ? Number(sv.temperatura) : undefined,
            imc: imc ?? undefined,
          }
        : undefined;

    const ef = form.exploracionFisica;
    const exploracionFisica =
      ef.abdomen.trim() || ef.general.trim()
        ? {
            abdomen: ef.abdomen.trim() || undefined,
            general: ef.general.trim() || undefined,
          }
        : undefined;

    const meta = serviciosMock.find((s) => s.slug === form.servicioSlug);

    const baseFields: Omit<ConsultaMock, "id" | "fecha" | "duracionMin"> = {
      pacienteId,
      servicioSlug: form.servicioSlug,
      motivo: form.motivo.trim(),
      notas: form.notasAdicionales.trim(),
      diagnosticos: form.diagnosticos,
      procedimientosOrdenados: form.procedimientosOrdenados,
      medicamentosRecetados: form.medicamentosRecetados,
      acompanante: form.acompanante.trim() || undefined,
      enfermedadActual: form.enfermedadActual.trim() || undefined,
      resultadosLaboratorio: form.resultadosLaboratorio.trim() || undefined,
      signosVitales,
      exploracionFisica,
      planTratamiento: form.planTratamiento.trim() || undefined,
      notasAdicionales: form.notasAdicionales.trim() || undefined,
    };

    if (isEdit && consulta) {
      updateConsulta(consulta.id, baseFields);
    } else {
      const nueva: ConsultaMock = {
        ...baseFields,
        id: `co-${Date.now()}`,
        fecha: new Date().toISOString(),
        duracionMin: meta?.duracion ?? 0,
      };
      addConsulta(nueva);
    }

    // Sincronizar paciente con dx, meds y procedimientos nuevos.
    const mergedDx = Array.from(
      new Set([...paciente.diagnosticosActivos, ...form.diagnosticos]),
    );
    const existingMedNames = new Set(
      (paciente.medicamentosActivos ?? []).map((m) => m.nombre.toLowerCase()),
    );
    const newMeds = form.medicamentosRecetados.filter(
      (m) => !existingMedNames.has(m.nombre.toLowerCase()),
    );
    const existingProc = new Set(
      (paciente.procedimientosAsignados ?? []).map((p) =>
        p.nombre.toLowerCase(),
      ),
    );
    const newProc = form.procedimientosOrdenados
      .filter((p) => !existingProc.has(p.toLowerCase()))
      .map((nombre) => ({ nombre, estado: "pendiente" as const }));

    const patientPatch: Partial<typeof paciente> = {
      diagnosticosActivos: mergedDx,
      medicamentosActivos: [
        ...(paciente.medicamentosActivos ?? []),
        ...newMeds,
      ],
      procedimientosAsignados: [
        ...(paciente.procedimientosAsignados ?? []),
        ...newProc,
      ],
    };
    if (!isEdit) {
      patientPatch.ultimaConsulta = new Date().toISOString();
    }
    update(patientPatch);

    onClose();
  };

  const canSave = !!form.motivo.trim();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar consulta" : "Nueva consulta"}
      description={`${paciente.nombre} ${paciente.apellidoPaterno}${paciente.apellidoMaterno ? ` ${paciente.apellidoMaterno}` : ""}`}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            <Save size={14} strokeWidth={1.75} />
            {isEdit ? "Guardar cambios" : "Guardar consulta"}
          </Button>
        </>
      }
    >
      <div className="space-y-7">
        <Section title="Datos generales">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de servicio" required>
              <Select
                value={form.servicioSlug}
                onChange={(e) => set("servicioSlug", e.target.value)}
              >
                {t.servicios.items.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.nombre}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="¿Quién acompaña al paciente?">
              <Input
                value={form.acompanante}
                onChange={(e) => set("acompanante", e.target.value)}
                placeholder="Nombre y relación del acompañante"
              />
            </Field>
          </div>
          <Field label="Motivo de consulta" required className="mt-4">
            <Textarea
              rows={2}
              value={form.motivo}
              onChange={(e) => set("motivo", e.target.value)}
              placeholder="¿Por qué acude el paciente?"
            />
          </Field>
          <Field label="Enfermedad actual" className="mt-4">
            <Textarea
              rows={3}
              value={form.enfermedadActual}
              onChange={(e) => set("enfermedadActual", e.target.value)}
              placeholder="Descripción detallada de la enfermedad actual…"
            />
          </Field>
          <Field label="Resultados de laboratorio" className="mt-4">
            <Textarea
              rows={3}
              value={form.resultadosLaboratorio}
              onChange={(e) => set("resultadosLaboratorio", e.target.value)}
              placeholder="Resultados de exámenes de laboratorio…"
            />
          </Field>
        </Section>

        <Section title="Signos vitales">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Field label="PA">
              <Input
                value={form.signosVitales.pa}
                onChange={(e) => setSV("pa", e.target.value)}
                placeholder="100/60"
              />
            </Field>
            <Field label="FC">
              <Input
                value={form.signosVitales.fc}
                onChange={(e) => setSV("fc", e.target.value)}
                placeholder="100 lpm"
              />
            </Field>
            <Field label="Peso (kg)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={form.signosVitales.pesoKg}
                onChange={(e) => setSV("pesoKg", e.target.value)}
                placeholder="—"
              />
            </Field>
            <Field label="Talla (cm)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={form.signosVitales.tallaCm}
                onChange={(e) => setSV("tallaCm", e.target.value)}
                placeholder="—"
              />
            </Field>
            <Field label="Temp (°C)">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={form.signosVitales.temperatura}
                onChange={(e) => setSV("temperatura", e.target.value)}
                placeholder="36.5"
              />
            </Field>
            <Field label="IMC (auto)">
              <Input value={imc != null ? imc.toString() : ""} readOnly />
            </Field>
          </div>
        </Section>

        <Section title="Exploración física">
          <Field label="Abdomen">
            <Textarea
              rows={3}
              value={form.exploracionFisica.abdomen}
              onChange={(e) => setEF("abdomen", e.target.value)}
              placeholder="Hallazgos del examen abdominal…"
            />
          </Field>
          <Field label="Exploración general" className="mt-4">
            <Textarea
              rows={3}
              value={form.exploracionFisica.general}
              onChange={(e) => setEF("general", e.target.value)}
              placeholder="Hallazgos generales relevantes…"
            />
          </Field>
        </Section>

        <Section title="Diagnósticos">
          <ChipsInput
            items={form.diagnosticos}
            onChange={(next) => set("diagnosticos", next)}
            placeholder="Agregar diagnóstico…"
          />
        </Section>

        <Section title="Procedimientos ordenados">
          <ChipsInput
            items={form.procedimientosOrdenados}
            onChange={(next) => set("procedimientosOrdenados", next)}
            placeholder="Agregar procedimiento…"
          />
        </Section>

        <Section title="Medicamentos recetados">
          <MedicamentosEditor
            items={form.medicamentosRecetados}
            onChange={(next) => set("medicamentosRecetados", next)}
          />
        </Section>

        <Section title="Plan / Tratamiento">
          <Textarea
            rows={3}
            value={form.planTratamiento}
            onChange={(e) => set("planTratamiento", e.target.value)}
            placeholder="Indicaciones, próximos pasos, ajustes terapéuticos…"
          />
        </Section>

        <Section title="Notas / Sugerencias adicionales">
          <Textarea
            rows={3}
            value={form.notasAdicionales}
            onChange={(e) => set("notasAdicionales", e.target.value)}
            placeholder="Próxima cita, observaciones, recordatorios…"
          />
        </Section>
      </div>
    </Modal>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}
