import { useExpediente } from "@/store/expedienteStore";

export function ExpedienteHabitoDigestivo({
  pacienteId,
}: {
  pacienteId: string;
}) {
  const exp = useExpediente(pacienteId);
  const h = exp.habitoDigestivo;
  const a = exp.alimentacion;

  return (
    <div className="space-y-6">
      <Section title="Hábito digestivo">
        <Field label="Escala de Bristol">{h.bristolEscala || "—"}</Field>
        <Field label="Frecuencia / semana">
          {h.frecuenciaSemanal || "—"}
        </Field>
        <Field label="Dolor al defecar">{h.dolorDefecar ? "Sí" : "No"}</Field>
        <Field label="Sangrado">{h.sangrado ? "Sí" : "No"}</Field>
        <Field label="Distensión" full>
          {h.distension || "—"}
        </Field>
        <Field label="Reflujo / vómito" full>
          {h.reflujo || "—"}
        </Field>
      </Section>

      <Section title="Alimentación">
        <Field label="Comidas al día">{a.comidasPorDia || "—"}</Field>
        <Field label="Dieta especial">{a.dietaEspecial || "—"}</Field>
        <Field label="Alimentos preferidos" full>
          {a.alimentosPreferidos.length === 0
            ? "—"
            : a.alimentosPreferidos.join(", ")}
        </Field>
        <Field label="Alimentos rechazados" full>
          {a.alimentosRechazados.length === 0
            ? "—"
            : a.alimentosRechazados.join(", ")}
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
