import { useState } from "react";
import {
  Check,
  Loader2,
  Pencil,
  UserCheck,
  Users,
} from "lucide-react";
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
import { useClinic, type CitaFull } from "@/store/clinicStore";

type WizardData = Partial<Omit<BookingPayload, "tutor" | "paciente">> & {
  tutor?: Partial<BookingPayload["tutor"]>;
  paciente?: Partial<BookingPayload["paciente"]>;
};

export function BookingWizard() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [data, setData] = useState<WizardData>({});
  const [esMayorDeEdad, setEsMayorDeEdad] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);
  const agendarMutation = useAgendarCita();
  const { addCita, addNotificacion, servicios } = useClinic();

  const isMinor = esMayorDeEdad === false;
  const totalSteps = isMinor ? 5 : 4;
  const idxFechaHora = isMinor ? 3 : 2;
  const idxConfirmar = isMinor ? 4 : 3;
  const labels = isMinor ? t.booking.pasosMenor : t.booking.pasos;

  const update = (patch: WizardData) =>
    setData((prev) => ({
      ...prev,
      ...patch,
      tutor: { ...prev.tutor, ...(patch.tutor ?? {}) },
      paciente: { ...prev.paciente, ...(patch.paciente ?? {}) },
    }));

  const handleAnswer = (answer: boolean) => {
    setEsMayorDeEdad(answer);
    if (answer) {
      setData((prev) => ({
        ...prev,
        tutor: { ...prev.tutor, relacion: "paciente" },
      }));
    } else {
      setData((prev) =>
        prev.tutor?.relacion === "paciente"
          ? { ...prev, tutor: { ...prev.tutor, relacion: undefined } }
          : prev,
      );
    }
  };

  const resetAnswer = () => setEsMayorDeEdad(null);

  const goNext = () => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step],
    );
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  };

  const goBack = () => {
    const newStep = Math.max(0, step - 1);
    setCompletedSteps((prev) => prev.filter((i) => i < newStep));
    setStep(newStep);
  };

  const handleStepClick = (target: number) => {
    if (target === step) return;
    const maxCompleted =
      completedSteps.length > 0 ? Math.max(...completedSteps) : -1;
    if (target > maxCompleted + 1) return;
    if (target < step) {
      setCompletedSteps((prev) => prev.filter((i) => i < target));
    }
    setStep(target);
  };

  const canContinue = (() => {
    if (step === 0) return Boolean(data.servicioSlug);
    if (step === 1) {
      if (esMayorDeEdad === null) return false;
      const tutor = data.tutor;
      const paciente = data.paciente;
      if (esMayorDeEdad === true) {
        return Boolean(
          paciente?.nombre &&
            paciente.apellidoPaterno &&
            paciente.fechaNacimiento &&
            paciente.sexo &&
            tutor?.telefono &&
            tutor.email,
        );
      }
      return Boolean(
        tutor?.relacion &&
          tutor.relacion !== "paciente" &&
          tutor.nombre &&
          tutor.apellidos &&
          tutor.telefono &&
          tutor.email,
      );
    }
    if (step === 2 && isMinor) {
      const paciente = data.paciente;
      return Boolean(
        paciente?.nombre &&
          paciente.apellidoPaterno &&
          paciente.fechaNacimiento &&
          paciente.sexo,
      );
    }
    if (step === idxFechaHora) return Boolean(data.fecha && data.hora);
    return true;
  })();

  const buildPayload = (): WizardData => {
    if (esMayorDeEdad === true) {
      const paciente = data.paciente ?? {};
      const apellidos = [paciente.apellidoPaterno, paciente.apellidoMaterno]
        .filter(Boolean)
        .join(" ")
        .trim();
      return {
        ...data,
        esMayorDeEdad: true,
        tutor: {
          ...(data.tutor ?? {}),
          relacion: "paciente",
          nombre: paciente.nombre,
          apellidos,
        },
      };
    }
    return { ...data, esMayorDeEdad: !!esMayorDeEdad };
  };

  const submit = async () => {
    const finalPayload = buildPayload();
    const parsed = bookingSchema.safeParse(finalPayload);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? t.booking.error;
      toast.error(firstError);
      return;
    }
    try {
      await agendarMutation.mutateAsync(parsed.data);
      const referenceCode = `GK-${Math.floor(10000 + Math.random() * 90000)}`;
      const p = parsed.data;
      const svc = servicios.find((s) => s.id === p.servicioSlug);
      const pacienteNombre = `${p.paciente.nombre} ${p.paciente.apellidoPaterno}`.trim();
      const tutorNombre = p.esMayorDeEdad
        ? pacienteNombre
        : `${p.tutor.nombre} ${p.tutor.apellidos}`.trim();
      const [h, m] = (p.hora ?? "09:00").split(":").map(Number);
      const fechaHora = new Date(p.fecha);
      fechaHora.setHours(h, m ?? 0, 0, 0);

      const cita: CitaFull = {
        id: `c-web-${Date.now()}`,
        pacienteId: `web-${Date.now()}`,
        pacienteNombre,
        tutorNombre,
        servicioSlug: p.servicioSlug,
        fechaHora: fechaHora.toISOString(),
        duracionMin: svc?.duracionMin ?? 60,
        estado: "agendada",
        source: "web",
        referenceCode,
        monto: svc?.precio,
        notas: p.motivo,
      };
      addCita(cita);
      addNotificacion({
        id: `n-${Date.now()}`,
        tipo: "cita_agendada",
        titulo: "Nueva cita desde el sitio web",
        mensaje: `${pacienteNombre} agendó ${svc?.nombre ?? "una consulta"}. Código ${referenceCode}.`,
        leida: false,
        fecha: new Date().toISOString(),
        vista: "calendario",
      });
      setSubmitted({ id: referenceCode });
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
          Guarda tu código de cita para reprogramar o cancelar:
        </p>
        <p className="mt-3 inline-block rounded-xl border border-border bg-muted/40 px-5 py-2 font-mono text-lg font-semibold tracking-wider text-navy">
          {submitted.id}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Stepper
        current={step}
        labels={labels}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div
        key={`step-${step}-${esMayorDeEdad}`}
        className="animate-fade-up"
      >
        {step === 0 ? (
          <div className="mx-auto max-w-3xl space-y-8">
            <StepHeader
              title={t.booking.seleccionarServicio}
              subtitle={t.servicios.subtitle}
            />
            <StepServicio
              value={data.servicioSlug}
              onChange={(s) => update({ servicioSlug: s })}
            />
          </div>
        ) : null}

        {step === 1 ? (
          esMayorDeEdad === null ? (
            <PreguntaMayor onSelect={handleAnswer} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              <StepHeader
                title={
                  esMayorDeEdad ? t.booking.datosPaciente : t.booking.datosTutor
                }
              />
              <AnswerBanner
                isAdult={esMayorDeEdad === true}
                onChange={resetAnswer}
              />
              <StepDatos
                mode={esMayorDeEdad === true ? "adulto" : "tutor"}
                data={data}
                onChange={(patch) => update(patch)}
              />
            </div>
          )
        ) : null}

        {step === 2 && isMinor ? (
          <div className="mx-auto max-w-3xl space-y-6">
            <StepHeader title={t.booking.datosPaciente} />
            <StepDatos
              mode="paciente"
              data={data}
              onChange={(patch) => update(patch)}
            />
          </div>
        ) : null}

        {step === idxFechaHora ? (
          <div className="mx-auto max-w-4xl space-y-8">
            <StepHeader title={t.booking.seleccionarFecha} />
            <StepFechaHora
              servicioSlug={data.servicioSlug ?? null}
              fecha={data.fecha ?? null}
              hora={data.hora ?? null}
              onChange={(patch) => update(patch)}
            />
          </div>
        ) : null}

        {step === idxConfirmar ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <StepHeader title={t.booking.revisar} />
            <StepConfirmacion data={data} esMayorDeEdad={!!esMayorDeEdad} />
          </div>
        ) : null}
      </div>

      <div className="mx-auto flex max-w-3xl gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={goBack}
          disabled={step === 0 || agendarMutation.isPending}
        >
          {t.booking.atras}
        </Button>
        {step < totalSteps - 1 ? (
          <Button
            type="button"
            size="lg"
            className="flex-1"
            onClick={goNext}
            disabled={!canContinue}
          >
            {t.booking.siguiente}
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className="flex-1"
            onClick={submit}
            disabled={agendarMutation.isPending}
          >
            {agendarMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t.booking.confirmar}
              </>
            ) : (
              t.booking.confirmar
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function StepHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-semibold text-navy md:text-[1.75rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

function PreguntaMayor({ onSelect }: { onSelect: (answer: boolean) => void }) {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-2xl text-center">
      <StepHeader
        title={t.booking.preguntaMayorTitulo}
        subtitle={t.booking.preguntaMayorAyuda}
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect(true)}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 ease-gentle hover:-translate-y-0.5 hover:border-navy/40 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
            <UserCheck size={20} strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold text-foreground">
            {t.booking.siMayor}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelect(false)}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 ease-gentle hover:-translate-y-0.5 hover:border-leaf/50 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
            <Users size={20} strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold text-foreground">
            {t.booking.noMenor}
          </span>
        </button>
      </div>
    </div>
  );
}

