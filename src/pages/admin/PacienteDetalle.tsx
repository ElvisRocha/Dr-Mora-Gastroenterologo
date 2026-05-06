import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Baby,
  Users,
  Activity,
  Apple,
  Pill,
  TestTube2,
  Syringe,
  ClipboardList,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { pacientePorId, formatearEdad, citasMock } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "datos", label: "Datos del niño", icon: Baby },
  { id: "tutores", label: "Tutores", icon: Users },
  { id: "antecedentes", label: "Antecedentes", icon: ClipboardList },
  { id: "antropometria", label: "Antropometría", icon: TrendingUp },
  { id: "alimentacion", label: "Alimentación", icon: Apple },
  { id: "intestinal", label: "Hábito intestinal", icon: Activity },
  { id: "diagnosticos", label: "Diagnósticos", icon: AlertCircle },
  { id: "procedimientos", label: "Procedimientos", icon: TestTube2 },
  { id: "medicamentos", label: "Medicamentos", icon: Pill },
  { id: "vacunas", label: "Vacunas", icon: Syringe },
] as const;

export default function PacienteDetalle() {
  const { id } = useParams();
  const paciente = pacientePorId(id ?? "");
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("datos");

  if (!paciente) {
    return (
      <div>
        <Link to="/admin/pacientes" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver a pacientes
        </Link>
        <p className="mt-6 text-muted-foreground">Paciente no encontrado.</p>
      </div>
    );
  }

  const citasPaciente = citasMock
    .filter((c) => c.pacienteId === paciente.id)
    .sort((a, b) => +new Date(b.fechaHora) - +new Date(a.fechaHora));

  return (
    <div>
      <Link
        to="/admin/pacientes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Volver a pacientes
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted font-display text-2xl font-semibold text-navy">
              {paciente.nombre.charAt(0)}
              {paciente.apellidoPaterno.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-navy">
                {paciente.nombre} {paciente.apellidoPaterno} {paciente.apellidoMaterno ?? ""}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatearEdad(paciente.fechaNacimiento)} · {paciente.sexo === "femenino" ? "Femenino" : "Masculino"}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Fecha de nacimiento">
              {new Intl.DateTimeFormat("es-MX", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(paciente.fechaNacimiento))}
            </Row>
            <Row label="Tutor principal">{paciente.tutorPrincipal}</Row>
            <Row label="Teléfono">{paciente.telefonoTutor}</Row>
            {paciente.email ? <Row label="Email">{paciente.email}</Row> : null}
          </dl>

          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Diagnósticos activos
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {paciente.diagnosticosActivos.length === 0 ? (
                <span className="text-xs text-muted-foreground">Sin diagnósticos</span>
              ) : (
                paciente.diagnosticosActivos.map((d) => (
                  <Badge key={d} variant="leaf">
                    {d}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-8">
          <div className="overflow-x-auto">
            <div className="flex gap-1 rounded-2xl border border-border bg-card p-1">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                      active
                        ? "bg-navy text-offwhite"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon size={13} strokeWidth={1.6} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="mt-4">
            <TabContent tab={tab} />
          </Card>

          <h2 className="mt-10 font-display text-lg font-semibold text-navy">Historial de citas</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {citasPaciente.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                      Sin citas registradas
                    </td>
                  </tr>
                ) : (
                  citasPaciente.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Intl.DateTimeFormat("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(c.fechaHora))}
                      </td>
                      <td className="px-4 py-3 text-foreground">{c.servicioSlug}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            c.estado === "realizada"
                              ? "neutral"
                              : c.estado === "confirmada"
                                ? "leaf"
                                : "navy"
                          }
                        >
                          {c.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-baseline gap-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

function TabContent({ tab }: { tab: (typeof TABS)[number]["id"] }) {
  switch (tab) {
    case "datos":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Grupo sanguíneo">O+</Field>
          <Field label="Tipo de parto">Cesárea</Field>
          <Field label="Peso al nacer">3.2 kg</Field>
          <Field label="Talla al nacer">49 cm</Field>
          <Field label="Semanas de gestación">38</Field>
          <Field label="Lactancia">Materna exclusiva 4 meses</Field>
        </div>
      );
    case "tutores":
      return (
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Marisol Aguirre</span>
              <Badge variant="navy">Madre · contacto principal</Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">+52 55 4729 1834 · marisol.aguirre@correo.mx</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Daniel Pérez</span>
              <Badge variant="neutral">Padre</Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">+52 55 6118 8472</div>
          </div>
        </div>
      );
    case "antecedentes":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Antecedentes familiares">EII (tío materno), atopia (madre)</Field>
          <Field label="Alergias conocidas">Proteína de leche</Field>
          <Field label="Cirugías previas">Ninguna</Field>
          <Field label="Hospitalizaciones">Una a los 8 meses por bronquiolitis</Field>
        </div>
      );
    case "antropometria":
      return (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Peso</th>
                <th className="px-4 py-2">Talla</th>
                <th className="px-4 py-2">IMC</th>
                <th className="px-4 py-2">Pc peso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["2026-04-22", "12.4 kg", "92 cm", "14.6", "p25"],
                ["2026-01-10", "11.8 kg", "89 cm", "14.9", "p25"],
                ["2025-10-04", "11.1 kg", "86 cm", "15.0", "p20"],
                ["2025-07-12", "10.4 kg", "82 cm", "15.5", "p18"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} className={cn("px-4 py-2", i === 0 ? "text-muted-foreground" : "text-foreground")}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "alimentacion":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="N.º de comidas al día">5</Field>
          <Field label="Dieta especial">Sin proteína de leche de vaca</Field>
          <Field label="Alimentos preferidos">Pollo, arroz, manzana</Field>
          <Field label="Alimentos rechazados">Vegetales de hoja verde</Field>
        </div>
      );
    case "intestinal":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Escala de Bristol">4</Field>
          <Field label="Frecuencia / semana">7</Field>
          <Field label="Dolor al defecar">No</Field>
          <Field label="Sangrado">No</Field>
          <Field label="Distensión">Ocasional, postprandial</Field>
          <Field label="Reflujo / vómito">Reflujo silencioso ocasional</Field>
        </div>
      );
    case "diagnosticos":
      return (
        <div className="space-y-3">
          {[
            ["ERGE del lactante", "K21.9", "Activo · Ranitidina suspendida 2025-09"],
            ["APLV", "K52.2", "Activo · dieta de eliminación"],
          ].map(([dx, cie, est]) => (
            <div key={dx} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{dx}</span>
                <Badge variant="leaf">{cie}</Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{est}</div>
            </div>
          ))}
        </div>
      );
    case "procedimientos":
      return (
        <ul className="space-y-3 text-sm">
          {[
            ["Endoscopía digestiva alta", "2025-08-14", "Esofagitis grado A. Hp negativo."],
            ["pH-metría 24h", "2025-09-22", "Índice DeMeester 18.7. Reflujo ácido patológico."],
          ].map(([t, f, h]) => (
            <li key={f} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t}</span>
                <span className="text-xs text-muted-foreground">{f}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{h}</p>
            </li>
          ))}
        </ul>
      );
    case "medicamentos":
      return (
        <ul className="space-y-2 text-sm">
          {[
            ["Omeprazol pediátrico", "1 mg/kg/día", "Mañana, 30 min antes del desayuno"],
            ["Probiótico", "1 sobre", "Diario"],
          ].map(([n, d, f]) => (
            <li key={n} className="flex items-start justify-between rounded-xl border border-border p-3">
              <div>
                <div className="font-medium">{n}</div>
                <div className="text-xs text-muted-foreground">{f}</div>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {d}
              </span>
            </li>
          ))}
        </ul>
      );
    case "vacunas":
      return (
        <ul className="space-y-1.5 text-sm">
          {[
            "BCG · al nacimiento",
            "Hepatitis B · 0, 2, 6 meses",
            "Pentavalente · 2, 4, 6 meses",
            "Rotavirus · 2, 4 meses",
            "Triple viral · 12 meses",
            "Influenza · refuerzo anual",
          ].map((v) => (
            <li
              key={v}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
              {v}
            </li>
          ))}
        </ul>
      );
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}
