import { ArrowRight, ZoomIn } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ButtonLink } from "@/components/ui/Button";
import { galeriaDestacada } from "@/lib/mock";

export function GaleriaPreview() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.08 });

  const cards = t.galeria.featuredCards.slice(0, 4).map((card, i) => ({
    ...card,
    src: galeriaDestacada[i]?.src,
    alt: galeriaDestacada[i]?.alt ?? card.titulo,
  }));

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <span className="eyebrow">{t.galeria.eyebrow}</span>
          <h2 className="mt-5 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-navy">
            {t.galeria.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t.galeria.subtitle}
          </p>
          <span
            aria-hidden
            className="mx-auto mt-6 block h-px w-24 bg-gradient-to-r from-transparent via-leaf to-transparent"
          />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.titulo}
              data-reveal
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow duration-300 ease-gentle hover:shadow-elevated"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-gentle group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/15" />
                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-offwhite/85 text-navy opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn size={16} strokeWidth={1.75} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-navy">
                  {card.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.descripcion}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center" data-reveal>
          <ButtonLink to="/galeria" size="lg">
            {t.galeria.cta}
            <ArrowRight size={16} strokeWidth={1.75} />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
