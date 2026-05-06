import { Calendar } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ButtonLink } from "@/components/ui/Button";
import logoUrl from "@/assets/logo.png";

export function CTAFinal() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.08 });

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="container-wide">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] border border-border bg-navy p-10 text-offwhite shadow-elevated md:p-16"
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-leaf/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-coral/15 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col items-center gap-8 text-center">
            <img
              src={logoUrl}
              alt="Gastro Kids"
              className="h-20 w-auto md:h-24 lg:h-28"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <h2 className="max-w-2xl font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight">
              {t.cta.title}
            </h2>
            <ButtonLink to="/agendar-cita" variant="secondary" size="lg">
              <Calendar size={18} strokeWidth={1.75} />
              {t.cta.primary}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
