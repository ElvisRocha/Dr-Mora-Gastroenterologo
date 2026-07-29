import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Calendar } from "lucide-react";
import { useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { heroIlustracion } from "@/lib/mock";

export function Hero() {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions?.reduced) return;
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from("[data-hero-eyebrow]", { y: 12, opacity: 0, duration: 0.5 })
            .from(
              "[data-hero-word]",
              { y: 32, opacity: 0, stagger: 0.07, duration: 0.7 },
              "-=0.2",
            )
            .from(
              "[data-hero-sub]",
              { y: 16, opacity: 0, duration: 0.6 },
              "-=0.4",
            )
            .from(
              "[data-hero-badges] > *",
              { y: 10, opacity: 0, duration: 0.4, stagger: 0.05 },
              "-=0.3",
            )
            .from(
              "[data-hero-cta]",
              { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 },
              "-=0.2",
            )
            .from(
              "[data-hero-image]",
              { scale: 1.05, opacity: 0, duration: 1 },
              "<-0.6",
            );
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const titleWords = `${t.hero.titlePart1} ${t.hero.titlePart2}`.split(" ");

  return (
    <section ref={root} className="relative overflow-hidden">
      <div className="bg-grain absolute inset-0 -z-10" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-leaf/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-navy/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-offwhite" />
        <div className="absolute left-1/2 top-1/2 h-28 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-2xl" />
      </div>

      <div className="container-wide grid gap-10 pb-20 pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-28 lg:pt-20">
        <div className="lg:col-span-7 xl:col-span-7">
          <span data-hero-eyebrow className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
            {t.hero.eyebrow}
          </span>

          <h1 className="mt-6 max-w-[18ch] font-display text-fluid-display font-semibold leading-[0.98] tracking-tight text-navy">
            {titleWords.map((word, i) => (
              <span
                key={`${word}-${i}`}
                data-hero-word
                className="mr-[0.25em] inline-block"
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            data-hero-sub
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {t.hero.subtitle}
          </p>

          <div
            data-hero-badges
            className="mt-10 flex flex-wrap gap-2"
          >
            {t.hero.badges.map((b, i) => (
              <Badge
                key={b}
                variant={
                  ["navy", "leaf", "teal", "amber"][i % 4] as
                    | "navy"
                    | "leaf"
                    | "teal"
                    | "amber"
                }
              >
                {b}
              </Badge>
            ))}
          </div>

          <div className="mt-10 flex max-w-xl justify-center lg:mt-16">
            <ButtonLink
              data-hero-cta
              to="/agendar-cita"
              size="lg"
              className="group"
            >
              <Calendar size={18} strokeWidth={1.75} />
              {t.hero.ctaPrimary}
              <span className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-offwhite/15 transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight size={14} strokeWidth={2} />
              </span>
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div
            data-hero-image
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-elevated lg:max-w-none"
          >
            <img
              src={heroIlustracion}
              alt="Manos del médico registrando la consulta en la laptop, junto al estetoscopio"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
