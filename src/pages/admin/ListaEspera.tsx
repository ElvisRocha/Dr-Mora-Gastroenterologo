import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Ban,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  MessagesSquare,
  MoreVertical,
  UserPlus,
  X,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { useClinic, type CitaFull } from "@/store/clinicStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import {
  AgendarCitaModal,
  type ReagendarCita,
} from "@/components/admin/calendario/AgendarCitaModal";
import {
  PRIORIDAD_LABEL,
  type ListaEsperaMock,
  type PrioridadEspera,
} from "@/lib/data/listaEspera";
import { formatTelefono } from "@/lib/data/conversaciones";
import { pacientePorId, TIPO_ID_LABEL } from "@/lib/mock";
import { agoHr } from "@/lib/data/time";

const PRIORIDAD_DOT: Record<PrioridadEspera, string> = {
  alta: "bg-coral",
  media: "bg-amber",
  baja: "bg-leaf",
  sin_triar: "bg-muted-foreground/40",
};

// Estados de cita que cuentan como "próxima cita" vigente (habilita Reagendar).
const CITA_VIGENTE: CitaFull["estado"][] = ["agendada", "confirmada"];

const formatProximaCita = (iso?: string): string =>
  iso ? format(new Date(iso), "EEEE d 'de' MMMM, h:mm a", { locale: es }) : "—";

