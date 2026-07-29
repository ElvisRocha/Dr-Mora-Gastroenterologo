import {
  Activity,
  ArrowLeft,
  Baby,
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  Heart,
  HeartPulse,
  Microscope,
  Pencil,
  Pill,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLang } from "@/contexts/LanguageContext";
import type {
  ConsultaMock,
  HabitosConsultaMock,
  TipoConsulta,
} from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConsultaArchivosSection } from "./ConsultaArchivosSection";
import { ConsultaNotasSection } from "./ConsultaNotasSection";

const TIPO_LABEL: Record<TipoConsulta, string> = {
  general: "Consulta general",
  nino_sano: "Control de niño sano",
  seguimiento: "Seguimiento",
  endoscopia: "Endoscopía / procedimiento",
};

const HABITOS_LABEL: { key: keyof HabitosConsultaMock; label: string }[] = [
  { key: "alimentacion", label: "Alimentación / dieta" },
  { key: "sueno", label: "Sueño" },
  { key: "actividadFisica", label: "Actividad física y juego" },
  { key: "pantallas", label: "Tiempo de pantalla" },
  { key: "habitoIntestinal", label: "Hábito intestinal" },
  { key: "hidratacion", label: "Hidratación" },
  { key: "tabacoVapeo", label: "Tabaco / vapeo" },
  { key: "alcohol", label: "Alcohol" },
  { key: "cafeina", label: "Cafeína / bebidas energéticas" },
];