function AnswerBanner({
  isAdult,
  onChange,
}: {
  isAdult: boolean;
  onChange: () => void;
}) {
  const { t } = useLang();
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isAdult ? "bg-navy/10 text-navy" : "bg-leaf/15 text-leaf",
          )}
        >
          {isAdult ? (
            <UserCheck size={16} strokeWidth={1.75} />
          ) : (
            <Users size={16} strokeWidth={1.75} />
          )}
        </span>
        <span className="text-sm font-medium text-foreground">
          {isAdult ? t.booking.respuestaMayor : t.booking.respuestaMenor}
        </span>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-navy underline-offset-4 hover:underline"
      >
        <Pencil size={12} strokeWidth={1.75} />
        {t.booking.cambiarRespuesta}
      </button>
    </div>
  );
}

function Stepper({
  current,
  labels,
  completedSteps,
  onStepClick,
}: {
  current: number;
  labels: string[];
  completedSteps: number[];
  onStepClick: (i: number) => void;
}) {
  const maxCompleted =
    completedSteps.length > 0 ? Math.max(...completedSteps) : -1;
  const widthClass = labels.length > 4 ? "max-w-4xl" : "max-w-2xl";

  return (
    <div className={cn("mx-auto flex items-start px-2", widthClass)}>
      {labels.map((label, i) => {
        const isActive = current === i;
        const isComplete = completedSteps.includes(i) && !isActive;
        const isAccessible = i <= maxCompleted + 1;
        const isClickable = isAccessible && !isActive;

        return (
          <div
            key={label}
            className={cn(
              "flex items-start",
              i < labels.length - 1 ? "flex-1" : "",
            )}
          >
            <button
              type="button"
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isAccessible}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "group flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isClickable ? "cursor-pointer" : "",
                !isAccessible ? "cursor-not-allowed" : "",
                isActive ? "cursor-default" : "",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                  isComplete && "bg-navy text-offwhite",
                  isActive &&
                    "border-2 border-navy bg-card text-navy shadow-soft",
                  !isComplete &&
                    !isActive &&
                    isAccessible &&
                    "border-2 border-navy/40 bg-card text-navy/60",
                  !isComplete &&
                    !isActive &&
                    !isAccessible &&
                    "border-2 border-border bg-card text-muted-foreground",
                  isClickable && "group-hover:scale-110 group-hover:shadow-md",
                )}
              >
                {isComplete ? <Check size={18} strokeWidth={2.2} /> : i + 1}
              </div>
              <span
                className={cn(
                  "mt-2 hidden text-xs font-medium transition-colors duration-200 sm:block",
                  isActive
                    ? "font-semibold text-foreground"
                    : isComplete || isAccessible
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>

            {i < labels.length - 1 ? (
              <div
                className={cn(
                  "mx-2 mt-5 h-0.5 flex-1 transition-colors duration-300",
                  completedSteps.includes(i) ? "bg-navy" : "bg-muted",
                )}
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
