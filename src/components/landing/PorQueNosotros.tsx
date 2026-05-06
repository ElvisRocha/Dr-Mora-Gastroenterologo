import { GraduationCap, Smile, Stethoscope, Repeat2 } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const icons = [GraduationCap, Smile, Stethoscope, Repeat2];

export function PorQueNosotros() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.08 });

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <span className="eyebrow">{t.porQue.eyebrow}</span>
          <h2 className="mt-5 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-navy">
            {t.porQue.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t.porQue.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.porQue.pilares.map((pilar, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={pilar.titulo}
                data-reveal
                className="rounded-3xl border border-border bg-card p-7 transition-shadow duration-300 hover:shadow-elevated"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-offwhite">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold leading-tight text-navy">
                  {pilar.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pilar.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
