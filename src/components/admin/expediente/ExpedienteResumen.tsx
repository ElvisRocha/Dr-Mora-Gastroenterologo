import { Calendar, ClipboardList, Pill, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { usePaciente } from "@/store/expedienteStore";
import { Badge } from "@/components/ui/Badge";

export function ExpedienteResumen({ pacienteId }: { pacienteId: string }) {
  const { paciente } = usePaciente(pacienteId);
  if (!paciente) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Block
        icon={<ClipboardList size={18} strokeWidth={1.75} />}
        title="Diagnósticos activos"
      >
        {paciente.diagnosticosActivos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin diagnósticos.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {paciente.diagnosticosActivos.map((d) => (
              <Badge key={d} variant="leaf">
                {d}
              </Badge>
            ))}
          </div>
        )}
      </Block>

      <Block
        icon={<Pill size={18} strokeWidth={1.75} />}
        title="Medicamentos actuales"
      >
        {!paciente.medicamentosActivos?.length ? (
          <p className="text-sm text-muted-foreground">Sin medicamentos.</p>
        ) : (
          <ul className="space-y-2">
            {paciente.medicamentosActivos.map((m) => (
              <li key={m.nombre} className="text-sm">
                <span className="font-medium text-foreground">{m.nombre}</span>
                <span className="ml-2 text-muted-foreground">
                  {m.dosis} · {m.frecuencia}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Block
        icon={<Stethoscope size={18} strokeWidth={1.75} />}
        title="Procedimientos asignados"
      >
        {!paciente.procedimientosAsignados?.length ? (
          <p className="text-sm text-muted-foreground">
            Sin procedimientos asignados.
          </p>
        ) : (
          <ul className="space-y-2">
            {paciente.procedimientosAsignados.map((p) => (
              <li
                key={p.nombre}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground">{p.nombre}</span>
                <Badge variant={p.estado === "realizado" ? "leaf" : "amber"}>
                  {p.estado}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Block
        icon={<Calendar size={18} strokeWidth={1.75} />}
        title="Próxima cita"
      >
        {paciente.proximaCita ? (
          <p className="text-sm capitalize text-foreground">
            {format(new Date(paciente.proximaCita), "EEEE, dd 'de' MMMM yyyy", {
              locale: es,
            })}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Sin próxima cita.</p>
        )}
        <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Última consulta
        </p>
        <p className="mt-1 text-sm text-foreground">
          {format(new Date(paciente.ultimaConsulta), "dd 'de' MMMM yyyy", {
            locale: es,
          })}
        </p>
      </Block>
    </div>
  );
}

function Block({
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
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10 text-navy">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}
