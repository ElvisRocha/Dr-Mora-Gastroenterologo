import { format } from "date-fns";
import { es } from "date-fns/locale";
import { citasMock, type CitaMock } from "@/lib/mock";
import { useLang } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/Badge";

const ESTADO_BADGE: Record<
  CitaMock["estado"],
  "navy" | "leaf" | "neutral" | "coral" | "amber"
> = {
  agendada: "navy",
  confirmada: "leaf",
  realizada: "neutral",
  cancelada: "coral",
  no_asistio: "amber",
};

export function ExpedienteCitas({ pacienteId }: { pacienteId: string }) {
  const { t } = useLang();
  const citas = citasMock
    .filter((c) => c.pacienteId === pacienteId)
    .sort((a, b) => +new Date(b.fechaHora) - +new Date(a.fechaHora));

  if (citas.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Sin citas registradas para este paciente.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Fecha</th>
            <th className="px-5 py-3">Servicio</th>
            <th className="px-5 py-3">Duración</th>
            <th className="px-5 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {citas.map((c) => {
            const servicio = t.servicios.items.find(
              (s) => s.slug === c.servicioSlug,
            );
            return (
              <tr key={c.id} className="hover:bg-muted/20">
                <td className="px-5 py-3 capitalize text-muted-foreground">
                  {format(
                    new Date(c.fechaHora),
                    "EEE dd MMM yyyy · HH:mm",
                    { locale: es },
                  )}
                </td>
                <td className="px-5 py-3 text-foreground">
                  {servicio?.nombre ?? c.servicioSlug}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {c.duracionMin} min
                </td>
                <td className="px-5 py-3">
                  <Badge variant={ESTADO_BADGE[c.estado]}>{c.estado}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
