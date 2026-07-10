import { useState } from "react";
import {
  Building2,
  CalendarClock,
  Pencil,
  Plus,
  Power,
  Save,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { useClinic } from "@/store/clinicStore";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ServicioFormModal } from "@/components/admin/configuracion/ServicioFormModal";
import {
  CATEGORIA_BADGE,
  CATEGORIA_LABEL,
  formatPrecio,
  type ServicioFull,
} from "@/lib/data/servicios";
import {
  DIAS_LABEL,
  DIAS_ORDEN_LUNES,
  horarioDelDia,
  type HorarioRango,
} from "@/lib/data/horarios";

type Tab = "consultorio" | "servicios" | "horarios" | "accesos";

const TABS: { key: Tab; label: string; icon: typeof Building2 }[] = [
  { key: "consultorio", label: "Consultorio", icon: Building2 },
  { key: "servicios", label: "Servicios", icon: Stethoscope },
  { key: "horarios", label: "Horarios", icon: CalendarClock },
  { key: "accesos", label: "Accesos", icon: ShieldCheck },
];

export default function Configuracion() {
  const [tab, setTab] = useState<Tab>("consultorio");

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Configuración</span>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-navy">
          Ajustes del consultorio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cambios visibles en el sitio público y en el panel clínico.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "border-navy text-navy"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "consultorio" ? <ConsultorioTab /> : null}
      {tab === "servicios" ? <ServiciosTab /> : null}
      {tab === "horarios" ? <HorariosTab /> : null}
      {tab === "accesos" ? <AccesosTab /> : null}
    </div>
  );
}

function ConsultorioTab() {
  const { config, updateConfig } = useClinic();
  const [form, setForm] = useState(config.contacto);
  const [bookingEnabled, setBookingEnabled] = useState(config.bookingEnabled);
  const [fraseLogin, setFraseLogin] = useState(config.mostrarFraseLogin);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      contacto: form,
      bookingEnabled,
      mostrarFraseLogin: fraseLogin,
    });
    toast.success("Configuración guardada");
  };

  return (
    <form onSubmit={save} className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-5">
        <h2 className="font-display text-lg font-semibold text-navy">
          Contacto público
        </h2>
        <Field label="WhatsApp del consultorio">
          <Input
            value={form.whatsappDisplay}
            onChange={(e) => setForm({ ...form, whatsappDisplay: e.target.value })}
          />
        </Field>
        <Field label="Teléfono">
          <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        </Field>
        <Field label="Email de contacto">
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Dirección">
          <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
        </Field>
        <Field label="Ciudad / CP">
          <Input value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
        </Field>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-navy">Redes sociales</h2>
          <Field label="Instagram">
            <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </Field>
          <Field label="Facebook">
            <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          </Field>
          <Field label="TikTok">
            <Input value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-navy">Preferencias</h2>
          <Toggle
            checked={bookingEnabled}
            onChange={setBookingEnabled}
            title="Reservas en línea activadas"
            desc="Si lo desactivas, /agendar-cita muestra un aviso."
          />
          <Toggle
            checked={fraseLogin}
            onChange={setFraseLogin}
            title="Frase inspiradora al iniciar sesión"
            desc="Muestra una frase motivacional después del login."
          />
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Button type="submit">
          <Save size={16} />
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  desc: string;
}) {
  return (
    <label className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
          checked ? "bg-leaf" : "bg-muted-foreground/30",
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
      <span className="text-sm">
        <strong className="block text-foreground">{title}</strong>
        <span className="text-muted-foreground">{desc}</span>
      </span>
    </label>
  );
}