export default function ListaEspera() {
  const { listaEspera, updateEspera, addEspera, servicios, citas } = useClinic();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [agendarRow, setAgendarRow] = useState<ListaEsperaMock | null>(null);

  const reasignando = params.get("reasignar") === "1";
  const reFecha = params.get("fecha");
  const reServicio = params.get("servicio");

  const pendientes = useMemo(
    () =>
      listaEspera
        .filter((e) => e.estado === "pendiente")
        .sort((a, b) => {
          const rank: Record<PrioridadEspera, number> = {
            alta: 0,
            media: 1,
            baja: 2,
            sin_triar: 3,
          };
          return rank[a.prioridad] - rank[b.prioridad];
        }),
    [listaEspera],
  );

  // Próxima cita vigente (futura, no cancelada/realizada/no-asistió) por paciente.
  // Si existe, la fila muestra "Reagendar" en vez de "Agendar".
  const proximaCitaPorPaciente = useMemo(() => {
    const ahora = Date.now();
    const map = new Map<string, CitaFull>();
    for (const c of citas) {
      if (!c.pacienteId || !CITA_VIGENTE.includes(c.estado)) continue;
      if (+new Date(c.fechaHora) < ahora) continue;
      const cur = map.get(c.pacienteId);
      if (!cur || +new Date(c.fechaHora) < +new Date(cur.fechaHora)) {
        map.set(c.pacienteId, c);
      }
    }
    return map;
  }, [citas]);

  const proximaDe = (e: ListaEsperaMock): CitaFull | undefined =>
    e.pacienteId ? proximaCitaPorPaciente.get(e.pacienteId) : undefined;

  const dismissReasignar = () => {
    params.delete("reasignar");
    params.delete("fecha");
    params.delete("servicio");
    params.delete("notif");
    setParams(params, { replace: true });
  };

  // La cita a reagendar de la fila seleccionada (si el paciente ya tiene una).
  const agendarReagendar: ReagendarCita | null = (() => {
    const c = agendarRow ? proximaDe(agendarRow) : undefined;
    return c
      ? {
          id: c.id,
          servicioSlug: c.servicioSlug,
          fechaHora: c.fechaHora,
          duracionMin: c.duracionMin,
          notas: c.notas,
        }
      : null;
  })();

  // Tras agendar/reagendar, la entrada pasa a "agendada" (sale de la lista).
  const handleAgendarSaved = () => {
    if (agendarRow) updateEspera(agendarRow.id, { estado: "agendada" });
    if (reasignando) dismissReasignar();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Lista de espera
          </h2>
          <p className="text-sm text-muted-foreground">
            {pendientes.length} paciente{pendientes.length !== 1 ? "s" : ""} en
            espera de cupo
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <UserPlus size={16} />
          Agregar paciente
        </Button>
      </div>

      {reasignando ? (
        <div className="flex items-start gap-3 rounded-2xl border border-teal/30 bg-teal/8 px-4 py-3">
          <CalendarClock size={18} className="mt-0.5 shrink-0 text-teal" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              Reasignando un espacio liberado
            </p>
            <p className="text-xs text-muted-foreground">
              {reServicio ? `${reServicio} · ` : ""}
              {reFecha ?? "cupo disponible"}. Elige un paciente y presiona
              Agendar.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissReasignar}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-teal/10"
          >
            <X size={15} />
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Nombre del paciente</th>
                <th className="px-4 py-3 text-center font-medium">Identificación</th>
                <th className="px-4 py-3 text-center font-medium">Correo</th>
                <th className="px-4 py-3 text-center font-medium">Servicio</th>
                <th className="px-4 py-3 text-center font-medium">Observaciones</th>
                <th className="px-4 py-3 text-center font-medium">Conversación</th>
                <th className="px-4 py-3 text-center font-medium">Prioridad</th>
                <th className="px-4 py-3 text-center font-medium">Próxima Cita</th>
                <th className="px-4 py-3 text-center font-medium">Agendar</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    Aún no hay pacientes en lista de espera.
                  </td>
                </tr>
              ) : (
                pendientes.map((e) => {
                  const paciente = e.pacienteId
                    ? pacientePorId(e.pacienteId)
                    : null;
                  const nombre = paciente
                    ? `${paciente.nombre} ${paciente.apellidoPaterno}`
                    : e.nombre;
                  const telefono = paciente?.telefonoTutor ?? e.telefono;
                  const email = paciente?.email ?? e.email;
                  const proxima = proximaDe(e);
                  const puedeReagendar = !!proxima;
                  return (
                    <tr
                      key={e.id}
                      className="border-b border-border/70 last:border-0 align-top hover:bg-muted/30"
                    >
                      {/* Nombre + badges (lead / quién lo ingresó) + tiempo en espera */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-medium text-foreground">
                            {nombre}
                          </span>
                          {!e.pacienteId ? (
                            <Badge variant="neutral" className="normal-case tracking-normal">
                              Lead
                            </Badge>
                          ) : null}
                          {e.agregadoPor ? (
                            <Badge variant="navy" className="normal-case tracking-normal">
                              {e.agregadoPor}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          En espera{" "}
                          {formatDistanceToNow(new Date(e.fecha), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </td>

                      {/* Identificación (del expediente vinculado) */}
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {paciente?.identificacion
                          ? `${TIPO_ID_LABEL[paciente.identificacion.tipo]}: ${paciente.identificacion.numero}`
                          : "—"}
                      </td>

                      {/* Correo */}
                      <td className="max-w-[160px] px-4 py-3 text-center text-muted-foreground">
                        <span className="block truncate" title={email ?? undefined}>
                          {email || "—"}
                        </span>
                      </td>

                      {/* Servicio */}
                      <td className="max-w-[160px] px-4 py-3 text-center text-muted-foreground">
                        <span className="block truncate" title={e.servicioNombre ?? undefined}>
                          {e.servicioNombre || "—"}
                        </span>
                      </td>

                      {/* Observaciones (motivo) */}
                      <td className="max-w-[220px] px-4 py-3 text-center text-xs text-muted-foreground">
                        <span className="block whitespace-pre-line break-words">
                          {e.motivo || "—"}
                        </span>
                      </td>

                      {/* Conversación: teléfono → chat */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/conversaciones?phone=${encodeURIComponent(telefono)}`,
                            )
                          }
                          className="relative inline-flex items-center gap-1.5 text-xs text-navy hover:underline"
                          title="Abrir la conversación"
                        >
                          <MessagesSquare size={13} />
                          {formatTelefono(telefono)}
                          {e.noLeidos > 0 ? (
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-semibold text-offwhite">
                              {e.noLeidos > 9 ? "9+" : e.noLeidos}
                            </span>
                          ) : null}
                        </button>
                      </td>

                      {/* Prioridad: triage inline */}
                      <td className="px-4 py-3">
                        <div className="relative inline-flex items-center gap-1.5">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              PRIORIDAD_DOT[e.prioridad],
                            )}
                          />
                          <select
                            value={e.prioridad}
                            onChange={(ev) =>
                              updateEspera(e.id, {
                                prioridad: ev.target.value as PrioridadEspera,
                              })
                            }
                            className="cursor-pointer rounded-md border border-border bg-card py-1 pl-1 pr-6 text-xs outline-none focus:border-navy/40"
                          >
                            {(
                              ["alta", "media", "baja", "sin_triar"] as PrioridadEspera[]
                            ).map((p) => (
                              <option key={p} value={p}>
                                {PRIORIDAD_LABEL[p]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Próxima Cita */}
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                        <span className="block whitespace-pre-line break-words capitalize">
                          {formatProximaCita(proxima?.fechaHora)}
                        </span>
                      </td>

                      {/* Agendar / Reagendar + menú de acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAgendarRow(e)}
                            className="h-8 px-3 text-xs"
                          >
                            {puedeReagendar ? (
                              <CalendarClock size={14} />
                            ) : (
                              <CalendarPlus size={14} />
                            )}
                            {puedeReagendar ? "Reagendar" : "Agendar"}
                          </Button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setMenuId(menuId === e.id ? null : e.id)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {menuId === e.id ? (
                              <div
                                className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
                                onMouseLeave={() => setMenuId(null)}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateEspera(e.id, { estado: "atendida" });
                                    setMenuId(null);
                                    toast.success("Marcado como atendido");
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                >
                                  <CheckCircle2 size={15} className="text-leaf" />
                                  Marcar atendida
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateEspera(e.id, { estado: "descartada" });
                                    setMenuId(null);
                                    toast("Descartado de la lista");
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-coral hover:bg-coral/10"
                                >
                                  <Ban size={15} />
                                  Descartar
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddEsperaModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        servicios={servicios.filter((s) => s.activo).map((s) => s.nombre)}
        onAdd={(data) => {
          addEspera({
            id: `le-${Date.now()}`,
            estado: "pendiente",
            source: "manual",
            tieneConversacion: false,
            noLeidos: 0,
            agregadoPor: "Recepción",
            fecha: agoHr(0),
            ...data,
          });
          setAddOpen(false);
          toast.success("Agregado a lista de espera");
        }}
      />

      {/* Mismo panel de "Agendar cita" del calendario. Si el paciente ya tiene
          una cita vigente, abre en modo reagendar (mueve esa cita). */}
      <AgendarCitaModal
        open={!!agendarRow}
        onClose={() => setAgendarRow(null)}
        defaultPacienteId={agendarRow?.pacienteId}
        reagendarCita={agendarReagendar}
        onSaved={handleAgendarSaved}
      />
    </div>
  );
}

function AddEsperaModal({
  open,
  onClose,
  servicios,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  servicios: string[];
  onAdd: (data: {
    nombre: string;
    tutorNombre: string;
    telefono: string;
    prioridad: PrioridadEspera;
    servicioNombre?: string;
    motivo?: string;
  }) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [tutor, setTutor] = useState("");
  const [telefono, setTelefono] = useState("");
  const [prioridad, setPrioridad] = useState<PrioridadEspera>("sin_triar");
  const [servicio, setServicio] = useState("");
  const [motivo, setMotivo] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !tutor.trim() || !telefono.trim()) {
      toast.error("Completa nombre del paciente, tutor y teléfono");
      return;
    }
    onAdd({
      nombre: nombre.trim(),
      tutorNombre: tutor.trim(),
      telefono: telefono.trim(),
      prioridad,
      servicioNombre: servicio || undefined,
      motivo: motivo.trim() || undefined,
    });
    setNombre("");
    setTutor("");
    setTelefono("");
    setPrioridad("sin_triar");
    setServicio("");
    setMotivo("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Agregar a lista de espera"
      description="Registra un paciente que espera un cupo disponible."
      size="md"
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del paciente" required>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del niño/a" />
          </Field>
          <Field label="Tutor / responsable" required>
            <Input value={tutor} onChange={(e) => setTutor(e.target.value)} placeholder="Madre, padre o tutor" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Teléfono" required>
            <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+506 8888-8888" />
          </Field>
          <Field label="Prioridad">
            <Select value={prioridad} onChange={(e) => setPrioridad(e.target.value as PrioridadEspera)}>
              <option value="sin_triar">Sin triar</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Select>
          </Field>
        </div>
        <Field label="Servicio de interés">
          <Select value={servicio} onChange={(e) => setServicio(e.target.value)}>
            <option value="">Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Motivo / observaciones" hint="Ej. reflujo, dolor abdominal, estreñimiento, sangrado en heces">
          <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} className="min-h-[80px]" />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            <UserPlus size={16} />
            Agregar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
