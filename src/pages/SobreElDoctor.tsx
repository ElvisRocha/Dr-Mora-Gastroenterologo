import { CheckCircle2, GraduationCap, Stethoscope, BookOpen } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ButtonLink } from "@/components/ui/Button";
import { doctorPortrait } from "@/lib/mock";

const trayectoria = {
  es: [
    {
      anos: "2008 — 2014",
      titulo: "Medicina General",
      institucion: "Facultad de Medicina, UNAM",
    },
    {
      anos: "2014 — 2017",
      titulo: "Residencia en Pediatría",
      institucion: "Hospital Infantil de México Federico Gómez",
    },
    {
      anos: "2017 — 2019",
      titulo: "Subespecialidad en Gastroenterología, Hepatología y Nutrición Pediátrica",
      institucion: "Instituto Nacional de Pediatría",
    },
    {
      anos: "2019 — 2020",
      titulo: "Diplomado en Endoscopía Digestiva Pediátrica",
      institucion: "Boston Children's Hospital — Observership",
    },
    {
      anos: "2020 — actual",
      titulo: "Práctica clínica privada y hospitalaria",
      institucion: "Gastro Kids · San José, Costa Rica",
    },
  ],
  en: [
    {
      anos: "2008 — 2014",
      titulo: "Medical Doctor",
      institucion: "School of Medicine, UNAM",
    },
    {
      anos: "2014 — 2017",
      titulo: "Pediatrics Residency",
      institucion: "Hospital Infantil de México Federico Gómez",
    },
    {
      anos: "2017 — 2019",
      titulo: "Sub-specialty in Pediatric Gastroenterology, Hepatology and Nutrition",
      institucion: "Instituto Nacional de Pediatría",
    },
    {
      anos: "2019 — 2020",
      titulo: "Pediatric Digestive Endoscopy Fellowship",
      institucion: "Boston Children's Hospital — Observership",
    },
    {
      anos: "2020 — present",
      titulo: "Clinical and hospital practice",
      institucion: "Gastro Kids · Mexico City",
    },
  ],
};

export default function SobreElDoctor() {
  const { t, lang } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.06 });
  const items = trayectoria[lang];

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div
            data-reveal
            className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-elevated lg:max-w-none"
          >
            <img
              src={doctorPortrait}
              alt={t.doctor.nombre}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div data-reveal className="mt-6 rounded-3xl border border-border bg-card p-6">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t.doctor.eyebrow}
            </div>
            <div className="mt-1 font-display text-2xl font-semibold text-navy">
              {t.doctor.nombre}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{t.doctor.cargo}</div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h1
            data-reveal
            className="max-w-xl font-display text-fluid-h1 font-semibold leading-tight tracking-tight text-navy"
          >
            {t.doctor.title}
          </h1>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            {t.doctor.bio.map((p, i) => (
              <p key={i} data-reveal>
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12" data-reveal>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-navy">
              <GraduationCap size={20} strokeWidth={1.6} />
              {lang === "es" ? "Trayectoria" : "Career path"}
            </h2>
            <ol className="mt-6 space-y-4">
              {items.map((it) => (
                <li
                  key={it.anos}
                  data-reveal
                  className="grid gap-1 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-6"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
                    {it.anos}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{it.titulo}</div>
                    <div className="text-sm text-muted-foreground">{it.institucion}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2" data-reveal>
            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <Stethoscope size={20} className="text-navy" strokeWidth={1.6} />
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">
                {lang === "es" ? "Áreas de práctica" : "Practice areas"}
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {t.doctor.credenciales.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-leaf" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <BookOpen size={20} className="text-navy" strokeWidth={1.6} />
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">
                {lang === "es" ? "Filosofía clínica" : "Clinical philosophy"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {lang === "es"
                  ? "Pedimos solo los estudios necesarios. Explicamos el plan a la familia con palabras claras y al niño con palabras propias para su edad."
                  : "We order only the studies needed. We explain the plan to the family in clear words and to the child in language that fits their age."}
              </p>
            </div>
          </div>

          <div className="mt-10" data-reveal>
            <ButtonLink to="/agendar-cita" size="lg">
              {lang === "es" ? "Agendar consulta" : "Book a consult"}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
