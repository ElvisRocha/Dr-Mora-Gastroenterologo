import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  IdCard,
  Phone,
  Stethoscope,
  User,
  UserPlus,
} from "lucide-react";
import { pacientePorId, formatearEdad } from "@/lib/mock";
import { formatTelefono, type ConversacionMock } from "@/lib/data/conversaciones";

function Campo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <Icon size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function PacienteFichaPanel({
  conversacion,
}: {
  conversacion: ConversacionMock;
}) {
  const paciente = conversacion.pacienteId
    ? pacientePorId(conversacion.pacienteId)
    : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <User size={15} className="text-navy" />
        <h3 className="text-sm font-semibold text-foreground">
          Ficha del paciente
        </h3>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {paciente ? (
          <>
            <div className="flex flex-col items-center pb-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-navy/15 to-leaf/15 text-base font-semibold text-navy">
                {paciente.nombre[0]}
                {paciente.apellidoPaterno[0]}
              </span>
              <p className="mt-2 font-display text-base font-semibold text-foreground">
                {paciente.nombre} {paciente.apellidoPaterno}{" "}
                {paciente.apellidoMaterno ?? ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatearEdad(paciente.fechaNacimiento)} ·{" "}
                {paciente.sexo === "masculino" ? "Masculino" : "Femenino"}
              </p>
            </div>

            {paciente.diagnosticosActivos.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {paciente.diagnosticosActivos.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-medium text-navy"
                  >
                    {d}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="divide-y divide-border border-y border-border">
              <Campo
                icon={User}
                label="Tutor"
                value={`${conversacion.contactoNombre} (${paciente.tutorPrincipal === conversacion.contactoNombre ? "principal" : "contacto"})`}
              />
              <Campo
                icon={Phone}
                label="Teléfono"
                value={formatTelefono(conversacion.telefono)}
              />
              <Campo
                icon={CalendarDays}
                label="Nacimiento"
                value={paciente.fechaNacimiento}
              />
              <Campo icon={IdCard} label="Expediente" value={paciente.id.toUpperCase()} />
              <Campo
                icon={Stethoscope}
                label="Última consulta"
                value={paciente.ultimaConsulta}
              />
            </div>

            <Link
              to={`/admin/pacientes/${paciente.id}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-navy px-4 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-navy/90"
            >
              Ver expediente completo
              <ArrowRight size={14} />
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UserPlus size={22} />
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">
              {conversacion.pacienteNombre ?? "Paciente no registrado"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Este contacto es un <strong>lead</strong>: aún no tiene expediente
              en el sistema.
            </p>
            <div className="mt-4 w-full space-y-1 rounded-xl border border-border bg-muted/30 p-3 text-left">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Contacto
              </p>
              <p className="text-sm text-foreground">{conversacion.contactoNombre}</p>
              <p className="text-xs text-muted-foreground">
                {formatTelefono(conversacion.telefono)}
              </p>
            </div>
            <Link
              to="/admin/pacientes"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <UserPlus size={14} />
              Registrar paciente
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
