import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { galeriaMock, type GaleriaCategory } from "@/lib/mock";
import { cn } from "@/lib/cn";

type FilterKey = "todas" | GaleriaCategory;

const FILTER_ORDER: FilterKey[] = [
  "todas",
  "consultorio",
  "procedimientos",
  "nutricion",
  "pacientes",
];

export default function Galeria() {
  const { t } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.06 });
  const [filter, setFilter] = useState<FilterKey>("todas");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "todas"
        ? galeriaMock
        : galeriaMock.filter((img) => img.category === filter),
    [filter],
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () =>
    setLightboxIndex((i) =>
      i === null ? null : i === 0 ? filtered.length - 1 : i - 1,
    );
  const goNext = () =>
    setLightboxIndex((i) =>
      i === null ? null : i === filtered.length - 1 ? 0 : i + 1,
    );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filtered.length) {
      setLightboxIndex(null);
    }
  }, [filtered, lightboxIndex]);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const counterText =
    lightboxIndex !== null
      ? t.galeria.counter
          .replace("{{current}}", String(lightboxIndex + 1))
          .replace("{{total}}", String(filtered.length))
      : "";

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <h1 className="font-display text-fluid-h1 font-semibold leading-tight tracking-tight text-navy">
            {t.galeria.pageTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t.galeria.pageSubtitle}
          </p>
        </div>

        <div
          data-reveal
          className="mt-10 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Filtros de galería"
        >
          {FILTER_ORDER.map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-gentle",
                  active
                    ? "bg-navy text-offwhite shadow-soft"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t.galeria.filters[key]}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filtered.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
              aria-label={image.alt}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-gentle group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 ease-gentle group-hover:bg-foreground/30">
                <ZoomIn
                  size={28}
                  strokeWidth={1.75}
                  className="text-offwhite opacity-0 drop-shadow-md transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            {t.comun.cargando}
          </p>
        )}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={filtered[lightboxIndex]?.alt}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-offwhite/20"
            aria-label={t.comun.cerrar}
          >
            <X size={20} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-offwhite/20"
            aria-label="Anterior"
          >
            <ChevronLeft size={28} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-offwhite/20"
            aria-label="Siguiente"
          >
            <ChevronRight size={28} strokeWidth={1.75} />
          </button>

          <img
            key={lightboxIndex}
            src={filtered[lightboxIndex].src}
            alt={filtered[lightboxIndex].alt}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-offwhite/10 px-4 py-1.5 text-sm text-offwhite backdrop-blur">
            {counterText}
          </div>
        </div>
      )}
    </section>
  );
}
