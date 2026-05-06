import { Clock, Globe } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { serviciosMock } from "@/lib/mock";

type Props = {
  servicioSlug: string | null;
};

export function ServiceSummary({ servicioSlug }: Props) {
  const { t, lang } = useLang();
  const servicio = t.servicios.items.find((s) => s.slug === servicioSlug);
  const meta = serviciosMock.find((m) => m.slug === servicioSlug);

  if (!servicio) {
    return (
      <p className="text-sm text-muted-foreground">
        {t.booking.seleccionarServicio}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {lang === "es" ? "Servicio seleccionado" : "Selected service"}
        </p>
        <h3 className="font-display text-lg leading-tight text-foreground">
          {servicio.nombre}
        </h3>
      </div>

      <div className="space-y-3">
        {meta?.duracion ? (
          <div className="flex items-center gap-2 text-sm font-medium text-navy">
            <Clock size={14} strokeWidth={1.75} />
            <span>{meta.duracion} min</span>
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe size={14} strokeWidth={1.75} className="shrink-0" />
          <span>America/Mexico_City</span>
        </div>
      </div>
    </div>
  );
}
