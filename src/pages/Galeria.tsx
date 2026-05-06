import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { galeriaMock } from "@/lib/mock";
import { cn } from "@/lib/cn";

export default function Galeria() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.06 });

  const extended = [...galeriaMock, ...galeriaMock].map((item, i) => ({
    ...item,
    src: item.src.replace(/seed\/[^/]+/, `seed/gastrokids-galeria-${i}`),
  }));

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="container-wide">
        <div className="max-w-2xl" data-reveal>
          <span className="eyebrow">{t.galeria.eyebrow}</span>
          <h1 className="mt-5 font-display text-fluid-h1 font-semibold leading-tight tracking-tight text-navy">
            {t.galeria.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{t.galeria.subtitle}</p>
        </div>

        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4 lg:gap-4">
          {extended.map((item, i) => (
            <figure
              key={`${item.src}-${i}`}
              data-reveal
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card",
                item.span === "wide" && "col-span-2",
                item.span === "tall" && "row-span-2",
                i % 7 === 0 && "md:col-span-2 md:row-span-2",
              )}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-gentle group-hover:scale-[1.04]"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
