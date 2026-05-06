import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Activity, ArrowUpRight, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { citasMock, pacientesMock, pacientePorId, formatearEdad } from "@/lib/mock";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const now = Date.now();
    const semanaMs = 7 * 24 * 60 * 60 * 1000;
    const proximas7 = citasMock.filter((c) => {
      const ts = new Date(c.fechaHora).getTime();
      return ts > now && ts < now + semanaMs && c.estado !== "cancelada";
    });
    const hoy = citasMock.filter((c) => {
      const f = new Date(c.fechaHora);
      const t = new Date();
      return (
        f.getDate() === t.getDate() &&
        f.getMonth() === t.getMonth() &&
        f.getFullYear() === t.getFullYear() &&
        c.estado !== "cancelada"
      );
    });
    return {
      pacientes: pacientesMock.length,
      proximas7: proximas7.length,
      hoy: hoy.length,
      activos: pacientesMock.filter((p) => p.diagnosticosActivos.length > 0).length,
    };
  }, []);

  const proximas = [...citasMock]
    .filter((c) => new Date(c.fechaHora).getTime() > Date.now() && c.estado !== "cancelada")
    .sort((a, b) => +new Date(a.fechaHora) - +new Date(b.fechaHora))
    .slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Panel</span>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy">
            Buenos días, {user?.nombre.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Calendar} label="Citas hoy" value={stats.hoy} accent="navy" />
        <Kpi icon={Clock} label="Próximos 7 días" value={stats.proximas7} accent="leaf" />
        <Kpi icon={Users} label="Pacientes activos" value={stats.pacientes} accent="teal" />
        <Kpi icon={Activity} label="Con dx activo" value={stats.activos} accent="amber" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-navy">Próximas citas</h2>
            <Link
              to="/admin/calendario"
              className="inline-flex items-center gap-1 text-sm font-medium text-navy hover:text-leaf"
            >
              Ver calendario
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Edad</th>
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {proximas.map((c) => {
                  const p = pacientePorId(c.pacienteId);
                  const f = new Date(c.fechaHora);
                  return (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/pacientes/${c.pacienteId}`}
                          className="font-medium text-foreground hover:text-navy"
                        >
                          {p ? `${p.nombre} ${p.apellidoPaterno}` : c.pacienteId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {p ? formatearEdad(p.fechaNacimiento) : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.servicioSlug}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Intl.DateTimeFormat("es-MX", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(f)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            c.estado === "confirmada"
                              ? "leaf"
                              : c.estado === "agendada"
                                ? "navy"
                                : "neutral"
                          }
                        >
                          {c.estado}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-navy">Diagnósticos frecuentes</h2>
          <Card className="mt-4 space-y-3">
            {[
              ["ERGE", 8],
              ["Estreñimiento crónico", 6],
              ["APLV", 4],
              ["Celiaquía", 3],
              ["EII", 3],
            ].map(([dx, n]) => (
              <div key={dx} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{dx}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {n}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Calendar;
  label: string;
  value: number;
  accent: "navy" | "leaf" | "teal" | "amber";
}) {
  const accentBg = {
    navy: "bg-navy/10 text-navy",
    leaf: "bg-leaf/15 text-leaf",
    teal: "bg-teal/15 text-teal",
    amber: "bg-amber/15 text-amber",
  }[accent];

  return (
    <Card className="flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentBg}`}>
        <Icon size={20} strokeWidth={1.6} />
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 font-display text-2xl font-semibold text-navy">{value}</div>
      </div>
    </Card>
  );
}
