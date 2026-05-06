import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Phone, Mail } from "lucide-react";
import { pacientesMock, formatearEdad } from "@/lib/mock";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Pacientes() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return pacientesMock;
    return pacientesMock.filter((p) => {
      const full = `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno ?? ""} ${p.tutorPrincipal}`.toLowerCase();
      return full.includes(term) || p.diagnosticosActivos.some((d) => d.toLowerCase().includes(term));
    });
  }, [q]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Pacientes</span>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy">
            Expedientes activos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} de {pacientesMock.length} pacientes
          </p>
        </div>
        <Button>
          <Plus size={16} strokeWidth={1.75} />
          Nuevo paciente
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2">
        <Search size={16} className="text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, tutor o diagnóstico"
          className="border-0 px-0 py-2 shadow-none focus:ring-0"
        />
      </div>

      <div className="mt-6 grid gap-3">
        {filtered.map((p) => (
          <Link
            key={p.id}
            to={`/admin/pacientes/${p.id}`}
            className="group flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-navy/40 hover:shadow-soft"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted font-display text-base font-semibold text-navy">
              {p.nombre.charAt(0)}
              {p.apellidoPaterno.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">
                  {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno ?? ""}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {formatearEdad(p.fechaNacimiento)} · {p.sexo === "femenino" ? "F" : "M"}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {p.diagnosticosActivos.map((d) => (
                  <Badge key={d} variant="leaf">
                    {d}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  Tutor: <strong className="text-foreground">{p.tutorPrincipal}</strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone size={11} /> {p.telefonoTutor}
                </span>
                {p.email ? (
                  <span className="inline-flex items-center gap-1">
                    <Mail size={11} /> {p.email}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Próxima cita
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">
                {p.proximaCita
                  ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short" }).format(new Date(p.proximaCita))
                  : "—"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
