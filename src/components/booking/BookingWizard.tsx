import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { StepServicio } from "./StepServicio";
import { StepFechaHora } from "./StepFechaHora";
import { StepDatos } from "./StepDatos";
import { StepConfirmacion } from "./StepConfirmacion";
import { bookingSchema, type BookingPayload } from "@/lib/schemas/bookingSchema";
import { useAgendarCita } from "@/hooks/useAgendarCita";

type WizardData = Partial<Omit<BookingPayload, "tutor" | "paciente">> & {
  tutor?: Partial<BookingPayload["tutor"]>;
  paciente?: Partial<BookingPayload["paciente"]>;
};

const STEPS = 4;

export function BookingWizard() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({});
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);
  const agendarMutation = useAgendarCita();

  const update = (patch: WizardData) => setData((prev) => ({ ...prev, ...patch }));

  const canContinue = (() => {
    if (step === 0) return Boolean(data.servicioSlug);
    if (step === 1) return Boolean(data.fecha && data.hora);
    if (step === 2) {
      const t1 = data.tutor;
      const p = data.paciente;
      return Boolean(
        t1?.nombre &&
          t1.apellidos &&
          t1.telefono &&
          t1.email &&
          t1.relacion &&
          p?.nombre &&
          p.apellidoPaterno &&
          p.fechaNacimiento &&
          p.sexo,
      );
    }
    return true;
  })();

  const submit = async () => {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? t.booking.error;
      toast.error(firstError);
      return;
    }
    try {
      const res = await agendarMutation.mutateAsync(parsed.data);
      setSubmitted({ id: res.cita_id });
      toast.success(t.booking.exito);
    } catch {
      toast.error(t.booking.error);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf/15 text-leaf">
          <Check size={26} strokeWidth={1.8} />
        </div>
        <h2 className="mt-6 font-display text-2xl font-semibold text-navy">
          {t.booking.exito}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          ID:{" "}
          <span className="font-mono text-xs text-foreground">{submitted.id}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
      <Stepper current={step} labels={t.booking.pasos} />

      <div className="mt-10">
        {step === 0 ? (
          <StepServicio value={data.servicioSlug} onChange={(s) => update({ servicioSlug: s })} />
        ) : null}
        {step === 1 ? (
          <StepFechaHora
            servicioSlug={data.servicioSlug ?? null}
            fecha={data.fecha ?? null}
            hora={data.hora ?? null}
            onChange={(patch) => update(patch)}
          />
        ) : null}
        {step === 2 ? (
          <StepDatos
            data={data}
            onChange={(patch) =>
              update({
                tutor: { ...data.tutor, ...(patch.tutor ?? {}) },
                paciente: { ...data.paciente, ...(patch.paciente ?? {}) },
                motivo: patch.motivo ?? data.motivo,
              })
            }
          />
        ) : null}
        {step === 3 ? <StepConfirmacion data={data} /> : null}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || agendarMutation.isPending}
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
          {t.booking.atras}
        </Button>
        {step < STEPS - 1 ? (
          <Button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS - 1, s + 1))}
            disabled={!canContinue}
          >
            {t.booking.siguiente}
            <ChevronRight size={16} strokeWidth={1.75} />
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={agendarMutation.isPending}>
            {agendarMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} strokeWidth={1.8} />
            )}
            {t.booking.confirmar}
          </Button>
        )}
      </div>
    </div>
  );
}

function Stepper({ current, labels }: { current: number; labels: string[] }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto sm:gap-3">
      {labels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done && "border-leaf bg-leaf text-offblack",
                active && "border-navy bg-navy text-offwhite",
                !done && !active && "border-border bg-card text-muted-foreground",
              )}
            >
              {done ? <Check size={14} strokeWidth={2.2} /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < labels.length - 1 ? (
              <div className="h-px flex-1 bg-border" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
