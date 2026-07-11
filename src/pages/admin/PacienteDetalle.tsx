import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Baby,
  Calendar,
  ClipboardList,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Stethoscope,
  TrendingUp,
  User,
  Utensils,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatearEdad, TIPO_ID_LABEL } from "@/lib/mock";
import { usePaciente } from "@/store/expedienteStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ExpedienteResumen } from "@/components/admin/expediente/ExpedienteResumen";
import { ExpedienteAntecedentes } from "@/components/admin/expediente/ExpedienteAntecedentes";
import { ExpedientePerinatal } from "@/components/admin/expediente/ExpedientePerinatal";
import { ExpedienteNutricion } from "@/components/admin/expediente/ExpedienteNutricion";
import { ExpedienteCrecimiento } from "@/components/admin/expediente/ExpedienteCrecimiento";
import { ExpedienteConsultas } from "@/components/admin/expediente/ExpedienteConsultas";
import { ExpedienteCitas } from "@/components/admin/expediente/ExpedienteCitas";
import { EditarPacienteModal } from "@/components/admin/EditarPacienteModal";
import { ConsultaFormModal } from "@/components/admin/ConsultaFormModal";
import { HeaderConsultationTimer } from "@/components/admin/expediente/HeaderConsultationTimer";
import { LlenarFormularioButton } from "@/components/admin/LlenarFormularioButton";
import { ExpedienteOriginalModal } from "@/components/admin/ExpedienteOriginalModal";
import { SincronizarExpedienteButton } from "@/components/admin/SincronizarExpedienteButton";
import { PacienteAccionesMenu } from "@/components/admin/PacienteAccionesMenu";
import type { FormularioTipo } from "@/components/admin/FormularioPacienteModal";

type TabKey =
  | "resumen"
  | "antecedentes"
  | "perinatal"
  | "nutricion"
  | "crecimiento"
  | "consultas"
  | "citas";

const TABS: { key: TabKey; label: string; icon: typeof Calendar }[] = [
  { key: "resumen", label: "Resumen", icon: ClipboardList },
  { key: "antecedentes", label: "Antecedentes", icon: FileText },
  { key: "perinatal", label: "Perinatal y desarrollo", icon: Baby },
  { key: "nutricion", label: "Nutrición y digestivo", icon: Utensils },
  { key: "crecimiento", label: "Crecimiento", icon: TrendingUp },
  { key: "consultas", label: "Consultas", icon: Stethoscope },
  { key: "citas", label: "Citas", icon: Calendar },
];

