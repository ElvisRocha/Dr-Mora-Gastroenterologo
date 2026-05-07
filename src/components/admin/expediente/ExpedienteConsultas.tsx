import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  Pencil,
  Plus,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useConsultas } from "@/store/expedienteStore";
import { useLang } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConsultaDetalle } from "./ConsultaDetalle";
import { ConsultaFormModal } from "@/components/admin/ConsultaFormModal";
import type { ConsultaMock } from "@/lib/mock";

export function ExpedienteConsultas({
  pacienteId,
  onNueva,
}: {
  pacienteId: string;
  onNueva: () => void;
}) {
  const { consultas } = useConsultas(pacienteId);
  const { t } = useLang();
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ConsultaMock | null>(null);

  const viewing = viewingId
    ? consultas.find((c) => c.id === viewingId) ?? null
    : null;

  if (viewing) {
    return (
      <>
        <ConsultaDetalle
          consulta={viewing}
          onBack={() => setViewingId(null)}
          onEdit={() => setEditing(viewing)}
        />
        <ConsultaFormModal
          pacienteId={pacienteId}
          consulta={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Historial de consultas
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {consultas.length} consulta{consultas.length === 1 ? "" : "s"}{" "}
            registrada{consultas.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button size="sm" onClick={onNueva}>
          <Plus size={14} strokeWidth={1.75} />
          Nueva consulta
        </Button>
      </div>

      {consultas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <FileText
            size={28}
            strokeWidth={1.5}
            className="mx-auto text-muted-foreground/60"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Aún no hay consultas registradas para este paciente.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pulsa "Nueva consulta" para registrar la primera.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {consultas.map((c) => {
            const servicio = t.servicios.items.find(
              (s) => s.slug === c.servicioSlug,
            );
            const firstDx = c.diagnosticos[0];
            return (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => setViewingId(c.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setViewingId(c.id);
                  }
                }}
                className="group block w-full cursor-pointer rounded-2xl border border-border bg-card text-left transition-all hover:border-navy/30 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/30"
              >
                <div className="flex items-start justify-between gap-3 px-5 pt-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={12} strokeWidth={1.75} />
                      <span className="capitalize">
                        {format(new Date(c.fecha), "dd MMM yyyy", {
                          locale: es,
                        })}
                      </span>
                    </span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} strokeWidth={1.75} />
                      {format(new Date(c.fecha), "HH:mm", { locale: es })}
                    </span>
                    <Badge variant="navy" className="ml-1">
                      <Stethoscope size={10} strokeWidth={1.75} />
                      {servicio?.nombre ?? c.servicioSlug}
                    </Badge>
                    {firstDx ? (
                      <Badge variant="leaf">{firstDx}</Badge>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(c);
                      }}
                      aria-label="Editar consulta"
                      title="Editar"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                    >
                      <Pencil size={13} strokeWidth={1.75} />
                    </button>
                    <ChevronRight
                      size={16}
                      strokeWidth={1.75}
                      className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-navy"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 px-5 pb-4 pt-2 text-sm">
                  <p className="font-medium text-foreground">{c.motivo}</p>
                  {c.planTratamiento ? (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Plan:
                      </span>{" "}
                      {c.planTratamiento}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal at list level too (for inline edit from row hover icon) */}
      {!viewing ? (
        <ConsultaFormModal
          pacienteId={pacienteId}
          consulta={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}
