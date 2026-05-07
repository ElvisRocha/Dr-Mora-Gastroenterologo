import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Calendar,
  ClipboardList,
  FileText,
  Mail,
  Pencil,
  Phone,
  Plus,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatearEdad } from "@/lib/mock";
import { usePaciente } from "@/store/expedienteStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ExpedienteResumen } from "@/components/admin/expediente/ExpedienteResumen";
import { ExpedienteAntecedentes } from "@/components/admin/expediente/ExpedienteAntecedentes";
import { ExpedienteCrecimiento } from "@/components/admin/expediente/ExpedienteCrecimiento";
import { ExpedienteHabitoDigestivo } from "@/components/admin/expediente/ExpedienteHabitoDigestivo";
import { ExpedienteConsultas } from "@/components/admin/expediente/ExpedienteConsultas";
import { ExpedienteCitas } from "@/components/admin/expediente/ExpedienteCitas";
import { EditarPacienteModal } from "@/components/admin/EditarPacienteModal";
import { ConsultaFormModal } from "@/components/admin/ConsultaFormModal";

type TabKey =
  | "resumen"
  | "antecedentes"
  | "crecimiento"
  | "habito"
  | "consultas"
  | "citas";

const TABS: { key: TabKey; label: string; icon: typeof Calendar }[] = [
  { key: "resumen", label: "Resumen", icon: ClipboardList },
  { key: "antecedentes", label: "Antecedentes", icon: FileText },
  { key: "crecimiento", label: "Crecimiento", icon: TrendingUp },
  { key: "habito", label: "Hábito digestivo", icon: Activity },
  { key: "consultas", label: "Consultas", icon: FileText },
  { key: "citas", label: "Citas", icon: Calendar },
];

export default function PacienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const { paciente } = usePaciente(id ?? "");
  const [tab, setTab] = useState<TabKey>("resumen");
  const [showEdit, setShowEdit] = useState(false);
  const [showNewConsulta, setShowNewConsulta] = useState(false);

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

  const sexoLabel =
    paciente.sexo === "femenino" ? "Femenino" : "Masculino";

  return (
    <div className="space-y-6">
      <Link
        to="/admin/pacientes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Volver a pacientes
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy/10 to-leaf/10 font-display text-2xl font-semibold text-navy">
            {paciente.nombre.charAt(0)}
            {paciente.apellidoPaterno.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold text-navy">
              {paciente.nombre} {paciente.apellidoPaterno}{" "}
              {paciente.apellidoMaterno ?? ""}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{formatearEdad(paciente.fechaNacimiento)}</span>
              <span>·</span>
              <span>{sexoLabel}</span>
              <span>·</span>
              <span className="capitalize">
                Nacimiento{" "}
                {format(new Date(paciente.fechaNacimiento), "dd MMM yyyy", {
                  locale: es,
                })}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Phone size={12} strokeWidth={1.75} />
                <a
                  href={`tel:${paciente.telefonoTutor.replace(/\s/g, "")}`}
                  className="text-navy hover:underline"
                >
                  {paciente.telefonoTutor}
                </a>
              </span>
              {paciente.email ? (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Mail size={12} strokeWidth={1.75} />
                  <a
                    href={`mailto:${paciente.email}`}
                    className="text-navy hover:underline"
                  >
                    {paciente.email}
                  </a>
                </span>
              ) : null}
              <span className="text-muted-foreground">
                Tutor: {paciente.tutorPrincipal}
              </span>
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

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowEdit(true)}>
            <Pencil size={14} strokeWidth={1.75} />
            Editar
          </Button>
          <Button onClick={() => setShowNewConsulta(true)}>
            <Plus size={14} strokeWidth={1.75} />
            Nueva consulta
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          role="tablist"
          aria-label="Expediente"
          className="inline-flex w-auto min-w-full gap-1 rounded-xl bg-muted/50 p-1 sm:w-full"
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

      <div className="animate-fade-up">
        {tab === "resumen" ? (
          <ExpedienteResumen pacienteId={paciente.id} />
        ) : null}
        {tab === "antecedentes" ? (
          <ExpedienteAntecedentes pacienteId={paciente.id} />
        ) : null}
        {tab === "crecimiento" ? (
          <ExpedienteCrecimiento pacienteId={paciente.id} />
        ) : null}
        {tab === "habito" ? (
          <ExpedienteHabitoDigestivo pacienteId={paciente.id} />
        ) : null}
        {tab === "consultas" ? (
          <ExpedienteConsultas
            pacienteId={paciente.id}
            onNueva={() => setShowNewConsulta(true)}
          />
        ) : null}
        {tab === "citas" ? <ExpedienteCitas pacienteId={paciente.id} /> : null}
      </div>

      <EditarPacienteModal
        pacienteId={paciente.id}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />

      <ConsultaFormModal
        pacienteId={paciente.id}
        open={showNewConsulta}
        onClose={() => setShowNewConsulta(false)}
      />
    </div>
  );
}
