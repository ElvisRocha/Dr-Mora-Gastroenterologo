import {
  Stethoscope,
  Microscope,
  Activity,
  Wind,
  Carrot,
  CalendarHeart,
  Waves,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { serviciosMock } from "@/lib/mock";

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

export function ServiciosGrid() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.06 });

  const items = t.servicios.items.map((it) => {
    const meta = serviciosMock.find((m) => m.slug === it.slug);
    return { ...it, icon: meta?.icon ?? "stethoscope", duracion: meta?.duracion ?? 30, destacado: meta?.destacado };
  });

  return (
    <section
      id="servicios"
      ref={ref}
      className="relative scroll-mt-24 py-24 lg:py-32"
    >
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">{t.servicios.eyebrow}</span>
            <h2 className="mt-5 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-navy">
              {t.servicios.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              {t.servicios.subtitle}
            </p>
          </div>

          <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
            {items.map((it) => {
              const Icon = iconMap[it.icon] ?? Stethoscope;
              return (
                <Card
                  key={it.slug}
                  data-reveal
                  className="group relative flex flex-col gap-4 hover:shadow-elevated"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={
                        "flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted text-navy transition-colors group-hover:bg-navy group-hover:text-offwhite"
                      }
                    >
                      <Icon size={20} strokeWidth={1.6} />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {it.duracion} min
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{it.nombre}</CardTitle>
                    <CardDescription>{it.descripcion}</CardDescription>
                  </div>
                  {it.destacado ? (
                    <span className="absolute right-5 top-5 rounded-full bg-leaf/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-leaf">
                      ★
                    </span>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
