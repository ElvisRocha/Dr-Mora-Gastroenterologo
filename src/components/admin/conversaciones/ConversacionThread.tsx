import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  CheckCircle2,
  ClipboardList,
  FileText,
  Hand,
  ImageIcon,
  Info,
  Paperclip,
  Send,
  UserX,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/cn";
import { CanalIcon } from "./CanalIcon";
import {
  ASISTENTE_NOMBRE,
  buildTimeline,
  EVENTO_LABEL,
  eventoTono,
  formatTelefono,
  type ConversacionMock,
  type EventoMock,
  type EventoTipo,
  type MensajeMock,
} from "@/lib/data/conversaciones";

const EVENTO_ICON: Record<EventoTipo, typeof CalendarPlus> = {
  cita_agendada: CalendarPlus,
  cita_reagendada: CalendarClock,
  cita_confirmada: CalendarCheck,
  cita_cancelada: CalendarX,
  cita_completada: CheckCircle2,
  cita_no_asistio: UserX,
  formulario_primera_vez: ClipboardList,
  recordatorio_24h: CalendarClock,
};

const TONE_CLASS: Record<string, string> = {
  success: "bg-leaf/12 text-leaf border-leaf/25",
  danger: "bg-coral/12 text-coral border-coral/25",
  info: "bg-teal/12 text-teal border-teal/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

function iniciales(nombre: string) {
  const parts = nombre.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "#";
}

function MensajeBubble({
  m,
  onAtender,
}: {
  m: MensajeMock;
  onAtender: (id: string) => void;
}) {
  const saliente = m.direccion === "saliente";
  const esBot = m.autor === "bot";
  const destacado = !saliente && (m.solicitaDocumento || m.requiereRevision) && !m.atendido;

  const autorLabel = saliente
    ? esBot
      ? ASISTENTE_NOMBRE
      : m.autorNombre ?? "Tú"
    : "";

  return (
    <div className={cn("flex", saliente ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2 shadow-soft",
          saliente
            ? esBot
              ? "rounded-br-sm bg-teal/15 text-foreground"
              : "rounded-br-sm bg-navy text-offwhite"
            : destacado
              ? "rounded-bl-sm border border-amber/50 bg-amber/15 text-foreground ring-1 ring-amber/40"
              : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {autorLabel ? (
          <p
            className={cn(
              "mb-0.5 text-[10px] font-semibold uppercase tracking-wide",
              saliente && !esBot ? "text-offwhite/70" : "text-muted-foreground",
            )}
          >
            {autorLabel}
          </p>
        ) : null}

        {destacado ? (
          <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber">
            {m.solicitaDocumento ? (
              <>
                <FileText size={11} /> Solicitó un documento
              </>
            ) : (
              <>
                <Paperclip size={11} /> Archivo por revisar
              </>
            )}
          </p>
        ) : null}

        {m.media ? (
          <div
            className={cn(
              "mb-1 flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs",
              saliente && !esBot
                ? "border-offwhite/25 bg-offwhite/10"
                : "border-border bg-card/60",
            )}
          >
            {m.media.tipo === "imagen" ? (
              <ImageIcon size={16} className="shrink-0 text-teal" />
            ) : (
              <FileText size={16} className="shrink-0 text-navy" />
            )}
            <span className="truncate">
              {m.media.nombre ?? (m.media.tipo === "imagen" ? "Imagen" : "Documento")}
            </span>
          </div>
        ) : null}

        {m.texto ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {m.texto}
          </p>
        ) : null}

        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-2 text-[10px]",
            saliente && !esBot ? "text-offwhite/60" : "text-muted-foreground",
          )}
        >
          {destacado ? (
            <button
              type="button"
              onClick={() => onAtender(m.id)}
              className="rounded-full bg-amber/20 px-2 py-0.5 font-medium text-amber hover:bg-amber/30"
            >
              Marcar atendido
            </button>
          ) : null}
          <span>{format(new Date(m.fecha), "d MMM · h:mm a", { locale: es })}</span>
        </div>
      </div>
    </div>
  );
}

