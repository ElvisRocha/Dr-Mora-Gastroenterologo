import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ButtonLink } from "@/components/ui/Button";
import { doctorPortrait } from "@/lib/mock";

export function SobreElDoctor() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.07 });

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-5">
          <div
            data-reveal
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-elevated lg:max-w-none"
          >
            <img
              src={doctorPortrait}
              alt={t.doctor.nombre}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-offwhite/85 p-4 backdrop-blur">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t.doctor.eyebrow}
              </div>
              <div className="mt-1 font-display text-lg font-semibold text-navy">
                {t.doctor.nombre}
              </div>
              <div className="mt-1 text-xs leading-snug text-muted-foreground">
                {t.doctor.cargo}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <span className="eyebrow" data-reveal>
            {t.doctor.eyebrow}
          </span>
          <h2
            data-reveal
            className="mt-5 max-w-xl font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-navy"
          >
            {t.doctor.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            {t.doctor.bio.map((p, i) => (
              <p key={i} data-reveal>
                {p}
              </p>
            ))}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.doctor.credenciales.map((c) => (
              <li
                key={c}
                data-reveal
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm"
              >
                <CheckCircle2
                  size={18}
                  strokeWidth={1.6}
                  className="mt-0.5 shrink-0 text-leaf"
                />
                <span className="leading-snug text-foreground">{c}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10" data-reveal>
            <ButtonLink to="/sobre-el-doctor" variant="outline" size="md">
              {t.doctor.cta}
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
