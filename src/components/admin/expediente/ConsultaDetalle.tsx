import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  Heart,
  Pencil,
  Pill,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLang } from "@/contexts/LanguageContext";
import type { ConsultaMock } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConsultaArchivosSection } from "./ConsultaArchivosSection";
import { ConsultaNotasSection } from "./ConsultaNotasSection";

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
    !!sv && (sv.pa || sv.fc || sv.pesoKg || sv.tallaCm || sv.temperatura);
  const tieneEF = !!ef && (ef.abdomen || ef.general);

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

      {tieneSV ? (
        <Card
          icon={<Heart size={16} strokeWidth={1.75} />}
          title="Signos vitales"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat label="PA" value={sv?.pa} />
            <Stat label="FC" value={sv?.fc} />
            <Stat
              label="Peso"
              value={sv?.pesoKg != null ? `${sv.pesoKg} kg` : undefined}
            />
            <Stat
              label="Talla"
              value={sv?.tallaCm != null ? `${sv.tallaCm} cm` : undefined}
            />
            <Stat
              label="Temp."
              value={sv?.temperatura != null ? `${sv.temperatura}°C` : undefined}
            />
            <Stat
              label="IMC"
              value={sv?.imc != null ? sv.imc.toString() : undefined}
            />
          </div>
        </Card>
      ) : null}

      {tieneEF ? (
        <Card
          icon={<Activity size={16} strokeWidth={1.75} />}
          title="Exploración física"
        >
          {ef?.abdomen ? (
            <Field label="Abdomen">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {ef.abdomen}
              </p>
            </Field>
          ) : null}
          {ef?.general ? (
            <Field label="Exploración general" className="mt-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {ef.general}
              </p>
            </Field>
          ) : null}
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