function EventoPill({ e }: { e: EventoMock }) {
  const Icon = EVENTO_ICON[e.tipo];
  const actorTxt =
    e.actor === "bot"
      ? ASISTENTE_NOMBRE
      : e.actor === "tutor"
        ? "el tutor"
        : (e.actorNombre ?? "el personal");
  return (
    <div className="flex justify-center">
      <div
        className={cn(
          "inline-flex max-w-[90%] items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium",
          TONE_CLASS[eventoTono(e.tipo)],
        )}
      >
        <Icon size={12} className="shrink-0" />
        <span className="truncate">
          {EVENTO_LABEL[e.tipo]}
          {e.descripcion ? ` · ${e.descripcion}` : ""} · por {actorTxt}
        </span>
        <span className="shrink-0 opacity-70">
          {format(new Date(e.fecha), "d MMM", { locale: es })}
        </span>
      </div>
    </div>
  );
}

export function ConversacionThread({
  conversacion,
  mensajes,
  eventos,
  onBack,
  onToggleModo,
  onEnviar,
  onAtenderMensaje,
  onOpenFicha,
}: {
  conversacion: ConversacionMock;
  mensajes: MensajeMock[];
  eventos: EventoMock[];
  onBack?: () => void;
  onToggleModo: () => void;
  onEnviar: (texto: string) => void;
  onAtenderMensaje: (id: string) => void;
  onOpenFicha?: () => void;
}) {
  const [texto, setTexto] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const timeline = useMemo(
    () => buildTimeline(mensajes, eventos),
    [mensajes, eventos],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [timeline.length, conversacion.id]);

  const paused = conversacion.modo === "humano";

  const send = () => {
    const t = texto.trim();
    if (!t) return;
    onEnviar(t);
    setTexto("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Volver"
          >
            <ArrowLeft size={16} />
          </button>
        ) : null}
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-navy/15 to-leaf/15 text-xs font-semibold text-navy">
          {iniciales(conversacion.contactoNombre)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
            {conversacion.contactoNombre}
            <CanalIcon canal={conversacion.canal} size={12} />
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {formatTelefono(conversacion.telefono)}
            {conversacion.pacienteNombre ? ` · ${conversacion.pacienteNombre}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleModo}
          className={cn(
            "hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:inline-flex",
            paused
              ? "border-coral/40 bg-coral/10 text-coral hover:bg-coral/20"
              : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          {paused ? (
            <>
              <Bot size={13} /> Activar {ASISTENTE_NOMBRE}
            </>
          ) : (
            <>
              <Hand size={13} /> Atender yo
            </>
          )}
        </button>
        {onOpenFicha ? (
          <button
            type="button"
            onClick={onOpenFicha}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted xl:hidden"
            aria-label="Ficha del paciente"
          >
            <Info size={16} />
          </button>
        ) : null}
      </div>

      {/* Status banner */}
      <div
        className={cn(
          "flex items-center gap-2 px-3.5 py-1.5 text-xs",
          paused ? "bg-coral/10 text-coral" : "bg-teal/8 text-teal",
        )}
      >
        {paused ? (
          <>
            <Hand size={13} />
            Estás atendiendo esta conversación · {ASISTENTE_NOMBRE} en pausa
          </>
        ) : (
          <>
            <Bot size={13} />
            {ASISTENTE_NOMBRE} está respondiendo automáticamente
          </>
        )}
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-muted/20 px-3.5 py-4">
        {timeline.map((item) =>
          item.kind === "mensaje" ? (
            <MensajeBubble key={item.key} m={item.data} onAtender={onAtenderMensaje} />
          ) : (
            <EventoPill key={item.key} e={item.data} />
          ),
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-2.5">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-card px-2.5 py-1.5 focus-within:border-navy/40">
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            aria-label="Adjuntar"
            title="Adjuntar (demo)"
          >
            <Paperclip size={16} />
          </button>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Escribe un mensaje…"
            className="max-h-28 min-h-[2rem] flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={send}
            disabled={!texto.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-offwhite transition-opacity hover:bg-navy/90 disabled:opacity-40"
            aria-label="Enviar"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
