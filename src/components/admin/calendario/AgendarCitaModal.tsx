import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, CalendarPlus, Check, Search, User } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { SidePanel } from "@/components/ui/SidePanel";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { useClinic, type CitaFull } from "@/store/clinicStore";
import { pacientesMock, TIPO_ID_LABEL, type PacienteMock } from "@/lib/mock";
import { cn } from "@/lib/cn";

const MINUTOS = ["00", "15", "30", "45"];
const HORAS12 = Array.from({ length: 12 }, (_, i) => i + 1);

function to24h(hour12: number, minute: string, ampm: "AM" | "PM"): string {
  let h = hour12 % 12;
  if (ampm === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

function from24h(hour: number): { hour12: number; ampm: "AM" | "PM" } {
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return { hour12, ampm };
}

export function AgendarCitaModal({
  open,
  onClose,
  defaultDate,
  defaultHour,
  defaultMinute,
}: {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
  defaultHour?: number;
  defaultMinute?: number;
}) {
  const { servicios, addCita, addNotificacion } = useClinic();
  const serviciosActivos = servicios.filter((s) => s.activo);

  const [pacienteId, setPacienteId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hour12, setHour12] = useState(9);
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [duracion, setDuracion] = useState("30");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    if (!open) return;
    const d = defaultDate ?? new Date();
    setFecha(format(d, "yyyy-MM-dd"));
    const h = defaultHour ?? 9;
    const { hour12: h12, ampm: ap } = from24h(h);
    setHour12(h12);
    setAmpm(ap);
    setMinute(
      defaultMinute != null
        ? String(defaultMinute).padStart(2, "0")
        : "00",
    );
    setPacienteId("");
    setServicioId("");
    setDuracion("30");
    setNotas("");
  }, [open, defaultDate, defaultHour, defaultMinute]);

  const servicio = useMemo(
    () => serviciosActivos.find((s) => s.id === servicioId),
    [serviciosActivos, servicioId],
  );

  // Al elegir servicio, precargamos su duración (editable).
  const onServicio = (id: string) => {
    setServicioId(id);
    const s = serviciosActivos.find((x) => x.id === id);
    if (s?.duracionMin) setDuracion(String(s.duracionMin));
  };

  const submit = () => {
    if (!pacienteId || !servicioId || !fecha) {
      toast.error("Completa paciente, servicio y fecha");
      return;
    }
    const paciente = pacientesMock.find((p) => p.id === pacienteId);
    const [h, m] = to24h(hour12, minute, ampm).split(":").map(Number);
    const d = new Date(fecha + "T00:00:00");
    d.setHours(h, m, 0, 0);
    const cita: CitaFull = {
      id: `c-${Date.now()}`,
      pacienteId,
      servicioSlug: servicioId,
      fechaHora: d.toISOString(),
      duracionMin: Number(duracion) || servicio?.duracionMin || 30,
      estado: "agendada",
      source: "manual",
      referenceCode: `GK-${Math.floor(10000 + Math.random() * 90000)}`,
      monto: servicio?.precio,
      notas: notas.trim() || undefined,
    };
    addCita(cita);
    addNotificacion({
      id: `n-${Date.now()}`,
      tipo: "cita_agendada",
      titulo: "Cita agendada",
      mensaje: `${paciente?.nombre ?? "Paciente"} ${paciente?.apellidoPaterno ?? ""} · ${servicio?.nombre ?? ""}`,
      leida: false,
      fecha: new Date().toISOString(),
      vista: "calendario",
      pacienteId,
    });
    toast.success("Cita agendada", {
      description: `${paciente?.nombre} · ${format(d, "dd/MM · HH:mm")}`,
    });
    onClose();
  };

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Agendar nueva cita"
      subtitle="Crea una cita para un paciente desde el calendario admin."
      widthClass="sm:max-w-lg lg:max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit}>
            <CalendarPlus size={14} strokeWidth={1.75} />
            Agendar cita
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field label="Paciente" required>
          <PacienteCombobox value={pacienteId} onChange={setPacienteId} />
        </Field>

        <Field label="Servicio" required>
          <Select value={servicioId} onChange={(e) => onServicio(e.target.value)}>
            <option value="">Selecciona un servicio</option>
            {serviciosActivos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} · {s.duracion}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha" required>
            <div className="relative">
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="pr-10"
              />
              <Calendar
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </Field>
          <Field label="Hora" required>
            <div className="flex items-center gap-1">
              <Select
                value={hour12}
                onChange={(e) => setHour12(Number(e.target.value))}
                className="w-[3.75rem] shrink-0 px-2 pr-6 text-center"
              >
                {HORAS12.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </Select>
              <span className="font-semibold text-muted-foreground">:</span>
              <Select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="w-[3.75rem] shrink-0 px-2 pr-6 text-center"
              >
                {MINUTOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
              <div className="ml-1 inline-flex shrink-0 overflow-hidden rounded-lg border border-border">
                {(["AM", "PM"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmpm(p)}
                    className={cn(
                      "px-2.5 py-2 text-xs font-semibold transition-colors",
                      ampm === p
                        ? "bg-navy text-offwhite"
                        : "bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </Field>
        </div>

        <Field label="Duración (minutos)" required>
          <Input
            type="number"
            inputMode="numeric"
            min={15}
            step={15}
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
        </Field>

        <Field label="Notas (opcional)">
          <Textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Información adicional para el doctor…"
          />
        </Field>

        {servicio ? (
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
            <p className="font-medium text-foreground">{servicio.nombre}</p>
            <p className="text-xs text-muted-foreground">
              Duración sugerida {servicio.duracion}
              {servicio.requiereSecretaria
                ? " · Requiere coordinación de recepción"
                : ""}
            </p>
          </div>
        ) : null}
      </div>
    </SidePanel>
  );
}

// ─── Buscador de paciente ───────────────────────────────────────────────────
function nombreCompleto(p: PacienteMock) {
  return `${p.nombre} ${p.apellidoPaterno}${p.apellidoMaterno ? ` ${p.apellidoMaterno}` : ""}`;
}

function PacienteCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? pacientesMock.find((p) => p.id === value) : null;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? pacientesMock.filter((p) => {
          const nom = nombreCompleto(p).toLowerCase();
          const ced = p.identificacion?.numero?.toLowerCase() ?? "";
          const tel = p.telefonoTutor.toLowerCase();
          return nom.includes(q) || ced.includes(q) || tel.includes(q);
        })
      : pacientesMock;
    return base.slice(0, 8);
  }, [query]);

  const pick = (p: PacienteMock) => {
    onChange(p.id);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={open ? query : selected ? nombreCompleto(selected) : query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar paciente…"
          className="pl-9"
        />
      </div>

      {open ? (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-elevated">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              Sin coincidencias.
            </p>
          ) : (
            results.map((p) => {
              const isSel = p.id === value;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pick(p)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
                    <User size={14} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {nombreCompleto(p)}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {p.identificacion
                        ? `${TIPO_ID_LABEL[p.identificacion.tipo]}: ${p.identificacion.numero}`
                        : p.telefonoTutor}
                    </span>
                  </span>
                  {isSel ? <Check size={15} className="text-leaf" /> : null}
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
