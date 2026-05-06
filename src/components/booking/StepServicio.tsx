import { Stethoscope, Microscope, Activity, Wind, Carrot, CalendarHeart, Waves, Sparkles, type LucideIcon } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { serviciosMock } from "@/lib/mock";
import { cn } from "@/lib/cn";

const iconMap: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  scope: Microscope,
  intestine: Activity,
  wave: Waves,
  leaf: Sparkles,
  lung: Wind,
  carrot: Carrot,
  calendar: CalendarHeart,
};

export function StepServicio({
  value,
  onChange,
}: {
  value?: string;
  onChange: (slug: string) => void;
}) {
  const { t } = useLang();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {t.servicios.items.map((s) => {
          const meta = serviciosMock.find((m) => m.slug === s.slug);
          const Icon = iconMap[meta?.icon ?? "stethoscope"];
          const active = value === s.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => onChange(s.slug)}
              className={cn(
                "group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-navy bg-navy/[0.04] shadow-soft"
                  : "border-border bg-card hover:border-navy/40 hover:bg-muted/30",
              )}
              aria-pressed={active}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-navy transition-colors",
                  active && "bg-navy text-offwhite border-navy",
                )}
              >
                <Icon size={18} strokeWidth={1.6} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{s.nombre}</span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {meta?.duracion} min
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {s.descripcion}
                </p>
              </div>
            </button>
          );
        })}
    </div>
  );
}
