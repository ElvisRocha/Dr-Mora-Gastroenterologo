import { useExpediente } from "@/store/expedienteStore";

export function ExpedienteAntecedentes({ pacienteId }: { pacienteId: string }) {
  const exp = useExpediente(pacienteId);
  const a = exp.antecedentes;

  return (
    <div className="space-y-6">
      <Section title="Antecedentes generales">
        <Field label="Familiares">{a.familiares || "—"}</Field>
        <Field label="Alergias">{a.alergias || "—"}</Field>
        <Field label="Cirugías">{a.cirugias || "—"}</Field>
        <Field label="Hospitalizaciones">{a.hospitalizaciones || "—"}</Field>
      </Section>

      <Section title="Antecedentes perinatales">
        <Field label="Tipo de parto">
          {a.perinatales.tipoParto === "vaginal"
            ? "Vaginal"
            : a.perinatales.tipoParto === "cesarea"
              ? "Cesárea"
              : "—"}
        </Field>
        <Field label="Peso al nacer">
          {a.perinatales.pesoNacerKg ? `${a.perinatales.pesoNacerKg} kg` : "—"}
        </Field>
        <Field label="Talla al nacer">
          {a.perinatales.tallaNacerCm ? `${a.perinatales.tallaNacerCm} cm` : "—"}
        </Field>
        <Field label="Semanas de gestación">
          {a.perinatales.semanasGestacion || "—"}
        </Field>
        <Field label="Lactancia" full>
          {a.perinatales.lactancia || "—"}
        </Field>
      </Section>
    </div>
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
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}
