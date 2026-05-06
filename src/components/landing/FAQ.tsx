import { ChevronDown, HelpCircle, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function FAQ() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.05 });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="scroll-mt-24 py-24 lg:py-32">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl">
          <div className="text-center" data-reveal>
            <div className="flex items-center justify-center gap-4">
              <span
                aria-hidden
                className="h-px w-12 bg-gradient-to-r from-transparent via-border to-transparent"
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                <HelpCircle size={18} strokeWidth={1.6} />
              </span>
              <span
                aria-hidden
                className="h-px w-12 bg-gradient-to-l from-transparent via-border to-transparent"
              />
            </div>
            <span className="mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t.faq.eyebrow}
            </span>
            <h2 className="mt-3 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-navy">
              {t.faq.title}
            </h2>
            <span
              aria-hidden
              className="mx-auto mt-6 block h-px w-24 bg-gradient-to-r from-transparent via-leaf to-transparent"
            />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="mt-12 space-y-3" data-reveal>
            {t.faq.items.map((item, idx) => {
              const isOpen = open === idx;
              return (
                <button
                  key={item.pregunta}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className={cn(
                    "block w-full rounded-2xl border bg-card px-6 py-5 text-left transition-all duration-300 ease-gentle",
                    isOpen
                      ? "border-navy/30 shadow-soft"
                      : "border-border/60 hover:border-navy/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-base font-medium leading-snug text-foreground sm:text-lg">
                      {item.pregunta}
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.75}
                      className={cn(
                        "shrink-0 transition-transform duration-300 ease-gentle",
                        isOpen
                          ? "rotate-180 text-navy"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-gentle",
                      isOpen
                        ? "mt-3 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-border/60 pt-3 text-sm leading-relaxed text-muted-foreground">
                        {item.respuesta}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            data-reveal
            className="mt-12 rounded-3xl border border-border bg-leaf/[0.06] p-8 text-center md:p-12"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf/20 text-leaf">
              <Stethoscope size={20} strokeWidth={1.6} />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold leading-tight text-navy">
              {t.faq.ctaTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t.faq.ctaDescription}
            </p>
            <div className="mt-7 flex justify-center">
              <ButtonLink to="/agendar-cita" size="lg">
                <Stethoscope size={18} strokeWidth={1.75} />
                {t.faq.ctaButton}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