function ServiciosTab() {
  const { servicios, addServicio, updateServicio, toggleServicio } = useClinic();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServicioFull | null>(null);

  const ordered = [...servicios].sort((a, b) => {
    if (a.activo !== b.activo) return a.activo ? -1 : 1;
    return a.orden - b.orden;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {servicios.filter((s) => s.activo).length} servicios activos
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} />
          Nuevo servicio
        </Button>
      </div>

      <div className="space-y-2">
        {ordered.map((s) => (
          <div
            key={s.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-soft",
              !s.activo && "opacity-60",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{s.nombre}</p>
                <Badge variant={CATEGORIA_BADGE[s.categoria]}>
                  {CATEGORIA_LABEL[s.categoria]}
                </Badge>
                {!s.activo ? (
                  <Badge variant="neutral" className="normal-case tracking-normal">
                    Inactivo
                  </Badge>
                ) : null}
                {s.requiereSecretaria ? (
                  <Badge variant="amber" className="normal-case tracking-normal">
                    Coordinación
                  </Badge>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {s.duracion} · {formatPrecio(s.precio)}
                {s.precioNota ? ` · ${s.precioNota}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => toggleServicio(s.id)}
                title={s.activo ? "Desactivar" : "Activar"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  s.activo
                    ? "text-leaf hover:bg-leaf/10"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Power size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(s);
                  setModalOpen(true);
                }}
                title="Editar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ServicioFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        servicio={editing}
        existingIds={servicios.map((s) => s.id)}
        onSave={(svc, isNew) => {
          if (isNew) addServicio(svc);
          else updateServicio(svc.id, svc);
        }}
      />
    </div>
  );
}

function HorariosTab() {
  const { horarios, addHorario, updateHorario, removeHorario } = useClinic();

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Define los rangos de atención por día. Se reflejan en el sitio y sombrean
        la agenda fuera de horario.
      </p>
      <div className="space-y-2">
        {DIAS_ORDEN_LUNES.map((dia) => {
          const rangos = horarios
            .filter((h) => h.dia === dia)
            .sort((a, b) => a.inicio.localeCompare(b.inicio));
          return (
            <div key={dia} className="rounded-xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{DIAS_LABEL[dia]}</p>
                  <p className="text-xs text-muted-foreground">
                    {horarioDelDia(horarios, dia)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    addHorario({
                      id: `h-${dia}-${Date.now()}`,
                      dia,
                      inicio: "09:00",
                      fin: "14:00",
                      activo: true,
                    })
                  }
                  className="h-8 px-2.5 text-xs"
                >
                  <Plus size={14} />
                  Agregar
                </Button>
              </div>
              {rangos.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {rangos.map((r) => (
                    <RangoRow
                      key={r.id}
                      rango={r}
                      onChange={(patch) => updateHorario(r.id, patch)}
                      onRemove={() => removeHorario(r.id)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RangoRow({
  rango,
  onChange,
  onRemove,
}: {
  rango: HorarioRango;
  onChange: (patch: Partial<HorarioRango>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="time"
        value={rango.inicio}
        onChange={(e) => onChange({ inicio: e.target.value })}
        step={900}
        className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm outline-none focus:border-navy/40"
      />
      <span className="text-muted-foreground">—</span>
      <input
        type="time"
        value={rango.fin}
        onChange={(e) => onChange({ fin: e.target.value })}
        step={900}
        className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm outline-none focus:border-navy/40"
      />
      <label className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={rango.activo}
          onChange={(e) => onChange({ activo: e.target.checked })}
          className="h-3.5 w-3.5 rounded border-border accent-navy"
        />
        Activo
      </label>
      <button
        type="button"
        onClick={onRemove}
        className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-coral/10 hover:text-coral"
        aria-label="Eliminar rango"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function AccesosTab() {
  const { config, updateConfig } = useClinic();
  const { accesos } = config;

  const setFlag = (
    modulo: "conversaciones" | "listaEspera",
    rol: "admin" | "doctor" | "secretaria",
    value: boolean,
  ) => {
    updateConfig({
      accesos: {
        ...accesos,
        [modulo]: { ...accesos[modulo], [rol]: value },
      },
    });
  };

  const Row = ({
    modulo,
    label,
    desc,
  }: {
    modulo: "conversaciones" | "listaEspera";
    label: string;
    desc: string;
  }) => (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-navy">{label}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="space-y-3">
        {(["admin", "doctor", "secretaria"] as const).map((rol) => (
          <Toggle
            key={rol}
            checked={accesos[modulo][rol]}
            onChange={(v) => setFlag(modulo, rol, v)}
            title={
              rol === "admin"
                ? "Administrador"
                : rol === "doctor"
                  ? "Dr. Mora"
                  : "Recepción / Secretaría"
            }
            desc={`Puede ver el módulo de ${label.toLowerCase()}.`}
          />
        ))}
      </div>
    </Card>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Row
        modulo="conversaciones"
        label="Conversaciones"
        desc="Controla qué roles acceden a la bandeja de mensajes."
      />
      <Row
        modulo="listaEspera"
        label="Lista de espera"
        desc="Controla qué roles acceden a la lista de espera."
      />
    </div>
  );
}
