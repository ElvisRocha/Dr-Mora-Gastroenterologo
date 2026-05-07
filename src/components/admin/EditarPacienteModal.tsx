import { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  type MedicamentoMock,
  type PacienteMock,
  type ProcedimientoAsignadoMock,
} from "@/lib/mock";
import { usePaciente } from "@/store/expedienteStore";
import { cn } from "@/lib/cn";

type FormState = {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: PacienteMock["sexo"];
  email: string;
  tutorPrincipal: string;
  telefonoTutor: string;
  diagnosticosActivos: string[];
  medicamentosActivos: MedicamentoMock[];
  procedimientosAsignados: ProcedimientoAsignadoMock[];
};

function fromPaciente(p: PacienteMock): FormState {
  return {
    nombre: p.nombre,
    apellidoPaterno: p.apellidoPaterno,
    apellidoMaterno: p.apellidoMaterno ?? "",
    fechaNacimiento: p.fechaNacimiento,
    sexo: p.sexo,
    email: p.email ?? "",
    tutorPrincipal: p.tutorPrincipal,
    telefonoTutor: p.telefonoTutor,
    diagnosticosActivos: [...p.diagnosticosActivos],
    medicamentosActivos: p.medicamentosActivos
      ? p.medicamentosActivos.map((m) => ({ ...m }))
      : [],
    procedimientosAsignados: p.procedimientosAsignados
      ? p.procedimientosAsignados.map((m) => ({ ...m }))
      : [],
  };
}

