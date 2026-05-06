import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  UserPlus,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  citasMock,
  pacientePorId,
  pacientesMock,
  type CitaMock,
} from "@/lib/mock";
import { useLang } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/Badge";

const ESTADO_BADGE: Record<
  CitaMock["estado"],
  "navy" | "leaf" | "neutral" | "coral" | "amber"
> = {
  agendada: "navy",
  confirmada: "leaf",
  realizada: "neutral",
  cancelada: "coral",
  no_asistio: "amber",
};

export default function Dashboard() {
  const { t } = useLang();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const day = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + (day === 0 ? -6 : 1 - day));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const inRange = (iso: string, start: Date, end: Date) => {
      const ts = new Date(iso).getTime();
      return ts >= start.getTime() && ts < end.getTime();
    };

    const citasHoy = citasMock.filter(
      (c) => inRange(c.fechaHora, todayStart, todayEnd) && c.estado !== "cancelada",
    ).length;

    const citasSemana = citasMock.filter(
      (c) => inRange(c.fechaHora, weekStart, weekEnd) && c.estado !== "cancelada",
    ).length;

    const nuevosEsteMes = pacientesMock.filter((p) =>
      inRange(p.ultimaConsulta, monthStart, monthEnd),
    ).length;

    return {
      totalPacientes: pacientesMock.length,
      citasHoy,
      citasSemana,
      nuevosEsteMes,
    };
  }, []);

  const proximasCitas = useMemo(
    () =>
      [...citasMock]
        .filter(
          (c) =>
            new Date(c.fechaHora).getTime() > Date.now() &&
            (c.estado === "agendada" || c.estado === "confirmada"),
        )
        .sort((a, b) => +new Date(a.fechaHora) - +new Date(b.fechaHora))
        .slice(0, 5),
    [],
  );

  const pacientesRecientes = useMemo(
    () =>
      [...pacientesMock]
        .sort(
          (a, b) =>
            +new Date(b.ultimaConsulta) - +new Date(a.ultimaConsulta),
        )
        .slice(0, 5),
    [],
  );

  const statCards = [
    {
      title: "Total pacientes",
      value: stats.totalPacientes,
      icon: Users,
      accent: "text-navy",
    },
    {
      title: "Citas hoy",
      value: stats.citasHoy,
      icon: Calendar,
      accent: "text-leaf",
    },
    {
      title: "Citas semana",
      value: stats.citasSemana,
      icon: Activity,
      accent: "text-navy",
    },
    {
      title: "Nuevos este mes",
      value: stats.nuevosEsteMes,
      icon: UserPlus,
      accent: "text-leaf",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <stat.icon size={20} strokeWidth={1.6} className={stat.accent} />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between pb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Próximas citas
            </h3>
          </div>
          <div className="space-y-3">
            {proximasCitas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay citas próximas.
              </p>
            ) : (
              proximasCitas.map((cita) => {
                const paciente = pacientePorId(cita.pacienteId);
                const servicio = t.servicios.items.find(
                  (s) => s.slug === cita.servicioSlug,
                );
                return (
                  <div
                    key={cita.id}
                    className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {paciente
                          ? `${paciente.nombre} ${paciente.apellidoPaterno}`
                          : cita.pacienteId}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} strokeWidth={1.75} />
                        <span>
                          {format(
                            new Date(cita.fechaHora),
                            "EEE dd MMM · HH:mm",
                            { locale: es },
                          )}
                        </span>
                        <span>·</span>
                        <span className="truncate">
                          {servicio?.nombre ?? cita.servicioSlug}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={ESTADO_BADGE[cita.estado]}
                      className="shrink-0"
                    >
                      {cita.estado}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between pb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Pacientes recientes
            </h3>
            <Link
              to="/admin/pacientes"
              className="inline-flex items-center gap-1 text-xs font-medium text-navy hover:underline"
            >
              Ver todos
              <ArrowRight size={12} strokeWidth={1.75} />
            </Link>
          </div>
          <div className="space-y-1">
            {pacientesRecientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay pacientes registrados.
              </p>
            ) : (
              pacientesRecientes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(`/admin/pacientes/${p.id}`)}
                  className="-mx-2 flex w-full items-center justify-between gap-3 rounded-lg border-b border-border px-2 py-2 text-left last:border-0 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {p.nombre} {p.apellidoPaterno}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.telefonoTutor}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {format(new Date(p.ultimaConsulta), "dd/MM/yy")}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
