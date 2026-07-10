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
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { useClinic } from "@/store/clinicStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import {
  PRIORIDAD_BADGE,
  PRIORIDAD_LABEL,
  SOURCE_LABEL,
  type ListaEsperaMock,
  type PrioridadEspera,
} from "@/lib/data/listaEspera";
import { formatTelefono } from "@/lib/data/conversaciones";
import { agoHr } from "@/lib/data/time";

const PRIORIDAD_DOT: Record<PrioridadEspera, string> = {
  alta: "bg-coral",
  media: "bg-amber",
  baja: "bg-leaf",
  sin_triar: "bg-muted-foreground/40",
};

export default function ListaEspera() {
  const { listaEspera, updateEspera, addEspera, servicios } = useClinic();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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

  const dismissReasignar = () => {
    params.delete("reasignar");
    params.delete("fecha");
    params.delete("servicio");
    params.delete("notif");
    setParams(params, { replace: true });
  };

  const agendar = (e: ListaEsperaMock) => {
    updateEspera(e.id, { estado: "agendada" });
    toast.success(`${e.nombre} agendado`, {
      description: "Se movió de la lista de espera a la agenda.",
    });
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
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Paciente</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Motivo</th>
                <th className="px-4 py-3 font-medium">Chat</th>
                <th className="px-4 py-3 font-medium">Prioridad</th>
                <th className="px-4 py-3 font-medium">Origen</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Aún no hay pacientes en lista de espera.
                  </td>
                </tr>
              ) : (
                pendientes.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-border/70 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">
                          {e.nombre}
                        </span>
                        {!e.pacienteId ? (
                          <Badge variant="neutral" className="normal-case tracking-normal">
                            Lead
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {e.tutorNombre} · en espera{" "}
                        {formatDistanceToNowStrict(new Date(e.fecha), {
                          locale: es,
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {e.servicioNombre ?? "—"}
                    </td>
                    <td className="max-w-[220px] px-4 py-3">
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {e.motivo ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {e.tieneConversacion ? (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/conversaciones?phone=${encodeURIComponent(e.telefono)}`,
                            )
                          }
                          className="relative inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-navy hover:bg-navy/5"
                        >
                          <MessagesSquare size={13} />
                          {formatTelefono(e.telefono)}
                          {e.noLeidos > 0 ? (
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-leaf px-1 text-[10px] font-semibold text-offblack">
                              {e.noLeidos}
                            </span>
                          ) : null}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {formatTelefono(e.telefono)}
                        </span>
                      )}
                    </td>
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
                    <td className="px-4 py-3">
                      <Badge variant={PRIORIDAD_BADGE[e.prioridad] === "coral" ? "coral" : "neutral"} className="normal-case tracking-normal">
                        {SOURCE_LABEL[e.source]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => agendar(e)}
                          className="h-8 px-3 text-xs"
                        >
                          <CalendarPlus size={14} />
                          Agendar
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
                                Marcar atendido
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
                ))
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
            <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+52 55 0000 0000" />
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