export function EditarPacienteModal({
  pacienteId,
  open,
  onClose,
}: {
  pacienteId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { paciente, update } = usePaciente(pacienteId);
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    if (open && paciente) {
      setForm(fromPaciente(paciente));
    }
  }, [open, paciente]);

  if (!form || !paciente) return null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSave = () => {
    update({
      nombre: form.nombre.trim(),
      apellidoPaterno: form.apellidoPaterno.trim(),
      apellidoMaterno: form.apellidoMaterno.trim() || undefined,
      fechaNacimiento: form.fechaNacimiento,
      sexo: form.sexo,
      email: form.email.trim() || undefined,
      tutorPrincipal: form.tutorPrincipal.trim(),
      telefonoTutor: form.telefonoTutor.trim(),
      diagnosticosActivos: form.diagnosticosActivos,
      medicamentosActivos: form.medicamentosActivos,
      procedimientosAsignados: form.procedimientosAsignados,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar paciente"
      description="Actualiza identidad, contacto y datos clínicos en seguimiento."
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save size={14} strokeWidth={1.75} />
            Guardar cambios
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <Section title="Identidad">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre(s)" required>
              <Input
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
              />
            </Field>
            <Field label="Apellido paterno" required>
              <Input
                value={form.apellidoPaterno}
                onChange={(e) => set("apellidoPaterno", e.target.value)}
              />
            </Field>
            <Field label="Apellido materno">
              <Input
                value={form.apellidoMaterno}
                onChange={(e) => set("apellidoMaterno", e.target.value)}
              />
            </Field>
            <Field label="Fecha de nacimiento" required>
              <Input
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => set("fechaNacimiento", e.target.value)}
              />
            </Field>
            <Field label="Sexo" required>
              <Select
                value={form.sexo}
                onChange={(e) =>
                  set("sexo", e.target.value as FormState["sexo"])
                }
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </Select>
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Tutor principal">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" required>
              <Input
                value={form.tutorPrincipal}
                onChange={(e) => set("tutorPrincipal", e.target.value)}
              />
            </Field>
            <Field label="Teléfono" required>
              <Input
                type="tel"
                value={form.telefonoTutor}
                onChange={(e) => set("telefonoTutor", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Diagnósticos activos">
          <ChipsInput
            items={form.diagnosticosActivos}
            onChange={(next) => set("diagnosticosActivos", next)}
            placeholder="Agregar diagnóstico…"
          />
        </Section>

        <Section title="Medicamentos actuales">
          <MedicamentosEditor
            items={form.medicamentosActivos}
            onChange={(next) => set("medicamentosActivos", next)}
          />
        </Section>

        <Section title="Procedimientos asignados">
          <ProcedimientosEditor
            items={form.procedimientosAsignados}
            onChange={(next) => set("procedimientosAsignados", next)}
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

export function ChipsInput({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (items.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...items, v]);
    setDraft("");
  };

  const remove = (idx: number) =>
    onChange(items.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-muted-foreground">Sin elementos.</span>
        ) : (
          items.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-medium text-leaf"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-leaf/70 transition-colors hover:text-leaf"
                aria-label={`Quitar ${item}`}
              >
                <X size={12} strokeWidth={2} />
              </button>
            </span>
          ))
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" size="md" onClick={add}>
          <Plus size={14} strokeWidth={1.75} />
          Agregar
        </Button>
      </div>
    </div>
  );
}

export function MedicamentosEditor({
  items,
  onChange,
}: {
  items: MedicamentoMock[];
  onChange: (next: MedicamentoMock[]) => void;
}) {
  const [draft, setDraft] = useState<MedicamentoMock>({
    nombre: "",
    dosis: "",
    frecuencia: "",
  });

  const add = () => {
    if (!draft.nombre.trim() || !draft.dosis.trim()) return;
    onChange([
      ...items,
      {
        nombre: draft.nombre.trim(),
        dosis: draft.dosis.trim(),
        frecuencia: draft.frecuencia.trim() || "—",
      },
    ]);
    setDraft({ nombre: "", dosis: "", frecuencia: "" });
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div>
      {items.length > 0 ? (
        <ul className="mb-3 space-y-1.5">
          {items.map((m, idx) => (
            <li
              key={`${m.nombre}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <span className="font-medium text-foreground">{m.nombre}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {m.dosis} · {m.frecuencia}
                </span>
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-coral"
                aria-label={`Quitar ${m.nombre}`}
              >
                <X size={14} strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <Input
          placeholder="Medicamento"
          value={draft.nombre}
          onChange={(e) => setDraft((d) => ({ ...d, nombre: e.target.value }))}
        />
        <Input
          placeholder="Dosis"
          value={draft.dosis}
          onChange={(e) => setDraft((d) => ({ ...d, dosis: e.target.value }))}
        />
        <Input
          placeholder="Frecuencia"
          value={draft.frecuencia}
          onChange={(e) =>
            setDraft((d) => ({ ...d, frecuencia: e.target.value }))
          }
        />
        <Button type="button" variant="outline" size="md" onClick={add}>
          <Plus size={14} strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}

export function ProcedimientosEditor({
  items,
  onChange,
}: {
  items: ProcedimientoAsignadoMock[];
  onChange: (next: ProcedimientoAsignadoMock[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [estado, setEstado] = useState<"pendiente" | "realizado">("pendiente");

  const add = () => {
    if (!draft.trim()) return;
    onChange([
      ...items,
      {
        nombre: draft.trim(),
        estado,
        fecha: estado === "realizado" ? new Date().toISOString() : undefined,
      },
    ]);
    setDraft("");
    setEstado("pendiente");
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  const toggle = (idx: number) =>
    onChange(
      items.map((p, i) =>
        i === idx
          ? {
              ...p,
              estado: p.estado === "pendiente" ? "realizado" : "pendiente",
              fecha:
                p.estado === "pendiente" ? new Date().toISOString() : undefined,
            }
          : p,
      ),
    );

  return (
    <div>
      {items.length > 0 ? (
        <ul className="mb-3 space-y-1.5">
          {items.map((p, idx) => (
            <li
              key={`${p.nombre}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <span className="min-w-0 truncate text-foreground">
                {p.nombre}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors",
                    p.estado === "realizado"
                      ? "bg-leaf/15 text-leaf hover:bg-leaf/25"
                      : "bg-amber/15 text-amber hover:bg-amber/25",
                  )}
                >
                  {p.estado}
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-muted-foreground transition-colors hover:text-coral"
                  aria-label={`Quitar ${p.nombre}`}
                >
                  <X size={14} strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-[2fr_1fr_auto]">
        <Input
          placeholder="Procedimiento"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Select
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="realizado">Realizado</option>
        </Select>
        <Button type="button" variant="outline" size="md" onClick={add}>
          <Plus size={14} strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}