export default function PacienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const { paciente } = usePaciente(id ?? "");
  const [tab, setTab] = useState<TabKey>("resumen");
  const [showEdit, setShowEdit] = useState(false);
  const [showNewConsulta, setShowNewConsulta] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [preferredForm, setPreferredForm] = useState<FormularioTipo | null>(null);

  if (!paciente) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/pacientes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Volver a pacientes
        </Link>
        <p className="text-muted-foreground">Paciente no encontrado.</p>
      </div>
    );
  }

  const sexoLabel = paciente.sexo === "femenino" ? "Femenino" : "Masculino";
  const initials = `${paciente.nombre.charAt(0)}${paciente.apellidoPaterno.charAt(0)}`;
  const fullName = `${paciente.nombre} ${paciente.apellidoPaterno}${
    paciente.apellidoMaterno ? ` ${paciente.apellidoMaterno}` : ""
  }`;
  const idText = paciente.identificacion
    ? `${TIPO_ID_LABEL[paciente.identificacion.tipo]}: ${paciente.identificacion.numero}`
    : null;
  const tutorText = paciente.tutorPrincipal
    ? `${paciente.tutorPrincipal}${paciente.tutorParentesco ? ` (${paciente.tutorParentesco})` : ""}`
    : null;

  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col gap-6">
      {/* El cronómetro se teletransporta al header mientras el expediente esté montado. */}
      <HeaderConsultationTimer />

      <Link
        to="/admin/pacientes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Volver a pacientes
      </Link>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Datos del paciente */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-navy/15 bg-gradient-to-br from-navy/10 to-leaf/10 font-display text-lg font-semibold text-navy">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold leading-tight text-navy">
                {fullName}
              </h1>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar size={14} strokeWidth={1.75} />
                Nacimiento:{" "}
                {format(new Date(paciente.fechaNacimiento), "dd/MM/yyyy", {
                  locale: es,
                })}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <Badge variant="navy">{formatearEdad(paciente.fechaNacimiento)}</Badge>
                <span className="text-sm text-muted-foreground">{sexoLabel}</span>
                {idText ? (
                  <span className="font-mono text-sm text-muted-foreground">
                    · {idText}
                  </span>
                ) : null}
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <a
                  href={`tel:${paciente.telefonoTutor.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1.5 hover:text-navy"
                >
                  <Phone size={13} strokeWidth={1.75} />
                  {paciente.telefonoTutor}
                </a>
                {paciente.email ? (
                  <a
                    href={`mailto:${paciente.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-navy"
                  >
                    <Mail size={13} strokeWidth={1.75} />
                    {paciente.email}
                  </a>
                ) : null}
                {paciente.direccion ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} strokeWidth={1.75} />
                    {paciente.direccion}
                  </span>
                ) : null}
                {tutorText ? (
                  <span className="inline-flex items-center gap-1.5">
                    <User size={13} strokeWidth={1.75} />
                    Responsable: {tutorText}
                  </span>
                ) : null}
              </div>
              {paciente.diagnosticosActivos.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {paciente.diagnosticosActivos.map((d) => (
                    <Badge key={d} variant="leaf">
                      {d}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Acciones del expediente */}
          <div className="flex flex-wrap items-center gap-2 lg:max-w-[600px] lg:justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowOriginal(true)}>
              <FileText size={14} strokeWidth={1.75} />
              Ver expediente original
            </Button>
            <SincronizarExpedienteButton paciente={paciente} />
            <LlenarFormularioButton
              paciente={paciente}
              preferred={preferredForm}
              onConsumePreferred={() => setPreferredForm(null)}
            />
            <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
              <Pencil size={14} strokeWidth={1.75} />
              Editar
            </Button>
            <PacienteAccionesMenu
              paciente={paciente}
              onReactivate={setPreferredForm}
              onVerOriginal={() => setShowOriginal(true)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          role="tablist"
          aria-label="Expediente"
          className="inline-flex w-auto min-w-full gap-1 rounded-xl bg-muted/50 p-1"
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-card text-navy shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* key por paciente: reinicia el estado local de cada pestaña al cambiar
          de expediente (borradores, listas por coma, etc.). */}
      <div key={paciente.id} className="animate-fade-up">
        {tab === "resumen" ? (
          <ExpedienteResumen pacienteId={paciente.id} />
        ) : null}
        {tab === "antecedentes" ? (
          <ExpedienteAntecedentes pacienteId={paciente.id} />
        ) : null}
        {tab === "perinatal" ? (
          <ExpedientePerinatal pacienteId={paciente.id} />
        ) : null}
        {tab === "nutricion" ? (
          <ExpedienteNutricion pacienteId={paciente.id} />
        ) : null}
        {tab === "crecimiento" ? (
          <ExpedienteCrecimiento pacienteId={paciente.id} />
        ) : null}
        {tab === "consultas" ? (
          <ExpedienteConsultas
            pacienteId={paciente.id}
            onNueva={() => setShowNewConsulta(true)}
          />
        ) : null}
        {tab === "citas" ? <ExpedienteCitas pacienteId={paciente.id} /> : null}
      </div>

      {/* Pie fijo del expediente. Cada pestaña editable (Antecedentes,
          Perinatal, Nutrición) teletransporta aquí su botón Guardar + estado
          de autoguardado. Vacío ⇒ oculto. */}
      <div
        id="expediente-footer-slot"
        className="sticky bottom-0 z-20 -mx-5 -mb-6 mt-auto flex items-center justify-end gap-3 border-t border-border bg-card/95 px-5 py-3 backdrop-blur-sm empty:hidden md:-mx-6 md:-mb-8 md:px-6"
      />

      <EditarPacienteModal
        pacienteId={paciente.id}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />

      <ExpedienteOriginalModal
        pacienteId={paciente.id}
        open={showOriginal}
        onClose={() => setShowOriginal(false)}
      />

      <ConsultaFormModal
        pacienteId={paciente.id}
        open={showNewConsulta}
        onClose={() => setShowNewConsulta(false)}
      />
    </div>
  );
}