export function ConsultaDetalle({
  consulta,
  onBack,
  onEdit,
}: {
  consulta: ConsultaMock;
  onBack: () => void;
  onEdit: () => void;
}) {
  const { t } = useLang();
  const servicio = t.servicios.items.find(
    (s) => s.slug === consulta.servicioSlug,
  );
  const sv = consulta.signosVitales;
  const ef = consulta.exploracionFisica;
  const tieneSV =
    !!sv &&
    (sv.pa || sv.fc || sv.fr || sv.satO2 || sv.pesoKg || sv.tallaCm ||
      sv.temperatura || sv.perimetroCefalicoCm || sv.percentilPeso);
  const tieneEF =
    !!ef &&
    (ef.general || ef.orofaringe || ef.cardiopulmonar || ef.abdomen ||
      ef.piel || ef.neurologico);
  const habitos = consulta.habitos;
  const habitosVisibles = habitos
    ? HABITOS_LABEL.filter(
        ({ key }) =>
          habitos[key].tiene !== null || habitos[key].notas.trim() !== "",
      )
    : [];
  const endo = consulta.endoscopia;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Volver al historial
        </button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil size={14} strokeWidth={1.75} />
          Editar consulta
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} strokeWidth={1.75} />
            <span className="capitalize">
              {format(new Date(consulta.fecha), "EEEE dd 'de' MMMM yyyy", {
                locale: es,
              })}
            </span>
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} strokeWidth={1.75} />
            {format(new Date(consulta.fecha), "HH:mm", { locale: es })}
          </span>
          <Badge variant="navy" className="ml-1">
            {servicio?.nombre ?? consulta.servicioSlug}
          </Badge>
          {consulta.tipoConsulta ? (
            <Badge variant="teal">{TIPO_LABEL[consulta.tipoConsulta]}</Badge>
          ) : null}
        </div>
        {consulta.motivo ? (
          <p className="mt-3 text-base font-medium text-foreground">
            {consulta.motivo}
          </p>
        ) : null}
        {consulta.acompanante ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Acompaña: {consulta.acompanante}
          </p>
        ) : null}
      </div>

      {(consulta.enfermedadActual || consulta.resultadosLaboratorio) && (
        <Card icon={<FileText size={16} strokeWidth={1.75} />} title="Anamnesis">
          {consulta.enfermedadActual ? (
            <Field label="Enfermedad actual">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {consulta.enfermedadActual}
              </p>
            </Field>
          ) : null}
          {consulta.resultadosLaboratorio ? (
            <Field label="Resultados de laboratorio" className="mt-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {consulta.resultadosLaboratorio}
              </p>
            </Field>
          ) : null}
        </Card>
      )}

      {consulta.tipoConsulta === "nino_sano" &&
      (consulta.desarrolloNotas ||
        consulta.alimentacionNotas ||
        consulta.tamizajesNotas) ? (
        <Card icon={<Baby size={16} strokeWidth={1.75} />} title="Crecimiento y desarrollo">
          {consulta.desarrolloNotas ? (
            <Field label="Desarrollo psicomotor">
              <Prose text={consulta.desarrolloNotas} />
            </Field>
          ) : null}
          {consulta.alimentacionNotas ? (
            <Field label="Alimentación actual" className="mt-4">
              <Prose text={consulta.alimentacionNotas} />
            </Field>
          ) : null}
          {consulta.tamizajesNotas ? (
            <Field label="Tamizajes y vacunas" className="mt-4">
              <Prose text={consulta.tamizajesNotas} />
            </Field>
          ) : null}
        </Card>
      ) : null}

      {consulta.tipoConsulta === "seguimiento" &&
      (consulta.evolucionNotas || consulta.adherenciaNotas) ? (
        <Card icon={<Activity size={16} strokeWidth={1.75} />} title="Seguimiento">
          {consulta.evolucionNotas ? (
            <Field label="Evolución desde la última consulta">
              <Prose text={consulta.evolucionNotas} />
            </Field>
          ) : null}
          {consulta.adherenciaNotas ? (
            <Field label="Adherencia al tratamiento" className="mt-4">
              <Prose text={consulta.adherenciaNotas} />
            </Field>
          ) : null}
        </Card>
      ) : null}

      {endo &&
      Object.values(endo).some((v) => v) ? (
        <Card icon={<Microscope size={16} strokeWidth={1.75} />} title="Hallazgos endoscópicos">
          {endo.indicacion ? (
            <Field label="Indicación">
              <Prose text={endo.indicacion} />
            </Field>
          ) : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {endo.esofago ? (
              <Field label="Esófago">
                <Prose text={endo.esofago} />
              </Field>
            ) : null}
            {endo.estomago ? (
              <Field label="Estómago">
                <Prose text={endo.estomago} />
              </Field>
            ) : null}
            {endo.duodeno ? (
              <Field label="Duodeno">
                <Prose text={endo.duodeno} />
              </Field>
            ) : null}
            {endo.colonIleon ? (
              <Field label="Colon / Íleon">
                <Prose text={endo.colonIleon} />
              </Field>
            ) : null}
          </div>
          {endo.biopsias ? (
            <Field label="Biopsias" className="mt-4">
              <Prose text={endo.biopsias} />
            </Field>
          ) : null}
          {endo.impresion ? (
            <Field label="Impresión endoscópica" className="mt-4">
              <Prose text={endo.impresion} />
            </Field>
          ) : null}
          {endo.sedacionTolerancia ? (
            <Field label="Sedación y tolerancia" className="mt-4">
              <Prose text={endo.sedacionTolerancia} />
            </Field>
          ) : null}
        </Card>
      ) : null}

      {habitosVisibles.length > 0 && habitos ? (
        <Card icon={<HeartPulse size={16} strokeWidth={1.75} />} title="Hábitos">
          <div className="grid gap-3 sm:grid-cols-2">
            {habitosVisibles.map(({ key, label }) => {
              const e = habitos[key];
              return (
                <div
                  key={key}
                  className="rounded-xl border border-border bg-muted/20 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                    {e.tiene !== null ? (
                      <Badge variant={e.tiene ? "leaf" : "neutral"}>
                        {e.tiene ? "Sí" : "No"}
                      </Badge>
                    ) : null}
                  </div>
                  {e.notas.trim() ? (
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                      {e.notas}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {tieneSV ? (
        <Card
          icon={<Heart size={16} strokeWidth={1.75} />}
          title="Signos vitales y antropometría"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="PA" value={sv?.pa} />
            <Stat label="FC" value={sv?.fc} />
            <Stat label="FR" value={sv?.fr} />
            <Stat label="SatO₂" value={sv?.satO2} />
            <Stat
              label="Temp."
              value={sv?.temperatura != null ? `${sv.temperatura}°C` : undefined}
            />
            <Stat
              label="Peso"
              value={sv?.pesoKg != null ? `${sv.pesoKg} kg` : undefined}
            />
            <Stat
              label="Talla"
              value={sv?.tallaCm != null ? `${sv.tallaCm} cm` : undefined}
            />
            <Stat
              label="P. cefálico"
              value={
                sv?.perimetroCefalicoCm != null
                  ? `${sv.perimetroCefalicoCm} cm`
                  : undefined
              }
            />
            <Stat
              label="IMC"
              value={sv?.imc != null ? sv.imc.toString() : undefined}
            />
            <Stat label="Percentil" value={sv?.percentilPeso} />
          </div>
        </Card>
      ) : null}

      {tieneEF ? (
        <Card
          icon={<Activity size={16} strokeWidth={1.75} />}
          title="Exploración física"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {ef?.general ? (
              <Field label="General">
                <Prose text={ef.general} />
              </Field>
            ) : null}
            {ef?.orofaringe ? (
              <Field label="Orofaringe / cuello">
                <Prose text={ef.orofaringe} />
              </Field>
            ) : null}
            {ef?.cardiopulmonar ? (
              <Field label="Cardiopulmonar">
                <Prose text={ef.cardiopulmonar} />
              </Field>
            ) : null}
            {ef?.abdomen ? (
              <Field label="Abdomen">
                <Prose text={ef.abdomen} />
              </Field>
            ) : null}
            {ef?.piel ? (
              <Field label="Piel">
                <Prose text={ef.piel} />
              </Field>
            ) : null}
            {ef?.neurologico ? (
              <Field label="Neurológico">
                <Prose text={ef.neurologico} />
              </Field>
            ) : null}
          </div>
        </Card>
      ) : null}

      <Card
        icon={<ClipboardList size={16} strokeWidth={1.75} />}
        title="Plan clínico"
      >
        {consulta.diagnosticos.length > 0 ? (
          <Field label="Diagnósticos">
            <div className="mt-1 flex flex-wrap gap-1.5">
              {consulta.diagnosticos.map((d) => (
                <Badge key={d} variant="leaf">
                  {d}
                </Badge>
              ))}
            </div>
          </Field>
        ) : null}
        {consulta.procedimientosOrdenados.length > 0 ? (
          <Field label="Procedimientos ordenados" className="mt-4">
            <ul className="list-inside list-disc text-sm text-foreground">
              {consulta.procedimientosOrdenados.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Field>
        ) : null}
        {consulta.medicamentosRecetados.length > 0 ? (
          <Field label="Medicamentos recetados" className="mt-4">
            <ul className="space-y-1.5 text-sm text-foreground">
              {consulta.medicamentosRecetados.map((m, i) => (
                <li
                  key={`${m.nombre}-${i}`}
                  className="flex flex-wrap items-baseline gap-x-3"
                >
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Pill
                      size={12}
                      strokeWidth={1.75}
                      className="text-navy"
                    />
                    {m.nombre}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {m.dosis} · {m.frecuencia}
                  </span>
                </li>
              ))}
            </ul>
          </Field>
        ) : null}
        {consulta.planTratamiento ? (
          <Field label="Plan / Tratamiento" className="mt-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {consulta.planTratamiento}
            </p>
          </Field>
        ) : null}
        {consulta.notasAdicionales ? (
          <Field label="Notas adicionales" className="mt-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {consulta.notasAdicionales}
            </p>
          </Field>
        ) : null}
      </Card>

      <Card
        icon={<Stethoscope size={16} strokeWidth={1.75} />}
        title="Bitácora de notas"
      >
        <ConsultaNotasSection consultaId={consulta.id} />
      </Card>

      <Card icon={<FileText size={16} strokeWidth={1.75} />} title="Archivos">
        <ConsultaArchivosSection consultaId={consulta.id} />
      </Card>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/10 text-navy">
          {icon}
        </span>
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Prose({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
      {text}
    </p>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-foreground">
        {value ?? "—"}
      </p>
    </div>
  );
}
