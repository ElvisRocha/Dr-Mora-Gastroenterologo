import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useDisponibilidad } from "@/hooks/useDisponibilidad";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

const formatHora = (iso: string) => iso.slice(11, 16);

export function StepFechaHora({
  servicioSlug,
  fecha,
  hora,
  onChange,
}: {
  servicioSlug: string | null;
  fecha: string | null;
  hora: string | null;
  onChange: (patch: { fecha?: string; hora?: string }) => void;
}) {
  const { t } = useLang();
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { data: slots, isLoading } = useDisponibilidad(servicioSlug, fecha);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy">
          {t.booking.seleccionarFecha}
        </h2>
        <Field label={t.booking.seleccionarFecha} className="mt-6">
          <Input
            type="date"
            value={fecha ?? ""}
            min={minDate}
            onChange={(e) => onChange({ fecha: e.target.value, hora: undefined })}
          />
        </Field>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-navy">
          {t.booking.seleccionarHora}
        </h2>
        <div className="mt-6 min-h-[160px]">
          {!fecha ? (
            <p className="text-sm text-muted-foreground">
              {t.booking.seleccionarFecha}
            </p>
          ) : isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" />
              {t.comun.cargando}
            </div>
          ) : !slots || slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.booking.sinSlots}</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const h = formatHora(slot.start);
                const active = hora === h;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => onChange({ hora: h })}
                    className={cn(
                      "rounded-xl border px-2.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-navy bg-navy text-offwhite"
                        : "border-border bg-card text-foreground hover:border-navy/40",
                    )}
                    aria-pressed={active}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
