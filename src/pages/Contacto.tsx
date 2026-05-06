import { Mail, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ButtonAnchor } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/mock";

export default function Contacto() {
  const { t, lang } = useLang();
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.07 });

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="container-wide grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <span className="eyebrow">{t.nav.contacto}</span>
          <h1 className="mt-5 font-display text-fluid-h1 font-semibold leading-tight tracking-tight text-navy">
            {lang === "es"
              ? "Hablemos sobre la salud digestiva de tu hijo"
              : "Let's talk about your child's digestive health"}
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            {lang === "es"
              ? "Responderemos a tu mensaje en horario de consulta. Para urgencias, acude al servicio hospitalario más cercano."
              : "We respond during clinic hours. For real emergencies, please go to the nearest hospital."}
          </p>

          <ul className="mt-10 space-y-4 text-sm" data-reveal>
            <li className="flex items-start gap-3">
              <MapPin size={18} strokeWidth={1.6} className="mt-0.5 text-leaf" />
              <div>
                <div className="font-medium text-foreground">
                  {lang === "es" ? "Consultorio" : "Office"}
                </div>
                <div className="text-muted-foreground">{t.footer.contact.address}</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={18} strokeWidth={1.6} className="mt-0.5 text-leaf" />
              <div>
                <div className="font-medium text-foreground">
                  {lang === "es" ? "Horario" : "Hours"}
                </div>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">
                  {t.footer.hours.items.map((h) => (
                    <li key={h.dia} className="flex flex-wrap gap-x-2">
                      <span className="font-medium text-foreground">{h.dia}</span>
                      <span>{h.horario}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            {t.footer.contact.phones.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Phone size={18} strokeWidth={1.6} className="mt-0.5 text-leaf" />
                <a
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <Mail size={18} strokeWidth={1.6} className="mt-0.5 text-leaf" />
              <a
                href={`mailto:${t.footer.contact.email}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {t.footer.contact.email}
              </a>
            </li>
          </ul>

          <div className="mt-8" data-reveal>
            <ButtonAnchor href={whatsappLink} target="_blank" rel="noreferrer" variant="secondary">
              <MessageCircle size={18} strokeWidth={1.75} />
              {lang === "es" ? "Escribir por WhatsApp" : "Message on WhatsApp"}
            </ButtonAnchor>
          </div>
        </div>

        <div
          data-reveal
          className="overflow-hidden rounded-3xl border border-border bg-muted shadow-soft lg:col-span-7"
        >
          <iframe
            title="Mapa Gastro Kids"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-99.1900%2C19.4250%2C-99.1500%2C19.4450&amp;layer=mapnik"
            className="h-[480px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
