import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight, Quote, Star, X } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { cn } from "@/lib/cn";

const AUTOPLAY_MS = 5000;
const TRANSITION_MS = 400;
const SWIPE_THRESHOLD = 50;
const TRUNCATE_DESKTOP = 200;
const TRUNCATE_MOBILE = 150;

function getItemsPerView(width: number): 1 | 2 | 3 {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function getInitials(name: string) {
  return name
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonios() {
  const { t, lang } = useLang();
  const reveal = useGsapReveal<HTMLElement>();
  const items = t.testimonios.items;

  const [itemsPerView, setItemsPerView] = useState<1 | 2 | 3>(3);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setItemsPerView(getItemsPerView(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [index, maxIndex]);

  const numPages = Math.ceil(items.length / itemsPerView);
  const currentPage = Math.min(numPages - 1, Math.floor(index / itemsPerView));

  const next = useCallback(() => {
    setIndex((prev) => {
      const candidate = prev + itemsPerView;
      if (candidate > maxIndex) return 0;
      return candidate;
    });
  }, [itemsPerView, maxIndex]);

  const prev = useCallback(() => {
    setIndex((prevIdx) => {
      if (prevIdx === 0) return maxIndex;
      return Math.max(0, prevIdx - itemsPerView);
    });
  }, [itemsPerView, maxIndex]);

  // Autoplay
  useEffect(() => {
    if (isPaused || modalIdx !== null || items.length <= itemsPerView) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isPaused, modalIdx, items.length, itemsPerView, next]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalIdx !== null) {
        if (e.key === "Escape") setModalIdx(null);
        if (e.key === "ArrowLeft")
          setModalIdx((i) =>
            i === null ? i : (i - 1 + items.length) % items.length,
          );
        if (e.key === "ArrowRight")
          setModalIdx((i) => (i === null ? i : (i + 1) % items.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalIdx, items.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const trackTransform = useMemo(
    () => `translateX(-${(index * 100) / items.length}%)`,
    [index, items.length],
  );

  const truncateLength =
    itemsPerView === 1 ? TRUNCATE_MOBILE : TRUNCATE_DESKTOP;

  const labels = {
    leerMas: lang === "es" ? "Leer más" : "Read more",
    cerrar: lang === "es" ? "Cerrar" : "Close",
    anterior: lang === "es" ? "Anterior" : "Previous",
    siguiente: lang === "es" ? "Siguiente" : "Next",
    pagina: lang === "es" ? "Página" : "Page",
    de: lang === "es" ? "de" : "of",
  };

  return (
    <>
      <section ref={reveal} className="bg-muted/40 py-24 lg:py-32">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="eyebrow">{t.testimonios.eyebrow}</span>
            <h2 className="mt-5 font-display text-fluid-h1 font-semibold leading-[1.05] tracking-tight text-navy">
              {t.testimonios.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t.testimonios.subtitle}
            </p>
            <span
              aria-hidden
              className="mx-auto mt-6 block h-px w-24 bg-gradient-to-r from-transparent via-leaf to-transparent"
            />
          </div>

          <div
            className="relative mt-14"
            data-reveal
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div
              className="overflow-hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label={t.testimonios.title}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex items-stretch"
                style={{
                  transform: trackTransform,
                  transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                  width: `${(items.length * 100) / itemsPerView}%`,
                }}
              >
                {items.map((it, i) => {
                  const fullText = it.texto;
                  const truncated =
                    fullText.length > truncateLength
                      ? `${fullText.slice(0, truncateLength).trimEnd()}…`
                      : fullText;
                  const needsModal = fullText.length > truncateLength;

                  return (
                    <article
                      key={`${it.autor}-${i}`}
                      className="px-3"
                      style={{ width: `${100 / items.length}%` }}
                      aria-roledescription="slide"
                      aria-label={`${i + 1} / ${items.length}`}
                    >
                      <div className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow duration-300 hover:shadow-elevated">
                        <div className="flex items-center justify-between">
                          <Quote
                            size={26}
                            strokeWidth={1.4}
                            className="text-leaf/60"
                          />
                          <div className="flex gap-0.5" aria-label="5 / 5">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star
                                key={s}
                                size={14}
                                className="fill-amber text-amber"
                              />
                            ))}
                          </div>
                        </div>

                        <blockquote className="text-sm leading-relaxed text-foreground">
                          &ldquo;{truncated}&rdquo;
                        </blockquote>

                        {needsModal ? (
                          <button
                            type="button"
                            onClick={() => setModalIdx(i)}
                            className="-mt-1 self-start text-xs font-semibold uppercase tracking-[0.14em] text-navy underline-offset-4 transition-colors hover:text-leaf hover:underline"
                          >
                            {labels.leerMas}
                          </button>
                        ) : null}

                        <div className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/10 font-display text-sm font-semibold text-navy">
                            {getInitials(it.autor)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-foreground">
                              {it.autor}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {it.relacion}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {items.length > itemsPerView ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label={labels.anterior}
                  className="absolute -left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-navy shadow-soft transition-all hover:-translate-x-0.5 hover:shadow-elevated md:flex lg:-left-5"
                >
                  <ChevronLeft size={18} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label={labels.siguiente}
                  className="absolute -right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-navy shadow-soft transition-all hover:translate-x-0.5 hover:shadow-elevated md:flex lg:-right-5"
                >
                  <ChevronRight size={18} strokeWidth={1.75} />
                </button>
              </>
            ) : null}
          </div>

          {numPages > 1 ? (
            <div
              className="mt-10 flex items-center justify-center gap-2"
              role="tablist"
              aria-label={`${labels.pagina} ${currentPage + 1} ${labels.de} ${numPages}`}
            >
              {Array.from({ length: numPages }).map((_, i) => {
                const active = i === currentPage;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`${labels.pagina} ${i + 1}`}
                    onClick={() =>
                      setIndex(Math.min(i * itemsPerView, maxIndex))
                    }
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 ease-gentle",
                      active ? "w-8 bg-navy" : "w-2 bg-border hover:bg-navy/40",
                    )}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {modalIdx !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-offblack/70 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t.testimonios.title}
          onClick={() => setModalIdx(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-8 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalIdx(null)}
              aria-label={labels.cerrar}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={16} strokeWidth={1.75} />
            </button>

            <Quote size={28} strokeWidth={1.4} className="text-leaf/60" />
            <div className="mt-2 flex gap-0.5" aria-label="5 / 5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={16} className="fill-amber text-amber" />
              ))}
            </div>
            <blockquote className="mt-5 text-base leading-relaxed text-foreground">
              &ldquo;{items[modalIdx].texto}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/10 font-display text-sm font-semibold text-navy">
                  {getInitials(items[modalIdx].autor)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {items[modalIdx].autor}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {items[modalIdx].relacion}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={labels.anterior}
                  onClick={() =>
                    setModalIdx(
                      (i) => (i! - 1 + items.length) % items.length,
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-navy hover:bg-muted"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono text-muted-foreground">
                  {modalIdx + 1} / {items.length}
                </span>
                <button
                  type="button"
                  aria-label={labels.siguiente}
                  onClick={() =>
                    setModalIdx((i) => (i! + 1) % items.length)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-navy hover:bg-muted"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
