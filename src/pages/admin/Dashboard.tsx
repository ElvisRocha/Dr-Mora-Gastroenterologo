import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Clock,
  MessagesSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { format, formatDistanceToNowStrict, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { pacientePorId, pacientesMock } from "@/lib/mock";
import { useClinic, type CitaFull } from "@/store/clinicStore";
import { useAuth } from "@/hooks/useAuth";
import { formatPrecio } from "@/lib/data/servicios";
import { Badge } from "@/components/ui/Badge";

const ESTADO_BADGE: Record<
  CitaFull["estado"],
  "navy" | "leaf" | "neutral" | "coral" | "amber"
> = {
  agendada: "navy",
  confirmada: "leaf",
  realizada: "neutral",
  cancelada: "coral",
  no_asistio: "amber",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { citas, servicios, conversaciones, listaEspera, notificaciones } =
    useClinic();

  const stats = useMemo(() => {
    const now = new Date();
    const citasHoy = citas.filter(
      (c) => isToday(new Date(c.fechaHora)) && c.estado !== "cancelada",
    );
    const ingresosHoy = citasHoy.reduce(
      (a, c) => a + (c.monto ?? servicios.find((s) => s.id === c.servicioSlug)?.precio ?? 0),
      0,
    );
    return {
      totalPacientes: pacientesMock.length,
      citasHoy: citasHoy.length,
      ingresosHoy,
      sinLeer: conversaciones.reduce((a, c) => a + c.noLeidos, 0),
      espera: listaEspera.filter((e) => e.estado === "pendiente").length,
      now,
    };
  }, [citas, conversaciones, listaEspera, servicios]);

  const agendaHoy = useMemo(
    () =>
      citas
        .filter((c) => isToday(new Date(c.fechaHora)) && c.estado !== "cancelada")
        .sort((a, b) => +new Date(a.fechaHora) - +new Date(b.fechaHora)),
    [citas],
  );

  const proximasCitas = useMemo(
    () =>
      [...citas]
        .filter(
          (c) =>
            new Date(c.fechaHora).getTime() > Date.now() &&
            (c.estado === "agendada" || c.estado === "confirmada"),
        )
        .sort((a, b) => +new Date(a.fechaHora) - +new Date(b.fechaHora))
        .slice(0, 6),
    [citas],
  );

  const actividad = useMemo(
    () => [...notificaciones].slice(0, 5),
    [notificaciones],
  );

  const nombre = user?.nombre?.split(" ").slice(0, 2).join(" ") ?? "equipo";

  const statCards = [
    {
      title: "Pacientes",
      value: stats.totalPacientes,
      icon: Users,
      accent: "text-navy",
      to: "/admin/pacientes",
      sub: "en el sistema",
    },
    {
      title: "Citas hoy",
      value: stats.citasHoy,
      icon: CalendarDays,
      accent: "text-teal",
      to: "/admin/calendario",
      sub: `${formatPrecio(stats.ingresosHoy)} estimados`,
    },
    {
      title: "Mensajes sin leer",
      value: stats.sinLeer,
      icon: MessagesSquare,
      accent: "text-leaf",
      to: "/admin/conversaciones",
      sub: "conversaciones",
    },
    {
      title: "En lista de espera",
      value: stats.espera,
      icon: TrendingUp,
      accent: "text-amber",
      to: "/admin/lista-espera",
      sub: "por agendar",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Hola, {nombre}
        </h2>
        <p className="text-sm capitalize text-muted-foreground">
          {format(stats.now, "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <button
            key={stat.title}
            type="button"
            onClick={() => navigate(stat.to)}
            className="rounded-2xl border border-border bg-card p-5 text-left shadow-soft transition-all hover:border-navy/30 hover:shadow-elevated"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                {stat.title}
              </span>
              <stat.icon size={20} strokeWidth={1.6} className={stat.accent} />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Agenda de hoy */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between pb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Agenda de hoy
            </h3>
            <Link
              to="/admin/calendario"
              className="inline-flex items-center gap-1 text-xs font-medium text-navy hover:underline"
            >
              Ver calendario
              <ArrowRight size={12} />
            </Link>
          </div>
          {agendaHoy.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No hay citas para hoy.
            </p>
          ) : (
            <div className="space-y-2">
              {agendaHoy.map((cita) => {
                const paciente = pacientePorId(cita.pacienteId);
                const servicio = servicios.find((s) => s.id === cita.servicioSlug);
                return (
                  <button
                    key={cita.id}
                    type="button"
                    onClick={() => navigate(`/admin/pacientes/${cita.pacienteId}`)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-navy/5 py-1">
                      <span className="font-mono text-sm font-semibold text-navy">
                        {format(new Date(cita.fechaHora), "HH:mm")}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {cita.duracionMin} min
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {paciente
                          ? `${paciente.nombre} ${paciente.apellidoPaterno}`
                          : (cita.pacienteNombre ?? "Sin paciente")}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {servicio?.nombre ?? cita.servicioSlug}
                      </p>
                    </div>
                    <Badge variant={ESTADO_BADGE[cita.estado]} className="shrink-0">
                      {cita.estado}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Actividad reciente */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 pb-4">
            <Bell size={16} className="text-navy" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Actividad reciente
            </h3>
          </div>
          <div className="space-y-3">
            {actividad.map((n) => (
              <div key={n.id} className="border-b border-border/70 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-foreground">{n.titulo}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {n.mensaje}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/70">
                  hace {formatDistanceToNowStrict(new Date(n.fecha), { locale: es })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Próximas citas */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between pb-4">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Próximas citas
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {proximasCitas.map((cita) => {
            const paciente = pacientePorId(cita.pacienteId);
            const servicio = servicios.find((s) => s.id === cita.servicioSlug);
            return (
              <button
                key={cita.id}
                type="button"
                onClick={() => navigate(`/admin/pacientes/${cita.pacienteId}`)}
                className="flex flex-col gap-1 rounded-xl border border-border/70 p-3.5 text-left transition-colors hover:bg-muted/40"
              >
                <p className="text-sm font-medium text-foreground">
                  {paciente
                    ? `${paciente.nombre} ${paciente.apellidoPaterno}`
                    : (cita.pacienteNombre ?? cita.pacienteId)}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {format(new Date(cita.fechaHora), "EEE dd MMM · HH:mm", {
                    locale: es,
                  })}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {servicio?.nombre ?? cita.servicioSlug}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
